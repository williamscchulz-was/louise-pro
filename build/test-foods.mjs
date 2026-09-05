// Regression tests against the actual FB adapter, using an in-memory Firestore double.
// No network and no production writes. Run: node build/test-foods.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const start = html.indexOf('window.FB = {');
const source = html.slice(start, html.indexOf('\n};', start) + 3);
const docs = new Map();
const listeners = new Map();
let failNext = false;
const snapshot = path => ({exists:docs.has(path), data:()=>structuredClone(docs.get(path))});
const write = (path, data, opts) => {
  const result = opts?.merge ? {...docs.get(path)} : {};
  for (const [key, value] of Object.entries(data)) {
    result[key] = value?.union ? [...new Set([...(result[key] || []), ...value.union])] : value;
  }
  docs.set(path, result);
};
const notify = () => { for (const [path, callbacks] of listeners) for (const cb of callbacks) cb(snapshot(path)); };
const collection = (path, where) => ({
  where:(key, op, value)=>collection(path, [key, value]),
  async get() {
    return {docs:[...docs].filter(([p,d])=>p.startsWith(path+'/') && p.slice(path.length+1).indexOf('/')<0 && (!where || d[where[0]]===where[1])).map(([p,d])=>({id:p.split('/').at(-1),data:()=>structuredClone(d)}))};
  },
  doc(id) {
    const p = path+'/'+id;
    return {
      path:p,
      collection:name=>collection(p+'/'+name),
      get:async()=>snapshot(p),
      async set(data, opts) { write(p,data,opts); notify(); },
      onSnapshot(cb) {
        if (!listeners.has(p)) listeners.set(p,new Set());
        listeners.get(p).add(cb); cb(snapshot(p));
        return ()=>listeners.get(p).delete(cb);
      },
    };
  },
});
const db = {collection, batch() {
  const ops=[];
  return {
    set:(ref,data,opts)=>ops.push(()=>write(ref.path,data,opts)),
    delete:ref=>ops.push(()=>docs.delete(ref.path)),
    async commit() {
      if(failNext){failNext=false;throw new Error('rejected batch');}
      ops.forEach(op=>op()); notify();
    },
  };
}};
const context=vm.createContext({window:{},db,firebase:{firestore:{FieldValue:{arrayUnion:(...union)=>({union})}}},console});
vm.runInContext(source,context);
const FB=context.window.FB;
let phoneA,phoneB;
const unsubA=FB.subFoods(x=>phoneA=x);
const unsubB=FB.subFoods(x=>phoneB=x);
await FB.saveFood('  Abacate   maduro ');
assert(phoneA.includes('Abacate maduro') && phoneB.includes('Abacate maduro'));
assert.equal([...docs.keys()].filter(p=>p.startsWith('entries/')).length,0,'Catalog save must not create a meal');
unsubA();
let reopened;
FB.subFoods(x=>reopened=x);
assert(reopened.includes('Abacate maduro'),'Reopened form must receive catalog without meals');
await Promise.all([FB.saveFood('Pera'),FB.saveFood('Maçã')]);
assert(phoneB.includes('Pera') && phoneB.includes('Maçã'),'Concurrent adds must preserve both foods');
await FB.saveFood('Pera');
assert.equal(phoneB.filter(x=>x==='Pera').length,1);
await assert.rejects(()=>FB.saveFood('   '));
await FB.saveEntriesBatch([{id:'meal',type:'food',name:'Cenoura',date:'2026-09-05',time:'12:00'}]);
assert(phoneB.includes('Cenoura'));
await FB.deleteEntriesBatch(['meal']);
assert(phoneB.includes('Cenoura'),'Deleting meal must not delete food');
failNext=true;
await assert.rejects(()=>FB.saveEntriesBatch([{id:'failed',type:'food',name:'Rejected'}]));
assert(!docs.has('entries/failed') && !phoneB.includes('Rejected'),'Catalog and meal must commit atomically');
docs.set('entries/old',{id:'old',type:'food',name:'Abóbora',date:'2020-01-01'});
await FB.migrateFoods();
assert(phoneB.includes('Abóbora') && phoneB.includes('Pera'),'Migration must include old meals and preserve saved catalog');
assert.equal(docs.get('config/foods').legacyImported,true);
const backup=await FB.exportAll();
assert(backup.foods.includes('Abacate maduro'),'Export must include standalone food');
docs.delete('config/foods');
await FB.importAll(backup);
assert(phoneB.includes('Abacate maduro'));
await FB.importAll({_meta:{app:'louise-pro'},entries:[{id:'legacy',type:'food',name:'Manga'}]});
assert(phoneB.includes('Manga') && phoneB.includes('Abacate maduro'),'Legacy import must merge names and preserve current catalog');
for(let i=0;i<15;i++)await FB.saveFood('Food '+i);

// Exercise the actual choice builder with no recent meals (>90d window).
const form=fs.readFileSync(new URL('../src/32-addform.jsx',import.meta.url),'utf8');
const choicesSource=form.slice(form.indexOf('  const foodChoices=[];'),form.indexOf('  // v11.8.0: medicine'));
const choices=vm.runInNewContext(choicesSource+'\nfoodChoices;',{ed:{},savedFoods:phoneB,allEntries:[]});
assert(choices.includes('Food 14') && choices.length>10,'Catalog options must not be capped at ten');

// Exercise the real catalog button handler: persistence, double-tap guard, feedback.
const handler=form.slice(form.indexOf('  const saveFoodChoice=async()=>{'),form.indexOf('  // v11.9.144: evento'));
let feedback='',saving=false;
const ui={foodName:'Mamão',foodSavingRef:{current:false},setFoodSaving:x=>{saving=x},setFoodFeedback:x=>{feedback=x},onSaveFood:name=>FB.saveFood(name)};
const save=vm.runInNewContext(handler+'\nsaveFoodChoice;',ui);
await Promise.all([save(),save()]);
assert(phoneB.includes('Mamão') && feedback==='saved' && !saving);
ui.onSaveFood=async()=>{throw new Error('offline rejection')};
await save();
assert(feedback==='error' && !saving && !ui.foodSavingRef.current,'Rejected write must show error and allow retry');
unsubB();
console.log('PASS: persistent catalog, two devices, reopen, standalone creation, concurrency, meal deletion, atomic failure, migration, backups, >10 options, button handler/error/retry.');
