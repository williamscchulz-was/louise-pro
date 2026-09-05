
const {useState, useEffect, useCallback, useRef, useMemo} = React;

// ╔═══════════════════════════════════════════════╗
// ║  LOUISE PRO — Baby Tracker                    ║
// ║  v2.0.0                                       ║
// ╚═══════════════════════════════════════════════╝
const APP_VERSION = "11.9.150";
// v11.9.78: silhueta mãe+bebê vetorizada (potrace do assets/icons/icon-512.png) pro splash
// que se desenha (efeito traço -> preenche). Mesma logo de sempre, agora em vetor.
const LOUISE_SIL="M 251.500 82.468 C 235.776 85.897, 226.386 91.743, 207.976 109.561 C 200.537 116.760, 190.187 125.805, 184.976 129.660 C 169.740 140.932, 164.231 148.366, 163.271 158.950 C 161.899 174.074, 171.303 192.232, 185.602 202.070 L 189.899 205.027 187.773 200.263 C 185.328 194.785, 184.013 179.587, 185.827 177.773 C 186.607 176.993, 188.695 178.348, 193.255 182.594 C 208.520 196.807, 229.709 203.970, 261 205.494 C 290.767 206.944, 296.365 210.624, 297.195 229.285 C 298.209 252.073, 310.558 265.347, 336.430 271.461 C 358.051 276.569, 369.241 287.034, 377.365 309.739 C 381.748 321.989, 381.971 348.244, 377.807 361.829 L 375.255 370.157 379.086 366.416 C 381.193 364.359, 382.746 362.399, 382.538 362.061 C 382.329 361.724, 384.200 359.209, 386.695 356.474 C 389.191 353.738, 390.842 352.196, 390.366 353.047 C 389.888 353.902, 390.281 353.743, 391.245 352.693 C 392.204 351.647, 392.733 350.377, 392.420 349.871 C 392.107 349.365, 392.447 349.074, 393.176 349.225 C 393.927 349.381, 394.435 348.714, 394.350 347.683 C 394.267 346.684, 394.452 346.119, 394.760 346.427 C 395.697 347.364, 398.167 343.080, 397.403 341.844 C 396.972 341.146, 397.130 340.962, 397.802 341.377 C 399.397 342.363, 406.479 327.011, 409.604 315.794 C 413.319 302.459, 414.088 277.794, 411.217 264 C 407.403 245.665, 400.295 231.180, 386.379 213.379 C 371.896 194.852, 368.533 187.974, 364.475 168.581 C 361.439 154.074, 359.684 148.435, 355.737 140.500 C 345.047 119.010, 322.901 97.177, 302.330 87.850 C 288.140 81.416, 266.720 79.148, 251.500 82.468 M 188.202 189.559 C 188.850 198.574, 192.162 205.524, 200.034 214.382 C 208.861 224.316, 209.320 226.328, 206.395 242.268 C 204.366 253.320, 204.694 253.814, 214.300 254.208 L 221.424 254.500 222.096 257.801 C 222.920 261.849, 223.298 262.250, 226.286 262.250 C 227.963 262.250, 228.965 263.068, 229.712 265.047 C 230.473 267.064, 231.567 267.936, 233.634 268.172 C 235.891 268.430, 237.052 269.524, 239.101 273.323 C 245.949 286.021, 252.592 285.757, 268.500 272.155 C 279.704 262.575, 282.113 261.604, 282.533 266.500 C 282.580 267.050, 283.702 269.750, 285.025 272.500 C 293.960 291.063, 278.597 315.916, 244.309 338.370 C 238.704 342.041, 232.456 346.946, 230.424 349.272 C 227.295 352.852, 226.826 353.117, 227.361 351 C 227.709 349.625, 228.272 346.025, 228.611 343 C 228.961 339.888, 230.214 335.981, 231.499 334 C 237.406 324.895, 234.368 318.061, 223.060 315.016 C 218.319 313.739, 215 315.451, 215 319.174 C 215 320.643, 214.491 320.910, 212.597 320.435 C 208.215 319.335, 207.550 323.926, 210.879 332.306 C 212.129 335.453, 210.993 338.338, 206.571 343.250 C 203.412 346.760, 204.120 347.014, 196.799 339.750 C 193.335 336.313, 188.813 332.243, 186.750 330.707 C 182.602 327.618, 181.983 326, 184.951 326 C 194.327 326, 202 321.386, 202 315.748 C 202 313.906, 202.486 311.914, 203.079 311.321 C 204.912 309.488, 206.145 302.140, 204.984 299.969 C 204.203 298.510, 204.352 297.219, 205.578 294.850 L 207.216 291.681 203.468 288.534 L 199.720 285.387 199.908 276.859 C 200.236 261.955, 194.622 251.892, 182.708 246.029 C 164.536 237.087, 139.947 240.523, 126.344 253.905 C 115.658 264.417, 111.100 284.730, 116.517 297.696 C 117.758 300.665, 117.651 301.669, 115.392 308.239 C 111.455 319.689, 108.813 331.926, 108.752 338.996 C 108.696 345.434, 114.348 370.142, 116.026 370.798 C 116.445 370.962, 116.540 372.045, 116.236 373.204 C 115.827 374.768, 116.024 375.103, 116.997 374.502 C 117.888 373.951, 118.069 374.080, 117.560 374.902 C 116.501 376.616, 117.820 381.229, 119.136 380.416 C 119.856 379.971, 119.977 380.498, 119.500 382 C 119.052 383.413, 119.159 384.020, 119.788 383.631 C 121.013 382.874, 122.262 385.767, 121.349 387.245 C 120.987 387.830, 121.144 388.029, 121.699 387.686 C 122.663 387.090, 128.639 394.422, 128.883 396.500 C 128.947 397.050, 129.338 397.510, 129.750 397.521 C 130.614 397.546, 161.021 428, 160.181 428 C 159.876 428, 160.904 429.334, 162.466 430.964 C 164.028 432.595, 165.660 433.710, 166.093 433.443 C 166.526 433.175, 168.144 434.541, 169.690 436.478 L 172.500 440 230.089 440 L 287.678 440 296.158 431.750 C 300.822 427.212, 310.947 416.300, 318.659 407.500 C 326.370 398.700, 333.520 390.825, 334.547 390 C 337.953 387.266, 318.346 412.279, 306.576 425.683 C 300.209 432.934, 295 439.092, 295 439.368 C 295 440.112, 343.405 440.165, 345.336 439.424 C 346.245 439.076, 346.740 438.388, 346.435 437.895 C 346.131 437.403, 346.331 437, 346.879 437 C 347.427 437, 347.820 436.212, 347.751 435.250 C 347.554 432.483, 351.152 423.976, 352.235 424.645 C 352.837 425.017, 352.939 424.382, 352.500 423 C 352.017 421.479, 352.141 420.969, 352.881 421.427 C 353.568 421.851, 353.755 421.525, 353.382 420.552 C 353.054 419.698, 353.270 419, 353.862 419 C 354.454 419, 354.650 418.252, 354.299 417.336 C 353.901 416.299, 354.058 415.918, 354.717 416.325 C 355.299 416.684, 355.754 416.421, 355.730 415.739 C 355.614 412.530, 356.087 410.936, 356.989 411.493 C 357.555 411.843, 357.723 411.442, 357.382 410.552 C 357.054 409.698, 357.270 409, 357.862 409 C 358.454 409, 358.650 408.252, 358.299 407.336 C 357.895 406.283, 358.056 405.916, 358.737 406.337 C 359.434 406.768, 359.614 406.241, 359.249 404.845 C 358.893 403.485, 359.071 402.926, 359.730 403.333 C 360.304 403.688, 360.754 403.421, 360.730 402.739 C 360.614 399.530, 361.087 397.936, 361.989 398.493 C 362.555 398.843, 362.723 398.442, 362.382 397.552 C 362.054 396.698, 362.270 396, 362.862 396 C 363.453 396, 363.678 395.325, 363.362 394.500 C 363.045 393.675, 363.270 393, 363.862 393 C 364.454 393, 364.650 392.252, 364.299 391.336 C 363.872 390.225, 364.045 389.910, 364.819 390.388 C 365.575 390.856, 365.771 390.566, 365.382 389.552 C 365.054 388.698, 365.270 388, 365.862 388 C 366.453 388, 366.678 387.325, 366.362 386.500 C 366.045 385.675, 366.311 385, 366.952 385 C 367.593 385, 367.874 384.606, 367.576 384.124 C 367.022 383.227, 370.905 370.896, 373.441 365.500 C 375.677 360.741, 377.993 345.339, 377.997 335.208 C 378.003 316.444, 372.105 299.628, 361.499 288.172 C 354.722 280.852, 347.202 276.842, 335.114 274.100 C 307.682 267.880, 294.032 251.793, 294.006 225.654 C 293.993 212.789, 287.851 209.911, 256.500 208.075 C 227.061 206.352, 211.547 200.881, 190.602 184.837 L 187.704 182.617 188.202 189.559 M 122.849 317.595 C 122.670 327.002, 122.806 330.027, 123.680 336 C 124.315 340.338, 124.364 340.392, 125.051 337.500 C 125.443 335.850, 125.817 332.163, 125.882 329.307 C 125.976 325.153, 126.445 323.802, 128.223 322.557 C 134.037 318.484, 138.540 323.367, 139.441 334.722 C 139.781 339, 141.264 346.294, 142.737 350.932 C 144.946 357.884, 145.389 361.039, 145.263 368.913 L 145.110 378.463 149.454 382.508 C 158.932 391.334, 221.097 422.651, 227.472 421.811 C 229.249 421.577, 233.705 416.197, 245.537 400 C 261.952 377.530, 278.600 353.322, 275.797 356 C 273.883 357.829, 259.515 376.316, 248.207 391.500 C 240.834 401.400, 234.624 409.685, 234.407 409.911 C 233.509 410.845, 229.598 406.138, 227.003 401 C 222.687 392.456, 221 385.481, 221 376.184 L 221 367.730 218.920 370.375 C 217.776 371.829, 216.356 372.720, 215.765 372.355 C 215.170 371.987, 214.978 372.155, 215.334 372.732 C 215.688 373.305, 215.357 374.289, 214.598 374.919 C 213.455 375.867, 213.684 376.531, 215.932 378.782 C 217.836 380.689, 219.012 383.364, 219.873 387.747 C 221.373 395.389, 223.166 399.793, 227.597 406.718 C 235.085 418.425, 231.328 420.973, 216.237 414.425 C 189.780 402.946, 157.176 385.769, 151.138 380.129 C 148.264 377.444, 148.165 377.051, 148.191 368.425 C 148.213 361.370, 147.644 357.719, 145.473 351 C 143.820 345.880, 142.473 338.968, 142.087 333.618 C 141.468 325.022, 141.335 324.643, 137.973 321.837 C 136.063 320.242, 134.500 318.542, 134.500 318.059 C 134.500 316.858, 129.482 313, 127.921 313 C 127.226 313, 125.835 312.255, 124.829 311.345 C 123.073 309.756, 122.994 310.004, 122.849 317.595";
// v11.9.132: splash "a família" — arte gerada no Canva (escolha do William) e vetorizada com o
// MESMO pipeline potrace da LOUISE_SIL. Split em 2 paths pela ordem de desenho do splash:
// mãe+Louise primeiro, pai POR ÚLTIMO (pedido dele). Coordenadas no espaço 1024×1024 da arte;
// viewBox de uso: "340 245 372 530". Fonte raster: assets/splash-family.png.
const LOUISE_FAM_MOM = "M 552.765 345.224 C 544.013 347.048, 531.975 353.922, 527.762 359.500 C 519.385 370.591, 517.398 381.707, 521.492 394.566 L 524.249 403.223 522.476 409.080 C 520.456 415.750, 521.074 417.365, 526.022 418.354 C 528.360 418.822, 529 419.480, 529 421.416 C 529 422.772, 529.450 424.160, 530 424.500 C 530.550 424.840, 531 425.976, 531 427.024 C 531 428.072, 531.862 429.391, 532.916 429.955 C 533.971 430.519, 535.583 433.240, 536.500 436 C 539.152 443.985, 543.686 444.966, 555 440 C 558.759 438.350, 562.210 437.005, 562.668 437.011 C 563.125 437.017, 566.425 441.725, 570 447.474 C 573.575 453.222, 576.659 457.467, 576.852 456.906 C 577.253 455.746, 566.589 437.734, 564.452 435.960 C 563.357 435.051, 561.225 435.583, 554.668 438.399 C 542.589 443.587, 541.324 443.267, 537.286 434 C 536.207 431.525, 534.582 428.887, 533.674 428.137 C 532.765 427.387, 532.287 426.344, 532.611 425.820 C 532.935 425.296, 532.512 424.334, 531.671 423.683 C 530.830 423.033, 529.997 421.402, 529.821 420.059 C 529.582 418.240, 528.645 417.398, 526.144 416.753 C 523.144 415.980, 522.853 415.603, 523.399 413.194 C 525.190 405.294, 525.222 399.836, 523.511 394.396 C 521.317 387.421, 521.854 378.380, 524.866 371.571 C 526.749 367.314, 527.249 366.855, 529.246 367.553 C 530.486 367.986, 535.775 368.434, 541 368.549 L 550.500 368.757 552.194 374.960 C 554.751 384.325, 557.556 387.281, 569.086 392.762 C 580.137 398.016, 580.199 398.127, 576.624 406.250 C 575.226 409.426, 575.195 410, 576.418 410 C 578.030 410, 581.363 405.708, 582.436 402.250 C 583.336 399.352, 583.582 399.387, 589.511 403.250 C 592.986 405.513, 595.217 407.946, 596.862 411.263 L 599.224 416.025 597.605 427.263 C 593.816 453.559, 596.200 460.070, 615.167 475.230 C 622.847 481.369, 625.334 487.753, 625.828 502.590 C 626.283 516.243, 624.861 531.347, 621.945 543.829 C 619.777 553.111, 619.647 554.208, 620.981 551.927 C 622.756 548.894, 628.154 526.431, 628.722 519.716 C 629.358 512.196, 629.822 511.916, 633.217 517 C 636.648 522.141, 643.696 526.407, 654.729 530.025 C 667.307 534.148, 672.317 537.042, 674.370 541.367 C 676.956 546.817, 676.500 551.654, 673.077 555.077 C 669.310 558.844, 670.464 558.790, 676.295 554.928 C 691.213 545.047, 690.426 532.593, 674.289 523.169 C 670.548 520.984, 666.650 518.271, 665.626 517.139 C 663.007 514.245, 662.548 507.657, 664.409 499.688 C 666.389 491.212, 666.433 484.478, 664.544 479.126 L 663.089 475 667.584 475 C 675.217 475, 683.270 480.545, 684.522 486.662 C 686.161 494.673, 686.252 494.791, 687.136 490.044 C 688.186 484.409, 686.932 479.661, 682.974 474.280 C 678.985 468.855, 675.053 466.513, 666.681 464.575 C 649.496 460.597, 643.239 452.333, 640.503 430 C 636.818 399.908, 631.899 389.907, 610.002 367.984 C 596.721 354.687, 590.171 349.924, 580.455 346.496 C 572.887 343.826, 561.893 343.321, 552.765 345.224 M 549 446.933 C 544.038 447.921, 542.161 449.152, 536.500 455.130 L 531.500 460.411 536.136 456.290 C 545.466 447.997, 554.056 446.323, 563.319 450.994 C 580.951 459.884, 577.821 479.840, 557.583 487.567 C 551.258 489.982, 540.134 497.268, 545.332 495.591 C 546.339 495.266, 547.977 495, 548.971 495 C 550.054 495, 550.722 494.325, 550.639 493.313 C 550.538 492.086, 552.521 490.872, 557.903 488.867 C 568.943 484.752, 576.913 475.925, 576.978 467.739 C 577.073 455.802, 561.736 444.396, 549 446.933 M 550 501 C 547.219 502.522, 546.930 502.925, 548.595 502.958 C 549.747 502.981, 551.505 502.100, 552.500 501 C 554.707 498.562, 554.454 498.562, 550 501 M 570.681 506.203 C 570.374 507.467, 569.376 514.350, 568.465 521.500 C 567.553 528.650, 565.730 538.743, 564.415 543.929 C 563.100 549.115, 562.176 553.510, 562.362 553.695 C 562.898 554.231, 566.813 540.091, 567.953 533.500 C 570.737 517.402, 572.676 498.007, 570.681 506.203 M 602.153 550.321 C 594.835 570.393, 586.824 584.409, 578.235 592.169 C 572.302 597.529, 551.642 601.852, 531 602.051 C 513.299 602.222, 519.809 604.061, 539 604.311 C 551.731 604.477, 554.415 604.214, 561 602.159 C 583.610 595.102, 592.101 585.737, 601.444 557.547 C 606.703 541.681, 607.218 536.429, 602.153 550.321 M 559.608 560.576 C 558.645 563.630, 556.652 567.463, 555.179 569.095 C 551.943 572.679, 538.040 578.127, 523.500 581.509 C 518 582.788, 514.400 583.866, 515.500 583.903 C 523.111 584.160, 551.124 574.809, 555.324 570.609 C 558.138 567.794, 562.897 556.563, 561.758 555.424 C 561.538 555.204, 560.570 557.523, 559.608 560.576 M 609.759 581.262 C 605.897 593.920, 606.431 599.004, 614.135 622.904 C 625.204 657.245, 625.121 664.016, 613.071 710 C 608.107 728.941, 607.576 731.286, 608.879 728.500 C 620.161 704.386, 627.246 678.948, 627.263 662.500 C 627.276 650.067, 625.758 643.098, 618.877 624 C 610.091 599.616, 608.409 590.270, 611.078 580.656 C 612.708 574.787, 611.576 575.307, 609.759 581.262";
const LOUISE_FAM_DAD = "M 469.977 270.218 C 453.597 275.949, 441.571 288.708, 439.551 302.500 C 439.080 305.721, 439.408 305.235, 441.240 300 C 448.259 279.935, 470.103 267.094, 490.744 270.897 C 507.259 273.940, 517.340 282.204, 534.172 306.500 C 542.367 318.329, 542.542 320.295, 535.531 321.752 C 531.771 322.533, 531.611 322.738, 530.533 328.135 C 529.921 331.202, 528.661 334.869, 527.733 336.285 C 526.805 337.701, 525.748 340.725, 525.383 343.005 C 524.847 346.361, 524.014 347.597, 521.016 349.490 C 517.169 351.919, 515.106 356.869, 513.408 367.750 C 512.755 371.933, 512.681 372, 508.737 372 C 505.747 372, 504.141 372.635, 502.412 374.500 C 500.806 376.234, 500.530 377, 501.513 377 C 502.292 377, 503.439 376.048, 504.062 374.885 C 504.967 373.193, 505.842 372.875, 508.433 373.295 C 512.665 373.982, 513.568 373.281, 514.421 368.645 C 516.431 357.718, 518.970 352.039, 522.506 350.562 C 524.903 349.560, 526.117 348.288, 526.557 346.316 C 527.793 340.782, 528.299 339.469, 530.080 337.189 C 531.072 335.918, 532.432 332.430, 533.101 329.439 C 533.771 326.448, 534.584 323.967, 534.909 323.926 C 545.209 322.630, 545.160 318.382, 534.668 302.731 C 518.697 278.908, 504.675 269.191, 485 268.314 C 478.052 268.005, 475.309 268.352, 469.977 270.218 M 421.628 346.995 C 412.168 358.544, 411.740 358.917, 408.179 358.712 C 405.048 358.532, 404.453 358.835, 404.181 360.750 C 403.956 362.330, 404.370 363, 405.569 363 C 411.623 363, 437.118 384.741, 445.795 397.303 C 459.275 416.818, 473.844 452.219, 483.102 487.951 C 484.734 494.249, 486.278 499.612, 486.534 499.868 C 490.029 503.363, 477.653 454.573, 468.304 428 C 463.819 415.253, 462.950 411.735, 463.414 408.193 C 464.002 403.700, 463.454 402.784, 457.175 397.760 C 452.607 394.105, 454.773 387.350, 462.250 381.934 L 466.287 379.010 470.480 382.874 C 479.914 391.571, 485.616 392.414, 489.916 385.750 C 491.556 383.207, 493.075 382, 494.632 382 C 495.896 382, 497.395 381.130, 497.965 380.066 C 499.259 377.647, 499.267 377, 498 377 C 497.450 377, 497 377.619, 497 378.375 C 497 379.131, 495.640 380.022, 493.978 380.354 C 491.940 380.762, 490.290 382.090, 488.906 384.435 C 485.110 390.869, 482.758 390.360, 472.204 380.822 C 467.276 376.369, 465.172 373.670, 464.262 370.632 L 463.025 366.500 463.485 372.633 L 463.945 378.766 460.125 381.413 C 456.315 384.054, 454.975 385.927, 452.993 391.389 C 452.416 392.977, 451.802 394.102, 451.629 393.889 C 442.848 383.041, 431.595 372.904, 420.750 366.072 C 417.038 363.734, 414 361.570, 414 361.263 C 414 360.957, 415.488 358.860, 417.306 356.603 C 422.481 350.179, 432.263 335.930, 431.809 335.476 C 431.584 335.250, 427.002 340.434, 421.628 346.995 M 394.127 374.250 C 380.544 392.359, 368.830 416.682, 364.918 434.901 C 360.667 454.706, 361.403 502.083, 366.482 535.500 L 367.850 544.500 367.175 532 C 365.760 505.791, 366.415 455.252, 368.304 445 C 371.914 425.399, 383.685 397.074, 396.341 377.535 C 400.557 371.025, 401.182 369, 398.973 369 C 398.474 369, 396.293 371.363, 394.127 374.250 M 523.667 468.667 C 519.492 472.841, 530.529 480.486, 535.856 477.110 C 536.725 476.559, 535.702 476.290, 533.007 476.361 C 528.396 476.482, 523.502 472.460, 524.643 469.487 C 525.244 467.923, 524.791 467.543, 523.667 468.667 M 519.500 477.585 C 517.850 478.908, 516.950 479.982, 517.500 479.973 C 518.879 479.949, 523.583 476.249, 522.985 475.658 C 522.718 475.395, 521.150 476.262, 519.500 477.585 M 543 510.267 C 539.778 512.323, 539.679 512.525, 541.750 512.820 C 546.246 513.458, 543.886 516.062, 534.750 520.541 C 523.666 525.975, 522.370 526.897, 521.094 530.253 C 520.256 532.456, 519.317 532.935, 514.805 533.466 C 499.541 535.259, 497.134 535.933, 507.444 535.528 C 520.722 535.006, 520.992 535.190, 521.033 544.785 C 521.051 549.028, 521.464 555.596, 521.952 559.379 C 523.191 569, 523.003 569.243, 512.118 572.027 C 504.212 574.050, 502.030 577.450, 505.035 583.066 C 507.483 587.639, 510.018 583.912, 507.699 579.149 C 506.265 576.205, 508.019 574.718, 515.480 572.549 C 523.734 570.149, 524.330 568.977, 523.066 557.638 C 522.480 552.380, 522 545.623, 522 542.622 L 522 537.166 527.013 536.091 C 531.712 535.083, 544 529.572, 544 528.472 C 544 528.198, 542.313 528.683, 540.250 529.550 C 533.921 532.211, 523.839 534.239, 522.683 533.083 C 520.173 530.573, 523.870 527.082, 534.889 521.556 C 546.805 515.579, 547.938 514.654, 545.271 513.074 C 543.633 512.104, 543.688 511.875, 546 510.035 C 549.385 507.340, 547.339 507.499, 543 510.267 M 483.804 572.298 C 485.562 574.111, 487 576.136, 487 576.798 C 487 578.307, 478.867 578.410, 473.993 576.963 C 469.837 575.729, 456 574.951, 456 575.952 C 456 577.950, 466.688 584.874, 480 591.499 C 490.362 596.656, 490.128 596.386, 488.432 601.192 C 485.283 610.118, 487.076 627.326, 492.203 637.392 C 494.880 642.647, 502.468 650.604, 507.761 653.706 C 513.486 657.061, 514.103 656.163, 508.693 652.349 C 496.498 643.753, 486.958 616.885, 491.143 602.918 C 492.500 598.389, 493.327 597.963, 498.809 598.965 C 503.732 599.865, 504.492 599.209, 505.482 593.205 L 506.191 588.910 499.446 582.705 C 488.246 572.401, 476.020 564.267, 483.804 572.298 M 373.150 582.722 C 373.067 583.394, 371.673 593.519, 370.052 605.222 C 366.161 633.298, 361.692 675.693, 362.488 676.980 C 362.835 677.542, 365.089 678.497, 367.498 679.104 C 374.037 680.750, 374.947 682.358, 377.167 696.183 C 381.213 721.391, 387 745.756, 387 737.586 C 387 736.123, 384.282 718.390, 379.454 688.351 C 378.727 683.829, 375.494 680.228, 370.934 678.862 C 365.521 677.240, 365.135 676.455, 366.084 669 C 366.806 663.333, 369.351 637.952, 373.104 599 C 373.714 592.675, 374.007 586.150, 373.756 584.500 C 373.505 582.850, 373.232 582.050, 373.150 582.722";
const CHANGELOG = window.CHANGELOG || [];

// ── WHO Growth Standards (loaded from who-growth.js) ──
const {WHO_GIRLS, interpolateLMS, calcZScore, zToPercentile, getPercentile} = window;

// ── HELPERS ──
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const todayStr=()=>{const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
function nowTime(){const d=new Date();return`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`}
// v11.9.83: sugere as 3 ações com mais TENDÊNCIA agora. Puro (só lê histórico) — "aprende"
// conforme as entries acumulam. Nota = frequência naquela hora (recency-weighted) +
// o-que-costuma-seguir-o-último-evento + proximidade da rotina − cooldown (acabou de fazer).
// Sem dados? Os priors por faixa de horário dão um fallback de bom senso.
function suggestQuickActions(allEntries,todayList,nowMin,routine){
  const CANDS=["bottle","nursing","food","diaper","nap","sleep","bath","medicine"];
  const pm=t=>{const p=String(t||"").split(":");return (+p[0]||0)*60+(+p[1]||0)};
  const cdist=(a,b)=>{const d=Math.abs(a-b);return Math.min(d,1440-d)};
  const score={};CANDS.forEach(t=>score[t]=0);
  // prior por faixa de horário (cold start + leve viés)
  const h=Math.floor(nowMin/60);
  const PRIOR=h<5?["bottle","diaper","sleep"]:h<9?["bottle","diaper","nap"]:h<11?["nap","bottle","diaper"]:h<15?["bottle","nap","diaper"]:h<17?["nap","bottle","diaper"]:h<19?["bath","diaper","bottle"]:h<21?["sleep","bottle","diaper"]:["bottle","diaper","sleep"];
  PRIOR.forEach((t,i)=>{if(score[t]!=null)score[t]+=0.45-i*0.12});
  const today=todayStr();
  // 1) frequência naquela hora (±90min), peso por recência (meia-vida ~14d). Exclui hoje.
  const tod={};CANDS.forEach(t=>tod[t]=0);let todMax=0;
  (allEntries||[]).forEach(e=>{
    if(!CANDS.includes(e.type)||!e.time||e.date===today)return;
    const dist=cdist(pm(e.time),nowMin);if(dist>90)return;
    const da=Math.max(0,Math.round((Date.parse(today)-Date.parse(e.date))/86400000));
    tod[e.type]+=Math.exp(-da/14)*(1-dist/90);
  });
  CANDS.forEach(t=>{if(tod[t]>todMax)todMax=tod[t]});
  if(todMax>0)CANDS.forEach(t=>score[t]+=1.0*(tod[t]/todMax));
  // 2) sequência: o que costuma SEGUIR o último evento de hoje (dentro de 90min)
  const past=(todayList||[]).filter(e=>e.time&&pm(e.time)<=nowMin).sort((a,b)=>pm(b.time)-pm(a.time));
  const lastType=past.length?past[0].type:null;
  if(lastType){
    const byDay={};(allEntries||[]).forEach(e=>{(byDay[e.date]=byDay[e.date]||[]).push(e)});
    let lCount=0;const follow={};CANDS.forEach(t=>follow[t]=0);
    Object.keys(byDay).forEach(d=>{
      const evs=byDay[d].filter(e=>e.time).sort((a,b)=>pm(a.time)-pm(b.time));
      for(let i=0;i<evs.length;i++){
        if(evs[i].type!==lastType)continue;lCount++;const t0=pm(evs[i].time);
        for(let j=i+1;j<evs.length;j++){const dt=pm(evs[j].time)-t0;if(dt<=0)continue;if(dt>90)break;if(follow[evs[j].type]!=null)follow[evs[j].type]++}
      }
    });
    if(lCount>=2)CANDS.forEach(t=>{const p=follow[t]/lCount;if(p>0)score[t]+=0.9*Math.min(1,p)});
  }
  // 3) proximidade da rotina (se ativa)
  if(routine&&routine.enabled===true){
    const near=(tMin,tol)=>{const d=cdist(tMin,nowMin);return d<=tol?1-d/tol:0};
    (routine.naps||[]).forEach(n=>{if(n&&n.time){const b=near(pm(n.time),75);if(b>0)score.nap+=0.8*b}});
    if(routine.bathTime){const b=near(pm(routine.bathTime),75);if(b>0)score.bath+=0.8*b}
    if(routine.bedtime){const b=near(pm(routine.bedtime),75);if(b>0)score.sleep+=0.8*b}
  }
  // 4) cooldown: penaliza o que ACABOU de acontecer hoje
  const COOL={bottle:90,nursing:90,food:120,diaper:45,bath:300,medicine:360,nap:60,sleep:120};
  CANDS.forEach(t=>{
    const recents=(todayList||[]).filter(e=>e.type===t&&e.time&&pm(e.time)<=nowMin).map(e=>nowMin-pm(e.time));
    if(!recents.length)return;const r=Math.min.apply(null,recents),c=COOL[t]||90;
    if(r<c)score[t]-=1.3*(1-r/c);
  });
  // v11.9.93: "Acordou" em 1 toque — o evento-ÂNCORA da rotina (define o wakeDelta).
  // De manhã (05-11h), sem wakeup registrado hoje, ele entra garantido; registrado, sai.
  const hasWakeup=(todayList||[]).some(e=>e.type==="wakeup");
  const wakeupNow=!hasWakeup&&h>=5&&h<11;
  // v11.9.140: mamadeira e fralda ficam FIXAS nos slots 1 e 2 — são as mais frequentes e
  // menos ambíguas do dia inteiro (achado #9 da auditoria: o slot esquerdo trocava de tipo,
  // ex. Mamadeira→Amamentar, sem aviso — toque no escuro sem olhar podia registrar errado).
  // Só o 3º slot continua 100% adaptativo, escolhido pelo score de sempre. ⚠️ O array já sai
  // na ORDEM VISUAL final (posição = índice) — não reordenar por categoria depois disso, ou
  // a Fralda volta a pular entre o meio e a direita dependendo de qual é o 3º tipo (foi
  // exatamente o bug pego testando no browser: o antigo SLOT_ORDER pós-pin reordenava por
  // categoria, e "diaper:5" caía ora antes ora depois do adaptativo).
  const ranked=CANDS.slice().sort((a,b)=>score[b]-score[a]);
  const adaptive=ranked.find(t=>t!=="bottle"&&t!=="diaper")||ranked[0];
  return wakeupNow?["wakeup","bottle","diaper"]:["bottle","diaper",adaptive];
}
// v11.9.106: ml TÍPICO daquela hora do dia (não o último ml cru). Mediana ponderada por
// recência (meia-vida ~14d) das mamadeiras com ml na janela ±90min do horário atual.
// Null com <3 amostras (não força palpite com pouco dado) → AddForm cai no fallback.
function hourlyTypicalMl(entries,nowMin){
  if(!entries)return null;
  const today=todayStr(),pm=t=>{const p=String(t||"").split(":");return (+p[0]||0)*60+(+p[1]||0)},cd=(a,b)=>{const d=Math.abs(a-b);return Math.min(d,1440-d)};
  const vals=[];
  entries.forEach(e=>{if(e.type!=="bottle"||!e.ml||!e.time)return;if(cd(pm(e.time),nowMin)>90)return;const da=Math.max(0,Math.round((Date.parse(today)-Date.parse(e.date))/86400000));vals.push({ml:e.ml,w:Math.exp(-da/14)})});
  if(vals.length<3)return null;
  vals.sort((a,b)=>a.ml-b.ml);const total=vals.reduce((s,v)=>s+v.w,0);let acc=0,med=vals[0].ml;
  for(const v of vals){acc+=v.w;if(acc>=total/2){med=v.ml;break}}
  return Math.round(med/5)*5;
}
// v11.9.106: subtype de fralda mais provável pra esta hora (cocô concentra em certas horas;
// xixi domina o resto). Recency-weighted, janela ±90min. Null com <4 amostras → mantém "wet".
function likelyDiaperSubtype(entries,nowMin){
  if(!entries)return null;
  const today=todayStr(),pm=t=>{const p=String(t||"").split(":");return (+p[0]||0)*60+(+p[1]||0)},cd=(a,b)=>{const d=Math.abs(a-b);return Math.min(d,1440-d)};
  const sc={wet:0,dirty:0,both:0};let n=0;
  entries.forEach(e=>{if(e.type!=="diaper"||!e.subtype||!e.time||sc[e.subtype]==null)return;const dist=cd(pm(e.time),nowMin);if(dist>90)return;const da=Math.max(0,Math.round((Date.parse(today)-Date.parse(e.date))/86400000));sc[e.subtype]+=Math.exp(-da/14)*(1-dist/90);n++});
  if(n<4)return null;
  const best=Object.keys(sc).sort((a,b)=>sc[b]-sc[a])[0];
  return sc[best]>0?best:null;
}
// v11.9.107: AVISO SUAVE no Salvar (NUNCA bloqueia) — dois "dedo gordo"/2-devices.
// (1) anti-dose-dupla: o casal usa 2 iPhones; um já registrou o mesmo remédio (≤4h, casa
//     por nome) ou mamada/amamentação (≤30min) há pouco. (2) outlier: valor fora do normal
//     (150→15, 36,5→365). Retorna {pt,en} ou null; AddForm exige 2º toque no Salvar pra
//     confirmar. Função PURA → testável em harness sem React/_lang.
function entryWarn(type,payload,allEntries){
  if(!allEntries||!payload)return null;
  const tms=e=>{const p=String(e.time||"").split(":");return Date.parse(e.date)+((+p[0]||0)*60+(+p[1]||0))*60000};
  const nowMs=tms(payload);
  const ago=ms=>{const m=Math.round(ms/60000);return m<60?{pt:`há ${m} min`,en:`${m} min ago`}:{pt:`há ${(m/60).toFixed(m%60?1:0)}h`,en:`${(m/60).toFixed(m%60?1:0)}h ago`}};
  if(type==="medicine"&&payload.name){
    const nm=payload.name.trim();
    const re=new RegExp(nm.replace(/[.*+?^${}()|[\]\\]/g,c=>"\\"+c),"i");
    const r=allEntries.filter(e=>e.type==="medicine"&&e.name&&re.test(e.name)&&e.id!==payload.id)
      .map(e=>({e,dt:nowMs-tms(e)})).filter(x=>x.dt>=0&&x.dt<4*3600000).sort((a,b)=>a.dt-b.dt)[0];
    if(r){const a=ago(r.dt);return{pt:`${nm} já foi dado às ${r.e.time} (${a.pt}). Registrar mesmo assim?`,en:`${nm} was already given at ${r.e.time} (${a.en}). Log anyway?`}}
  }
  if(type==="bottle"||type==="nursing"){
    const r=allEntries.filter(e=>(e.type==="bottle"||e.type==="nursing")&&e.id!==payload.id)
      .map(e=>({e,dt:nowMs-tms(e)})).filter(x=>x.dt>=0&&x.dt<30*60000).sort((a,b)=>a.dt-b.dt)[0];
    if(r){const a=ago(r.dt);const lp=r.e.type==="bottle"?"mamadeira":"amamentação",le=r.e.type==="bottle"?"bottle":"nursing";return{pt:`Já teve ${lp} ${a.pt} (${r.e.time}). Registrar outra?`,en:`A ${le} was logged ${a.en} (${r.e.time}). Log another?`}}
  }
  const median=a=>{const s=a.slice().sort((x,y)=>x-y);const n=s.length;return n?(n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2):0};
  if(type==="bottle"&&payload.ml){
    const mls=allEntries.filter(e=>e.type==="bottle"&&e.ml).map(e=>e.ml);
    if(mls.length>=5){const m=median(mls);if(payload.ml<m*0.45||payload.ml>m*2.2)return{pt:`${payload.ml}ml está bem diferente do normal (~${Math.round(m)}ml). Confere?`,en:`${payload.ml}ml is far from usual (~${Math.round(m)}ml). Correct?`}}
  }
  if(type==="temperature"&&payload.value!=null&&(payload.value<34||payload.value>41.5))return{pt:`${payload.value}°C parece estranho. Confere?`,en:`${payload.value}°C looks off. Correct?`};
  if((type==="sleep"||type==="nap")&&payload.durationMin>16*60){const h=(payload.durationMin/60).toFixed(1);return{pt:`${h}h é muito tempo. Confere?`,en:`${h}h is very long. Correct?`}}
  if(type==="growth"){
    if(payload.weightKg!=null&&(payload.weightKg<1.5||payload.weightKg>25))return{pt:`${payload.weightKg}kg parece estranho. Confere?`,en:`${payload.weightKg}kg looks off. Correct?`};
    if(payload.lengthCm!=null&&(payload.lengthCm<35||payload.lengthCm>110))return{pt:`${payload.lengthCm}cm parece estranho. Confere?`,en:`${payload.lengthCm}cm looks off. Correct?`};
    if(payload.headCm!=null&&(payload.headCm<28||payload.headCm>55))return{pt:`${payload.headCm}cm (cabeça) parece estranho. Confere?`,en:`${payload.headCm}cm (head) looks off. Correct?`};
  }
  return null;
}
// v11.9.108: BOLETIM DA SEMANA — uma frase em linguagem natural com a MAIOR mudança
// significativa dos últimos 7 dias completos vs os 7 anteriores. Pura/testável. Retorna
// null se faltar dado (<3 dias rastreados em alguma semana) ou se nada passar do limiar
// (evita frase fraca tipo "+2ml"). Métricas: sono/dia, ml/dia, despertares/noite.
function weeklyHeadline(entries,lang){
  if(!entries||entries.length<10)return null;
  const dstr=off=>{const d=new Date();d.setDate(d.getDate()-off);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
  const thisW=[],lastW=[];
  for(let i=1;i<=7;i++)thisW.push(dstr(i));
  for(let i=8;i<=14;i++)lastW.push(dstr(i));
  const byDate={};entries.forEach(e=>{(byDate[e.date]=byDate[e.date]||[]).push(e)});
  const metric=(dates,fn)=>{const ds=dates.filter(dt=>byDate[dt]&&byDate[dt].length);if(ds.length<3)return null;return{avg:ds.reduce((s,dt)=>s+fn(byDate[dt]),0)/ds.length}};
  const sleepMin=es=>es.filter(e=>(e.type==="sleep"||e.type==="nap")&&e.durationMin).reduce((s,e)=>s+e.durationMin,0);
  const mlDay=es=>es.filter(e=>e.type==="bottle").reduce((s,e)=>s+(e.ml||0),0);
  const wakeNight=es=>es.filter(e=>e.type==="nightwaking").length+es.filter(e=>e.type==="sleep"&&Array.isArray(e.wakings)).reduce((s,e)=>s+e.wakings.length,0);
  const cand=[];
  const push=(key,fn,minAbs,minRel)=>{const tw=metric(thisW,fn),lw=metric(lastW,fn);if(!tw||!lw||lw.avg<=0)return;const d=tw.avg-lw.avg,rel=d/lw.avg;if(Math.abs(d)>=minAbs&&Math.abs(rel)>=minRel)cand.push({key,d,rel,tw:tw.avg,lw:lw.avg})};
  push("sleep",sleepMin,25,0.10);
  push("ml",mlDay,40,0.10);
  push("wake",wakeNight,0.6,0.15);
  if(!cand.length)return null;
  cand.sort((a,b)=>Math.abs(b.rel)-Math.abs(a.rel));
  const c=cand[0],up=c.d>0,en=lang==="en";
  const fmtH=m=>{const mi=Math.round(Math.abs(m));const h=Math.floor(mi/60),r=mi%60;return h>0?(r>0?`${h}h${r}min`:`${h}h`):`${r}min`};
  if(c.key==="sleep")return{icon:"moon",tone:up?"up":"down",text:en?`${up?"More":"Less"} sleep — ${up?"+":"−"}${fmtH(c.d)} per day vs last week.`:`${up?"Mais":"Menos"} sono — ${up?"+":"−"}${fmtH(c.d)} por dia que na semana passada.`};
  if(c.key==="ml")return{icon:"bottle",tone:up?"up":"down",text:en?`${up?"Drinking more":"Drinking less"} — ${up?"+":"−"}${Math.round(Math.abs(c.d))}ml per day vs last week.`:`Mamando ${up?"mais":"menos"} — ${up?"+":"−"}${Math.round(Math.abs(c.d))}ml por dia que na semana passada.`};
  const nf=x=>en?x.toFixed(1):x.toFixed(1).replace(".",",");
  return{icon:"moon",tone:up?"down":"up",text:en?`${up?"More restless":"Calmer"} nights — ${nf(c.lw)}→${nf(c.tw)} wake-ups/night vs last week.`:`Noites ${up?"mais agitadas":"mais tranquilas"} — ${nf(c.lw)}→${nf(c.tw)} despertares/noite que na semana passada.`};
}
// v11.9.109: MARCOS/RECORDES DE SONO — recordes de sono REAL (durationMin menos o tempo
// acordada das wakings, pra não inflar com noites de muitos despertares) + badges que
// destravam uma vez (4h/6h emendadas, ≤1 despertar, noite completa). Pura/testável.
function sleepRecords(entries){
  if(!entries)return null;
  const sleeps=entries.filter(e=>e.type==="sleep"&&e.durationMin);
  const naps=entries.filter(e=>e.type==="nap"&&e.durationMin);
  if(!sleeps.length&&!naps.length)return null;
  const awake=e=>Array.isArray(e.wakings)?e.wakings.reduce((a,w)=>a+(w.durationMin||0),0):0;
  const wkN=e=>Array.isArray(e.wakings)?e.wakings.length:0;
  const real=e=>Math.max(0,Math.round(e.durationMin-awake(e)));
  let longestSleep=null,longestNap=null,bestNight=null;
  sleeps.forEach(e=>{const r=real(e);if(!longestSleep||r>longestSleep.min)longestSleep={min:r,date:e.date}});
  naps.forEach(e=>{const r=Math.round(e.durationMin);if(!longestNap||r>longestNap.min)longestNap={min:r,date:e.date}});
  sleeps.filter(e=>real(e)>=240).forEach(e=>{const w=wkN(e);if(!bestNight||w<bestNight.wakings||(w===bestNight.wakings&&real(e)>bestNight.min))bestNight={wakings:w,date:e.date,min:real(e)}});
  const firstWhen=(minReal,maxW)=>{const c=sleeps.filter(e=>real(e)>=minReal&&wkN(e)<=maxW).map(e=>e.date).sort();return c.length?c[0]:null};
  const badges=[{key:"h4",date:firstWhen(240,99)},{key:"h6",date:firstWhen(360,99)},{key:"w1",date:firstWhen(300,1)},{key:"through",date:firstWhen(360,0)}];
  return{longestSleep,longestNap,bestNight,badges};
}
// v11.9.110: CURVA DE COMPORTAMENTO — buckets semanais (últimas N semanas completas,
// janelas de 7 dias terminando ontem) com médias/dia. Pura/testável (devolve endDate +
// ageM; o componente formata o label com _lang). Pula semanas com <2 dias rastreados.
function behaviorWeekly(entries,birthDate,weeks){
  weeks=weeks||10;
  if(!entries||!entries.length)return [];
  const dayMs=86400000,fmt=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const now=new Date(),t0=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const byDate={};entries.forEach(e=>{(byDate[e.date]=byDate[e.date]||[]).push(e)});
  const awake=e=>Array.isArray(e.wakings)?e.wakings.reduce((a,w)=>a+(w.durationMin||0),0):0;
  const buckets=[];
  for(let i=0;i<weeks;i++){
    const end=new Date(t0);end.setDate(end.getDate()-1-i*7);
    const start=new Date(end);start.setDate(start.getDate()-6);
    const dates=[];for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1))dates.push(fmt(d));
    buckets.push({start:new Date(start),end:new Date(end),dates});
  }
  buckets.reverse();
  return buckets.map(b=>{
    const tracked=b.dates.filter(dt=>byDate[dt]&&byDate[dt].length);
    if(tracked.length<2)return null;
    const avg=fn=>tracked.reduce((s,dt)=>s+fn(byDate[dt]),0)/tracked.length;
    const totalSleep=avg(es=>es.filter(e=>(e.type==="sleep"||e.type==="nap")&&e.durationMin).reduce((s,e)=>s+e.durationMin,0));
    const nightSleep=avg(es=>es.filter(e=>e.type==="sleep"&&e.durationMin).reduce((s,e)=>s+Math.max(0,e.durationMin-awake(e)),0));
    const mlDay=avg(es=>es.filter(e=>e.type==="bottle").reduce((s,e)=>s+(e.ml||0),0));
    const wakings=avg(es=>es.filter(e=>e.type==="nightwaking").length+es.filter(e=>e.type==="sleep"&&Array.isArray(e.wakings)).reduce((s,e)=>s+e.wakings.length,0));
    let ageM=0;if(birthDate){const bd=new Date(birthDate+"T12:00");const mid=new Date((b.start.getTime()+b.end.getTime())/2);ageM=Math.max(0,(mid-bd)/(dayMs*30.44))}
    return{totalSleep,nightSleep,mlDay,wakings,ageM,tracked:tracked.length,endDate:fmt(b.end)};
  }).filter(Boolean);
}
// ── RELATÓRIO DE 30 DIAS (v11.9.135) ──
// Pedido pra levar/enviar a profissional (pediatra, consultora de sono): acordar, sonecas
// (com duração), mamadas, sono noturno (com duração) e janelas acordada. Tudo PURO.
// ⚠️ Armadilha central: `splitMidnight` PARTE um sono que cruza 00:00 em DUAS entries
// (dia X até 24:00 + dia X+1 a partir de 00:00). Elas são remontadas aqui ANTES de qualquer
// conta — senão a noite sai como ~4h em vez de ~11h (foi exatamente o bug do relatório
// semanal, v11.9.20). O merge também cobre entries legadas não-partidas (start+dur>1440).
function _rpMin(t){const p=(t||"00:00").split(":");return (+p[0])*60+(+p[1]||0)}
function _rpHHMM(m){const x=((m%1440)+1440)%1440;return String(Math.floor(x/60)).padStart(2,"0")+":"+String(x%60).padStart(2,"0")}
function _rpKey(e){return e.id||(e.date+"T"+(e.time||""))}
function _rpMergeSessions(entries,byDate,type){
  const list=entries.filter(e=>e&&e.type===type&&e.durationMin>0)
    .sort((a,b)=>(a.date+"T"+(a.time||"00:00")).localeCompare(b.date+"T"+(b.time||"00:00")));
  const used={},out=[];
  for(const s of list){
    if(used[_rpKey(s)])continue;
    used[_rpKey(s)]=1;
    let dur=s.durationMin,wak=(s.wakings||[]).slice(),cur=s;
    while(_rpMin(cur.time)+cur.durationMin>=1440){
      const nd=dateOffset(cur.date,1);
      const nxt=(byDate[nd]||[]).find(e=>e.type===type&&e.time==="00:00"&&e.durationMin>0&&!used[_rpKey(e)]);
      if(!nxt)break;
      used[_rpKey(nxt)]=1;dur+=nxt.durationMin;wak=wak.concat(nxt.wakings||[]);cur=nxt;
    }
    const startAbs=_rpMin(s.time),endAbs=startAbs+dur;
    const awakeMin=wak.reduce((a,w)=>a+(w.durationMin||0),0);
    out.push({startDate:s.date,start:s.time||"00:00",startAbs,endAbs,
      endDate:dateOffset(s.date,Math.floor(endAbs/1440)),end:_rpHHMM(endAbs),
      durationMin:dur,wakings:wak.length,awakeMin,realMin:Math.max(0,dur-awakeMin),
      // v11.9.141: detalhe cru dos despertares (tempo+duração de cada um) — `wakings` acima
      // continua sendo só a CONTAGEM (não quebrar quem já lê isso), isto é um campo novo.
      wakingsDetail:wak.map(w=>({time:w.time,durationMin:w.durationMin||0}))});
  }
  return out;
}
// ── EVENTOS DO DIA / TAGS DE CONTEXTO (v11.9.144) ──
// Pedido a partir de feedback externo: sem contexto, comparar "leite vs despertares" confunde
// coincidência com causa. Uma noite ruim depois da vacina não é sobre leite — é sobre a vacina.
// Cada tag tem uma JANELA DE EFEITO em dias, porque o efeito raramente cabe no dia do registro:
// a reação à vacina aparece nas 24-48h seguintes, e alimento novo pode reagir no dia seguinte.
// `effect` = quantos dias a partir do registro (1 = só aquele dia). `spans` = tag que costuma
// durar dias e por isso aceita `untilDate` no registro (o pai marca começo e fim em vez de
// remarcar todo dia — atrito baixo o suficiente pra ser usado de verdade às 3h da manhã).
const EVENT_TAGS={
  vaccine:  {pt:"Vacina",        en:"Vaccine",   emoji:"💉", effect:3, spans:false},
  teething: {pt:"Dente",         en:"Teething",  emoji:"🦷", effect:1, spans:true},
  illness:  {pt:"Doença",        en:"Illness",   emoji:"🤒", effect:1, spans:true},
  newfood:  {pt:"Alimento novo", en:"New food",  emoji:"🥄", effect:2, spans:false},
  cosleep:  {pt:"Co-sleeping",   en:"Co-sleeping",emoji:"🛏️", effect:1, spans:false},
};
// Devolve {date -> [tagKey]} cobrindo TODOS os dias afetados (registro + janela + untilDate).
// Puro: só lê entries. Usado pelo sleepReport pra marcar cada linha.
function _eventDaysByDate(entries){
  const out={};
  const add=(d,k)=>{(out[d]=out[d]||[]);if(out[d].indexOf(k)<0)out[d].push(k)};
  (entries||[]).forEach(e=>{
    if(!e||e.type!=="dayevent"||!e.tag||!e.date)return;
    const cfg=EVENT_TAGS[e.tag];if(!cfg)return;
    add(e.date,e.tag);
    // spans: o pai marcou até quando durou → cobre o intervalo inteiro (cap de 60d por segurança)
    if(cfg.spans&&e.untilDate&&e.untilDate>e.date){
      for(let i=1;i<=60;i++){const d=dateOffset(e.date,i);add(d,e.tag);if(d>=e.untilDate)break}
    }else{
      // janela de efeito automática (effect=1 significa só o próprio dia)
      for(let i=1;i<cfg.effect;i++)add(dateOffset(e.date,i),e.tag);
    }
  });
  return out;
}
// Uma linha por dia do calendário. A noite fica na linha da MANHÃ em que terminou
// (dia = "acordou às X depois de dormir Y, fez as sonecas Z, deitou às W").
function sleepReport(entries,days){
  days=days||30;entries=entries||[];
  const today=todayStr();
  const byDate={};entries.forEach(e=>{if(e&&e.date)(byDate[e.date]=byDate[e.date]||[]).push(e)});
  const eventDays=_eventDaysByDate(entries); // v11.9.144: tags de contexto por dia (com janela)
  const nights=_rpMergeSessions(entries,byDate,"sleep");
  const naps=_rpMergeSessions(entries,byDate,"nap");
  const endedOn={},startedOn={},napsOn={};
  nights.forEach(n=>{endedOn[n.endDate]=n;startedOn[n.startDate]=n});
  naps.forEach(n=>{(napsOn[n.startDate]=napsOn[n.startDate]||[]).push(n)});
  const rows=[];
  for(let i=days-1;i>=0;i--){
    const date=dateOffset(today,-i);
    const dayE=byDate[date]||[];
    const night=endedOn[date]||null,bed=startedOn[date]||null;
    const wakeE=dayE.filter(e=>e.type==="wakeup"&&e.time).sort((a,b)=>a.time.localeCompare(b.time))[0];
    const wake=wakeE?wakeE.time:(night?night.end:null);
    const dayNaps=(napsOn[date]||[]).slice().sort((a,b)=>a.startAbs-b.startAbs)
      .map(n=>({start:n.start,end:n.end,min:n.durationMin}));
    // janelas acordada: acordar → 1ª soneca; entre sonecas; última soneca → deitar
    const marks=[];
    if(wake)marks.push({t:_rpMin(wake),k:"wake"});
    dayNaps.forEach(n=>{marks.push({t:_rpMin(n.start),k:"napStart"});marks.push({t:_rpMin(n.start)+n.min,k:"napEnd"})});
    if(bed)marks.push({t:bed.startAbs,k:"bed"});
    marks.sort((a,b)=>a.t-b.t);
    const windows=[];
    for(let k=0;k<marks.length-1;k++){
      const a=marks[k],b=marks[k+1];
      if(a.k!=="wake"&&a.k!=="napEnd")continue;
      if(b.k!=="napStart"&&b.k!=="bed")continue;
      const d=b.t-a.t;
      if(d>0&&d<=1080)windows.push({from:_rpHHMM(a.t),to:_rpHHMM(b.t),min:d});
    }
    const feeds=dayE.filter(e=>(e.type==="bottle"||e.type==="nursing")&&e.time)
      .sort((a,b)=>a.time.localeCompare(b.time))
      .map(e=>({time:e.time,type:e.type,ml:e.ml||0,min:e.durationMin||0}));
    const napTotalMin=dayNaps.reduce((s,n)=>s+n.min,0);
    const mlTotal=feeds.reduce((s,f)=>s+f.ml,0);
    // v11.9.136: segmentos do MAPA (barras 00:00→24:00 daquele dia). A noite é recortada no
    // limite do dia: a metade depois da meia-noite entra na linha da manhã seguinte, que é
    // como um actograma de sono é lido. Percentuais são calculados na UI (min/1440).
    const sleepSegs=[],napSegs=[];
    nights.forEach(n=>{
      if(n.startDate===date)sleepSegs.push({from:n.startAbs,to:Math.min(1440,n.endDate===date?n.endAbs:1440)});
      else if(n.endDate===date)sleepSegs.push({from:0,to:Math.min(1440,n.endAbs-1440)});
    });
    naps.forEach(n=>{if(n.startDate===date)napSegs.push({from:n.startAbs,to:Math.min(1440,n.endAbs)})});
    // v11.9.141: janela ANTES do bedtime especificamente (não a maior do dia — `maxWindowMin`
    // continua igual, esse é um campo novo ao lado). É a janela cujo fim bate com o horário
    // que o bedtime começou (match por string, mais direto que assumir que é sempre a última
    // do array — não é garantido se algum evento acontecer depois do bedtime no mesmo dia).
    const preBedWindow=bed?windows.find(w=>w.to===bed.start):null;
    // v11.9.141: flag de outlier — critério literal pedido: noite <6h OU começou às 23h+.
    // Não conta pra distorcer a média "com outliers" da tabela/KPI; a raw continua disponível.
    const nightOutlier=!!(night&&(night.durationMin<360||parseInt(night.start,10)>=23));
    rows.push({date,
      // v11.9.142: `night` (acima) é a noite que TERMINOU nesta data (endedOn — começou na
      // véspera). `nightStartingHere` é a noite que COMEÇA nesta data à noite (mesmo objeto
      // que `bed`, exposto com nome claro) — necessário pra correlacionar corretamente coisas
      // do DIA (sonecas, leite, janela pré-bed) com a noite que elas podem ter influenciado
      // (a que vem DEPOIS, não a que já tinha acabado de manhã). Ver sleepCorrelations.
      wake,night,nightStartingHere:bed||null,bedtime:bed?bed.start:null,naps:dayNaps,napCount:dayNaps.length,napTotalMin,
      windows,maxWindowMin:windows.reduce((m,w)=>w.min>m?w.min:m,0),preBedWindowMin:preBedWindow?preBedWindow.min:null,
      feeds,feedCount:feeds.length,mlTotal,nursingMin:feeds.reduce((s,f)=>s+(f.type==="nursing"?f.min:0),0),
      sleepSegs:sleepSegs.filter(s=>s.to>s.from),napSegs:napSegs.filter(s=>s.to>s.from),feedMins:feeds.map(f=>_rpMin(f.time)),
      totalSleepMin:(night?night.durationMin:0)+napTotalMin,
      napDurations:dayNaps.map(n=>n.min),wakingDurations:night?night.wakingsDetail.map(w=>w.durationMin):[],
      nightOutlier,
      // v11.9.144: 1ª soneca da manhã em destaque — é o indicador de consolidação do ritmo
      // (a duração cresce e o horário estabiliza conforme a rotina amadurece). O dado já
      // existia em dayNaps[0], só não era exposto.
      firstNapMin:dayNaps.length?dayNaps[0].min:null,
      firstNapStart:dayNaps.length?dayNaps[0].start:null,
      // v11.9.144: tags de contexto que afetam ESTE dia (registro + janela de efeito).
      tags:eventDays[date]||[],
      // v11.9.144: hoje é um dia INCOMPLETO — ainda está acontecendo. Incluí-lo numa média
      // puxa tudo pra baixo (às 14h a Louise fez 2 das 4 sonecas). Quem consome decide o que
      // fazer, mas a flag deixa impossível incluir sem perceber.
      partial:date===today,
      hasData:!!(wake||night||bed||dayNaps.length||feeds.length)});
  }
  // v11.9.141: médias móveis de 7 dias (janela à esquerda, incluindo o próprio dia) —
  // pedido explicitamente pros despertares ("ver tendência sem ruído diário"); sono real
  // junto por ser a métrica-irmã de qualidade de noite. Exige >=2 noites rastreadas na
  // janela de 7 (mesmo piso de dado mínimo que `behaviorWeekly` já usa em outra tela do
  // app) — janela com muito buraco de registro não vira média, fica null.
  // v11.9.144: a janela EXCLUI o dia parcial de hoje — senão a última média móvel (que é
  // justamente a que se lê pra saber "como estamos agora") viria puxada pra baixo por um
  // dia que ainda não terminou.
  for(let i=0;i<rows.length;i++){
    const win0=rows.slice(Math.max(0,i-6),i+1).filter(r=>!r.partial);
    const win=win0.filter(r=>r.night);
    if(win.length>=2){
      rows[i].wakingsMA7=win.reduce((s,r)=>s+r.night.wakings,0)/win.length;
      rows[i].realSleepMA7=Math.round(win.reduce((s,r)=>s+r.night.realMin,0)/win.length);
    }else{
      rows[i].wakingsMA7=null;rows[i].realSleepMA7=null;
    }
    // Sono total do dia e 1ª soneca: base própria (não dependem de ter noite rastreada)
    const winT=win0.filter(r=>r.totalSleepMin>0);
    rows[i].totalSleepMA7=winT.length>=2?Math.round(winT.reduce((s,r)=>s+r.totalSleepMin,0)/winT.length):null;
    const winF=win0.filter(r=>r.firstNapMin>0);
    rows[i].firstNapMA7=winF.length>=2?Math.round(winF.reduce((s,r)=>s+r.firstNapMin,0)/winF.length):null;
  }
  return{days,from:rows[0]?rows[0].date:today,to:rows[rows.length-1]?rows[rows.length-1].date:today,rows};
}
// v11.9.142: 4 correlações pedidas pelo William, com cuidado estatístico redobrado (pedido
// literal dele: "não pode ter erro estatístico") — passou por revisão Opus+Fable (registrada
// no CLAUDE.md) que pegou um bug real na 1ª versão (mediana contaminada pelo dia de hoje
// incompleto — sozinho produzia o resultado "mais leite = mais despertar" que já tinha
// levantado suspeita) e rodou teste de significância mostrando que NENHUMA das 4, com só 30
// dias de dado, é distinguível de ruído. Por isso "solid" (dentro/fora da variação normal do
// dia a dia) substitui qualquer correlação/p-valor — número de precisão estatística falsa
// pra quem lê, e ainda precisaria de correção de múltiplas comparações rodando as 4 juntas.
// Regras:
// - hoje (dia incompleto) é excluído de todos os grupos — senão a mediana/contagem fica
//   contaminada por um dia que ainda não terminou (foi exatamente o bug pego na revisão);
// - pareamento respeita DIREÇÃO TEMPORAL: dia → a noite que COMEÇA aquela noite
//   (`nightStartingHere`), nunca a que já tinha acabado de manhã — com guarda extra
//   (`startAbs>=meio-dia`) pra noite que começa de madrugada, que inverteria a direção;
// - grupo com menos de MIN_N=7 dias vira `{ok:false}` — nunca mostra média com amostra
//   pequena demais pra confiar; toda comparação expõe o N de cada grupo;
// - "solid" = |diferença das médias| >= desvio-padrão do pool dos 2 grupos (equivalente a
//   Cohen's d>=1) — filtro conservador contra ruído sem expor p-valor;
// - `dayGap` EXPÕE (não corrige) confundimento por tendência dentro do mês — grupos
//   concentrados em semanas diferentes podem refletir idade, não a variável comparada;
// - bedtime compara HORÁRIO DE ACORDAR, não duração — duração≈acordar−bedtime é quase uma
//   identidade aritmética com o próprio bedtime, ia sempre "achar" diferença artificial;
// - devolve dado cru, a UI decide a linguagem — nunca "X causa Y", só comparação descritiva.
// v11.9.144: `opts.cleanOnly` roda a MESMA comparação só sobre os dias sem tag de contexto
// (vacina/dente/doença/alimento novo/co-sleeping e suas janelas de efeito). A UI mostra as
// duas versões lado a lado — mesmo espírito do "excl. noites atípicas" que o KPI de sono já
// usava. É o ganho principal das tags: separar "a Louise dormiu diferente" de "a Louise
// dormiu diferente PORQUE tomou vacina ontem".
function sleepCorrelations(rep,opts){
  const MIN_N=7,EVENING=12*60;
  const cleanOnly=!!(opts&&opts.cleanOnly);
  const rows=rep.rows.filter(r=>r.date!==todayStr()&&(!cleanOnly||!(r.tags&&r.tags.length)));
  const nsh=r=>(r.nightStartingHere&&r.nightStartingHere.startAbs>=EVENING)?r.nightStartingHere:null;
  const mean=(a,f)=>a.reduce((s,x)=>s+f(x),0)/a.length;
  const sdev=(a,f)=>{if(a.length<2)return 0;const m=mean(a,f);return Math.sqrt(a.reduce((s,x)=>s+(f(x)-m)*(f(x)-m),0)/(a.length-1))};
  const MET={duration:r=>nsh(r).durationMin,wakings:r=>nsh(r).wakings,wake:r=>nsh(r).endAbs-1440};
  // v11.9.142: média de duração POR SONECA dentro de um grupo (pedido do William no card de
  // sonecas) — achata todas as `napDurations` dos dias do grupo e tira a média simples. Não é
  // comparação nova nem correlação — é só um descritivo a mais dentro de uma comparação já
  // revisada, mesma conta que `napTotalMin` já faz em `sleepReport`, sem risco estatístico novo.
  const avgNap=a=>{const all=[];a.forEach(r=>r.napDurations.forEach(m=>all.push(m)));return all.length?Math.round(all.reduce((s,x)=>s+x,0)/all.length):null};
  const pair=(primary,la,A0,lb,B0)=>{
    let A=A0.filter(nsh),B=B0.filter(nsh);
    if(primary==="wake"){A=A.filter(r=>nsh(r).endAbs>=1440);B=B.filter(r=>nsh(r).endAbs>=1440)}
    const g=(l,a)=>a.length<MIN_N?{label:l,ok:false,n:a.length}:{label:l,ok:true,n:a.length,
      nightMin:Math.round(mean(a,MET.duration)),wakeMin:Math.round(mean(a,MET.wake)),
      wakings:Math.round(mean(a,MET.wakings)*10)/10,avgNapMin:avgNap(a)};
    const out={primary,groups:[g(la,A),g(lb,B)]};
    if(out.groups[0].ok&&out.groups[1].ok){
      const f=MET[primary],pool=A.concat(B),s=sdev(pool,f);
      out.solid=s>0&&Math.abs(mean(A,f)-mean(B,f))>=s;
      out.dayGap=Math.round(Math.abs(mean(A,r=>rows.indexOf(r))-mean(B,r=>rows.indexOf(r))));
    }
    return out;
  };
  const um=rows.filter(r=>nsh(r)&&r.mlTotal>0);
  let med=null;
  if(um.length>=MIN_N*2){const s=um.map(r=>r.mlTotal).slice().sort((a,b)=>a-b);
    med=s.length%2?s[(s.length-1)/2]:Math.round((s[s.length/2-1]+s[s.length/2])/2)}
  return{minN:MIN_N,
    naps:pair("duration","3",rows.filter(r=>r.napCount===3),"4",rows.filter(r=>r.napCount===4)),
    preBedWindow:pair("wakings",">2h30",rows.filter(r=>r.preBedWindowMin>150),"<=2h30",rows.filter(r=>r.preBedWindowMin!=null&&r.preBedWindowMin<=150)),
    milk:med==null?null:Object.assign({medianMl:med},pair("wakings","acima",um.filter(r=>r.mlTotal>med),"abaixo",um.filter(r=>r.mlTotal<=med))),
    bedtime:pair("wake","<19h30",rows.filter(r=>nsh(r)&&_rpMin(nsh(r).start)<19*60+30),">=19h30",rows.filter(r=>nsh(r)&&_rpMin(nsh(r).start)>=19*60+30))};
}
// Dia da semana calculado NA SAÍDA (não no `sleepReport`): assim o relatório fica todo no
// mesmo idioma, sem depender do `_lang` global no momento em que os dados foram montados.
function _rpWd(d,en){return new Date(d+"T12:00:00").toLocaleDateString(en?"en-US":"pt-BR",{weekday:"short"}).replace(".","")}
function sleepReportCSV(rep,lang){
  const en=lang==="en";
  const q=v=>{const s=String(v==null?"":v);return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
  const H=en?["Date","Weekday","Woke up","Night start","Night end","Night duration (min)","Night wakings","Awake at night (min)","Real night sleep (min)","Naps","Nap total (min)","Naps (detail)","Awake windows","Longest awake window (min)","Feeds","Milk (ml)","Nursing (min)","Feeds (detail)","Bedtime","Total sleep 24h (min)"]
    :["Data","Dia","Acordou","Início da noite","Fim da noite","Duração da noite (min)","Despertares","Tempo acordada à noite (min)","Sono noturno real (min)","Sonecas","Total de sonecas (min)","Sonecas (detalhe)","Janelas acordada","Maior janela (min)","Mamadas","Leite (ml)","Amamentação (min)","Mamadas (detalhe)","Deitou","Sono total 24h (min)"];
  const out=[H.map(q).join(",")];
  rep.rows.forEach(r=>{
    const napDet=r.naps.map(n=>n.start+"-"+n.end+" ("+n.min+"min)").join("; ");
    const winDet=r.windows.map(w=>w.from+"-"+w.to+" ("+fmtDur(w.min)+")").join("; ");
    const feedDet=r.feeds.map(f=>f.ml?f.time+" "+f.ml+"ml":f.time+" "+f.min+"min").join("; ");
    out.push([r.date,_rpWd(r.date,en),r.wake||"",r.night?r.night.start:"",r.night?r.night.end:"",
      r.night?r.night.durationMin:"",r.night?r.night.wakings:"",r.night?r.night.awakeMin:"",r.night?r.night.realMin:"",
      r.napCount||"",r.napTotalMin||"",napDet,winDet,r.maxWindowMin||"",
      r.feedCount||"",r.mlTotal||"",r.nursingMin||"",feedDet,r.bedtime||"",r.totalSleepMin||""].map(q).join(","));
  });
  return out.join("\n");
}
function sleepReportText(rep,lang,name){
  const en=lang==="en";
  const dt=d=>new Date(d+"T12:00:00").toLocaleDateString(en?"en-US":"pt-BR",{day:"numeric",month:"short"}).replace(".","");
  const avg=(arr,fn)=>arr.length?Math.round(arr.reduce((s,x)=>s+fn(x),0)/arr.length):0;
  const wN=rep.rows.filter(r=>r.night),wNap=rep.rows.filter(r=>r.napCount>0),wF=rep.rows.filter(r=>r.feedCount>0),wW=rep.rows.filter(r=>r.maxWindowMin>0);
  const L=[];
  L.push((name||"Louise")+" — "+(en?"Sleep & routine report":"Relatório de sono e rotina"));
  L.push(dt(rep.from)+" → "+dt(rep.to)+" · "+rep.days+" "+(en?"days":"dias"));
  L.push("");
  L.push(en?"AVERAGES":"MÉDIAS");
  if(wN.length)L.push("· "+(en?"Night sleep":"Sono noturno")+": "+fmtDur(avg(wN,r=>r.night.durationMin))+" ("+(en?"real":"real")+" "+fmtDur(avg(wN,r=>r.night.realMin))+") · "+(avg(wN,r=>r.night.wakings*10)/10).toFixed(1).replace(".",en?".":",")+" "+(en?"wakings":"despertares"));
  if(wNap.length)L.push("· "+(en?"Naps":"Sonecas")+": "+(avg(wNap,r=>r.napCount*10)/10).toFixed(1).replace(".",en?".":",")+"/"+(en?"day":"dia")+" · "+fmtDur(avg(wNap,r=>r.napTotalMin))+" "+(en?"total":"no total"));
  if(wW.length)L.push("· "+(en?"Awake window":"Janela acordada")+": "+(en?"longest":"maior")+" "+fmtDur(avg(wW,r=>r.maxWindowMin)));
  if(wF.length)L.push("· "+(en?"Feeds":"Mamadas")+": "+(avg(wF,r=>r.feedCount*10)/10).toFixed(1).replace(".",en?".":",")+"/"+(en?"day":"dia")+" · "+avg(wF,r=>r.mlTotal)+"ml");
  L.push("");
  L.push(en?"DAY BY DAY":"DIA A DIA");
  rep.rows.slice().reverse().forEach(r=>{
    if(!r.hasData)return;
    const head=[_rpWd(r.date,en)+" "+dt(r.date)];
    if(r.wake)head.push((en?"woke":"acordou")+" "+r.wake);
    if(r.night)head.push((en?"night":"noite")+" "+r.night.start+"→"+r.night.end+" "+fmtDur(r.night.durationMin)+(r.night.wakings?" ("+r.night.wakings+(en?" wakings":" desp.")+")":""));
    if(r.bedtime)head.push((en?"bedtime":"deitou")+" "+r.bedtime);
    L.push(head.join(" · "));
    if(r.naps.length)L.push("   "+(en?"naps":"sonecas")+": "+r.naps.map(n=>n.start+"–"+n.end+" ("+fmtDur(n.min)+")").join(", "));
    if(r.windows.length)L.push("   "+(en?"awake":"janelas")+": "+r.windows.map(w=>fmtDur(w.min)).join(" · "));
    if(r.feedCount)L.push("   "+(en?"feeds":"mamadas")+": "+r.feedCount+(r.mlTotal?" ("+r.mlTotal+"ml)":"")+(r.nursingMin?" + "+fmtDur(r.nursingMin)+(en?" nursing":" amamentação"):""));
  });
  return L.join("\n");
}
// Faixa típica de sono TOTAL/24h por idade (min). NSF/AAP. Banda suave de referência —
// não é diagnóstico (depende de quanto se registra; a UI avisa).
function typicalSleepMin(ageM){
  if(ageM<3)return{lo:840,hi:1020};
  if(ageM<6)return{lo:780,hi:960};
  if(ageM<12)return{lo:720,hi:900};
  if(ageM<24)return{lo:660,hi:840};
  return{lo:600,hi:780};
}
function calcAge(b){if(!b)return null;const p=b.split("-");const bi=new Date(+p[0],+p[1]-1,+p[2]);const n=new Date();const n0=new Date(n.getFullYear(),n.getMonth(),n.getDate());let m=(n0.getFullYear()-bi.getFullYear())*12+n0.getMonth()-bi.getMonth(),d=n0.getDate()-bi.getDate();if(d<0){m--;d+=new Date(n0.getFullYear(),n0.getMonth(),0).getDate()}const totalDays=Math.floor((n0-bi)/864e5);return{months:Math.max(0,m),days:Math.max(0,d),totalDays,totalWeeks:Math.floor(totalDays/7)}}
function fmtDur(m){if(!m)return"0min";const mi=Math.round(m);const h=Math.floor(mi/60),r=mi%60;return h>0?(r>0?`${h}h${r}m`:`${h}h`):`${r}min`}
// v11.9.6: smart unit formatting. Volume em ml > 1000 vira L (1,5L em PT, 1.5L em EN).
function fmtMl(ml){if(!ml||ml<=0)return"0ml";if(ml<1000)return`${ml}ml`;const l=ml/1000;const dec=l<10?1:0;const str=l.toFixed(dec);return _lang==="pt"?`${str.replace(".",",")}L`:`${str}L`}
// v11.9.15: smart relative date. "Hoje", "Ontem", "Anteontem", weekday se dentro de 7d,
// "26/4" se mais antigo. Aceita YYYY-MM-DD. Locale-aware.
function fmtRelDate(dateStr){
  if(!dateStr)return"";
  const today=todayStr();
  if(dateStr===today)return _lang==="en"?"Today":"Hoje";
  // Calc diff em dias usando local time (tz-safe).
  const a=new Date(today+"T12:00");
  const b=new Date(dateStr+"T12:00");
  if(isNaN(b))return dateStr;
  const diff=Math.round((a-b)/86400000);
  if(diff===1)return _lang==="en"?"Yesterday":"Ontem";
  if(diff===2)return _lang==="en"?"2 days ago":"Anteontem";
  if(diff>=3&&diff<=6){
    const wd=b.toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{weekday:"long"}).replace(".","");
    return _lang==="en"?`Last ${wd}`:wd.charAt(0).toUpperCase()+wd.slice(1)+" passada";
  }
  return b.toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{day:"numeric",month:"short"}).replace(".","");
}
function fmtTimer(s){const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;return h>0?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`}
// v11.9.128: memória do dia (mais-vida ideia A) — PURA. Varre os "primeiros" emocionais
// (primeira vez de cada tipo afetivo, primeira noite de 6h REAIS, cada marco registrado)
// e devolve UMA memória se hoje for aniversário redondo de algum deles (N meses no mesmo
// dia-do-mês, ou 100 dias). null nos outros dias — a raridade é o que a faz especial.
// Prioridade: marcos > recorde de sono > primeira-vez de tipo; empate = mais antigo.
function dailyMemory(entries,birthDate,today){
  if(!entries||entries.length===0||!today)return null;
  const t=new Date(today+"T12:00:00");
  const sorted=[...entries].filter(e=>e.date&&e.date<today).sort((a,b)=>(a.date+(a.time||"")).localeCompare(b.date+(b.time||"")));
  if(sorted.length===0)return null;
  const FIRSTS={bath:["primeiro banho registrado","first bath logged"],nursing:["primeira amamentação registrada","first nursing logged"],bottle:["primeira mamadeira registrada","first bottle logged"],tummytime:["primeiro tummy time","first tummy time"],nap:["primeira soneca registrada","first nap logged"]};
  const seen={};const evs=[];
  for(const e of sorted){
    if(FIRSTS[e.type]&&!seen[e.type]){seen[e.type]=true;evs.push({date:e.date,pt:FIRSTS[e.type][0],en:FIRSTS[e.type][1],pri:1})}
    if(e.type==="sleep"&&!seen._n6){
      const real=(e.durationMin||0)-((e.wakings||[]).reduce((s,w)=>s+(w.durationMin||0),0));
      if(real>=360){seen._n6=true;evs.push({date:e.date,pt:"primeira noite de 6 horas seguidas",en:"first 6-hour stretch of sleep",pri:2})}
    }
    if(e.type==="milestone"&&e.key){
      const m=((typeof window!=="undefined"&&window.DEV_MILESTONES)||[]).find(x=>x.key===e.key);
      if(m&&m.label)evs.push({date:e.date,pt:m.label.pt,en:m.label.en,pri:3});
    }
  }
  const cands=[];
  for(const f of evs){
    const d=new Date(f.date+"T12:00:00");
    const days=Math.round((t-d)/864e5);
    if(days<28)continue;
    if(days===100){cands.push({...f,days,lPt:"100 dias",lEn:"100 days"});continue}
    if(t.getDate()===d.getDate()){
      const months=(t.getFullYear()-d.getFullYear())*12+(t.getMonth()-d.getMonth());
      if(months>=1)cands.push({...f,days,lPt:months===1?"1 mês":months+" meses",lEn:months===1?"1 month":months+" months"});
    }
  }
  if(cands.length===0)return null;
  cands.sort((a,b)=>b.pri-a.pri||b.days-a.days);
  const c=cands[0];
  let age=null;
  if(birthDate){const ad=Math.round((new Date(c.date+"T12:00:00")-new Date(birthDate+"T12:00:00"))/864e5);if(ad>=0){const am=Math.floor(ad/30.4375);const rd=Math.round(ad-am*30.4375);age=am>0?am+"m"+rd+"d":ad+"d"}}
  const dts=new Date(c.date+"T12:00:00");
  return{
    pt:{head:"Há "+c.lPt,text:c.pt,sub:dts.toLocaleDateString("pt-BR",{day:"numeric",month:"long"})+(age?" · ela tinha "+age:"")},
    en:{head:c.lEn+" ago",text:c.en,sub:dts.toLocaleDateString("en-US",{month:"long",day:"numeric"})+(age?" · she was "+age:"")}
  };
}
function timeSince(d,t){if(!d||!t)return"";const diff=Math.floor((new Date()-new Date(`${d}T${t}`))/6e4);const ago=_lang==="en"?"ago":"atrás";if(diff<1)return _lang==="en"?"now":"agora";if(diff<60)return`${diff}min ${ago}`;const h=Math.floor(diff/60),m=diff%60;if(h<24)return m>0?`${h}h${m}m ${ago}`:`${h}h ${ago}`;return`${Math.floor(h/24)}d ${ago}`}
function minSince(d,t){if(!d||!t)return null;return Math.max(0,Math.floor((new Date()-new Date(`${d}T${t}`))/6e4))}
// Real sleep helpers: subtract waking time from sleep entries with wakings
// realSleepMin(entry) returns durationMin minus awake time inside (for sleep entries with wakings)
function realSleepMin(e){if(!e||!e.durationMin)return 0;const wakings=e.wakings||[];if(wakings.length===0)return e.durationMin;const awake=wakings.reduce((s,w)=>s+(w.durationMin||0),0);return Math.max(0,e.durationMin-awake)}
// awakeMinIn(entry) returns total awake time inside a sleep entry's wakings (0 for naps or sleeps without wakings)
function awakeMinIn(e){if(!e||!e.wakings)return 0;return e.wakings.reduce((s,w)=>s+(w.durationMin||0),0)}
// Sum real sleep across an array of entries (handles both naps and sleep with wakings)
function sumRealSleep(arr){return arr.filter(e=>(e.type==="sleep"||e.type==="nap")&&e.durationMin).reduce((s,e)=>s+realSleepMin(e),0)}
// Sum awake time across sleep entries (only the night-wake portion inside bedtimes)
function sumAwakeInSleep(arr){return arr.filter(e=>e.type==="sleep").reduce((s,e)=>s+awakeMinIn(e),0)}
// Count total wakings across an array of sleep entries
function countWakings(arr){return arr.filter(e=>e.type==="sleep"&&e.wakings).reduce((s,e)=>s+e.wakings.length,0)}
// findContainingBedtime: given an entry and the full entries list, returns the
// bedtime entry (type "sleep" with wakings) whose time range contains this entry,
// or null. Used to retroactively show events inside the SleepBlock even when they
// were registered without an explicit nightWake link (e.g. medicine added later
// or events from before v8.5.x linking).
// Excludes the types that delimit/fragment the night themselves.
const NIGHT_NESTED_EXCLUDED=["sleep","nap","wakeup","nightwaking","growth"];
function findContainingBedtime(ev,allEntries){
  if(!ev||!ev.date||!ev.time)return null;
  if(NIGHT_NESTED_EXCLUDED.includes(ev.type))return null;
  const evMs=new Date(`${ev.date}T${ev.time}`).getTime();
  if(isNaN(evMs))return null;
  // Look at all bedtime entries (type sleep with wakings or with reasonable duration)
  // We accept any sleep entry that has durationMin (regardless of wakings) as a candidate,
  // because the "container" concept doesn't strictly require having wakings.
  // But we only render SleepBlock when wakings.length>0, so practically this is the same.
  for(const s of allEntries){
    if(s.type!=="sleep"||!s.durationMin)continue;
    const startMs=new Date(`${s.date}T${s.time}`).getTime();
    if(isNaN(startMs))continue;
    const endMs=startMs+s.durationMin*60000;
    // Strict boundaries: events exactly at bedtime start or end are NOT inside. v10.4.6.
    // Common case: first morning feeding logged at the same minute the bedtime ended —
    // should appear as a top-level entry in Today, not buried inside the SleepBlock.
    if(evMs>startMs&&evMs<endMs)return s;
  }
  return null;
}
// dedupeLegacyWakings: safety net for old data created before splitMidnight was fixed (pre-v8.4.8).
// Old data has wakings duplicated in BOTH halves of cross-midnight sleeps (id + id_b).
// Returns a NEW entries array with each waking attributed to the correct half only.
// Does NOT mutate Firestore — runs on every read, idempotent.
// v11.9.25: skip se migration ja rodou (firestore corrigido). Re-render storm
// no Home era causado por nova ref retornada toda vez. Agora retorna mesma ref
// quando nada muda (ou skip total se flag setada).
function dedupeLegacyWakings(entries){
  if(!entries||!entries.length) return entries;
  // Fast-path: migration ja persistiu correcoes no Firestore — runtime helper desnecessario.
  try{if(localStorage.getItem("lp_legacy_wakings_migrated_v1"))return entries}catch(_){}
  const baseGroups={};
  for(const e of entries){
    if(e.type!=="sleep"||!e.wakings||!e.wakings.length) continue;
    const baseId=e.id.endsWith("_b")?e.id.slice(0,-2):e.id;
    if(!baseGroups[baseId])baseGroups[baseId]=[];
    baseGroups[baseId].push(e);
  }
  const fixedById={};
  for(const baseId in baseGroups){
    const pair=baseGroups[baseId];
    if(pair.length!==2) continue;
    const p1=pair.find(e=>!e.id.endsWith("_b"));
    const p2=pair.find(e=>e.id.endsWith("_b"));
    if(!p1||!p2) continue;
    // Detect legacy bug: both halves have IDENTICAL wakings array
    const sameWakings=p1.wakings.length===p2.wakings.length
      &&p1.wakings.every((w,i)=>w.time===p2.wakings[i].time&&w.durationMin===p2.wakings[i].durationMin);
    if(!sameWakings) continue;
    // Re-split: wakings >= start time stay on p1, others move to p2
    const [h,m]=(p1.time||"00:00").split(":").map(Number);
    const startMin=h*60+m;
    const wBefore=[],wAfter=[];
    for(const w of p1.wakings){
      const [wh,wm]=(w.time||"00:00").split(":").map(Number);
      if(wh*60+wm>=startMin) wBefore.push(w);
      else wAfter.push(w);
    }
    fixedById[p1.id]={...p1};
    fixedById[p2.id]={...p2};
    if(wBefore.length>0) fixedById[p1.id].wakings=wBefore; else delete fixedById[p1.id].wakings;
    if(wAfter.length>0) fixedById[p2.id].wakings=wAfter; else delete fixedById[p2.id].wakings;
  }
  // v11.9.25: se nada foi corrigido, retorna mesma ref pra evitar re-render dos useMemos
  // dependentes de entries (cada onSnapshot fire criava nova array antes).
  if(Object.keys(fixedById).length===0)return entries;
  return entries.map(e=>fixedById[e.id]||e);
}
// v11.9.10: migration one-shot — escreve no Firestore as correções que dedupeLegacyWakings
// faria em memória. Roda 1x por device (flag em localStorage). Após confirmar funcionando,
// dedupeLegacyWakings em runtime pode ser removido em uma versão futura.
async function migrateLegacyWakingsOnce(entries){
  if(!entries||!entries.length)return;
  try{
    if(localStorage.getItem("lp_legacy_wakings_migrated_v1"))return;
  }catch(_){return}
  const baseGroups={};
  for(const e of entries){
    if(!e||!e.id||e.type!=="sleep"||!e.wakings||!e.wakings.length) continue;
    const eid=String(e.id);
    const baseId=eid.endsWith("_b")?eid.slice(0,-2):eid;
    if(!baseGroups[baseId])baseGroups[baseId]=[];
    baseGroups[baseId].push(e);
  }
  const writes=[];
  for(const baseId in baseGroups){
    const pair=baseGroups[baseId];
    if(pair.length!==2) continue;
    const p1=pair.find(e=>e&&e.id&&!String(e.id).endsWith("_b"));
    const p2=pair.find(e=>e&&e.id&&String(e.id).endsWith("_b"));
    if(!p1||!p2) continue;
    const sameWakings=p1.wakings.length===p2.wakings.length
      &&p1.wakings.every((w,i)=>w.time===p2.wakings[i].time&&w.durationMin===p2.wakings[i].durationMin);
    if(!sameWakings) continue;
    const [h,m]=(p1.time||"00:00").split(":").map(Number);
    const startMin=h*60+m;
    const wBefore=[],wAfter=[];
    for(const w of p1.wakings){
      const [wh,wm]=(w.time||"00:00").split(":").map(Number);
      if(wh*60+wm>=startMin) wBefore.push(w);
      else wAfter.push(w);
    }
    const f1={...p1};const f2={...p2};
    if(wBefore.length>0) f1.wakings=wBefore; else delete f1.wakings;
    if(wAfter.length>0) f2.wakings=wAfter; else delete f2.wakings;
    writes.push(f1);writes.push(f2);
  }
  if(writes.length===0){
    try{localStorage.setItem("lp_legacy_wakings_migrated_v1","1")}catch(_){}
    return;
  }
  // v11.9.12: per-entry try/catch. Uma falha individual nao para o resto.
  // firebase.firestore() em vez de `db` (que e local ao script tag de init).
  let okCount=0,failCount=0;
  let fdb;
  try{fdb=firebase.firestore()}catch(e){console.warn("[migration] firestore unavailable",e);return}
  for(const w of writes){
    try{
      const clean=Object.fromEntries(Object.entries(w).filter(([_,v])=>v!==undefined));
      delete clean._docId;
      if(!w.wakings){
        try{clean.wakings=firebase.firestore.FieldValue.delete()}catch(_){delete clean.wakings}
      }
      await fdb.collection('entries').doc(w.id).set(clean,{merge:true});
      okCount++;
    }catch(e){failCount++;console.warn("[migration] write failed for",w&&w.id,e)}
  }
  if(failCount===0){
    try{localStorage.setItem("lp_legacy_wakings_migrated_v1","1")}catch(_){}
  }
  console.log("[migration] dedupeLegacyWakings: ok="+okCount+" fail="+failCount);
}
function dateOffset(b,o){const d=new Date(b+"T12:00:00");d.setDate(d.getDate()+o);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}

// ── CURIOSITIES + MILESTONES (loaded from curiosities.js) ──
const {CURIOSITIES, WEEKLY_CURIOSITIES, MILESTONES} = window;
// Helper: pick today's curiosity based on age (same cascade used by CuriosityCard).
// Returns {title, body, tagLabel} in requested lang, or null if no curiosity fits today.
function getTodayCuriosity(age,lang){
  if(!age) return null;
  const dayNum=age.totalDays;
  const monthNum=age.months;
  const weekNum=age.totalWeeks;
  let txt=null,tagLabel="";
  // Priority 1: daily curiosities (days 1-30)
  if(dayNum>=1&&dayNum<=30){
    const c=CURIOSITIES&&CURIOSITIES[dayNum-1];
    if(c){
      txt=lang==="en"?c.en:c.pt;
      tagLabel=lang==="en"?`Day ${dayNum}`:`Dia ${dayNum}`;
    }
  }
  // Priority 2: monthly milestones (only on the exact day of the month anniversary)
  else if(monthNum>=2&&monthNum<=12&&age.days===0){
    const ms=MILESTONES&&MILESTONES.find(m=>m.m===monthNum);
    if(ms){
      txt=lang==="en"?ms.en:ms.pt;
      tagLabel=lang==="en"?`${monthNum} months`:`${monthNum} meses`;
    }
  }
  // Priority 3: weekly curiosities (weeks 5-52) — only on the first day of each new week
  // (dayNum%7===0 ⇔ day baby transitions into weekNum). Avoids repeating the same
  // weekly fact 7 days in a row.
  if(!txt&&weekNum>=5&&weekNum<=52&&dayNum%7===0){
    const idx=weekNum-5;
    const wc=WEEKLY_CURIOSITIES&&WEEKLY_CURIOSITIES[idx];
    if(wc){
      txt=lang==="en"?wc.en:wc.pt;
      tagLabel=lang==="en"?`Week ${weekNum}`:`Semana ${weekNum}`;
    }
  }
  if(!txt) return null;
  return{title:txt.t,body:txt.b,tagLabel};
}

// ── WAKE LOCK (loaded from wake-lock.js) ──
// Keeps screen on during night wake / nursing timers.
const {WakeLock} = window;

// ── DEVICE FEATURES (loaded from device-features.js) ──
// Haptic feedback (vibration) + push notification setup.
const {Haptic, PushNotifs} = window;

// Split sleep entry that crosses midnight into two entries
function splitMidnight(entry){
  if(!entry.durationMin || (entry.type!=="sleep"&&entry.type!=="nap")) return [entry];
  const [h,m]=(entry.time||"00:00").split(":").map(Number);
  const startMin=h*60+m;
  const endMin=startMin+entry.durationMin;
  if(endMin<=1440) return [entry]; // doesn't cross midnight
  const beforeMidnight=1440-startMin;
  const afterMidnight=entry.durationMin-beforeMidnight;
  const nextDay=dateOffset(entry.date,1);
  // Split wakings: each waking belongs to ONE half based on its actual time.
  // A waking is "before midnight" if its time-of-day is >= startMin (still on the start day).
  // A waking is "after midnight" if its time-of-day is < startMin (rolled over to next day).
  const wakings=entry.wakings||[];
  const wakingsBefore=[];
  const wakingsAfter=[];
  for(const w of wakings){
    const [wh,wm]=(w.time||"00:00").split(":").map(Number);
    const wMin=wh*60+wm;
    // If the waking time is greater or equal to start time, it's still on the start day
    // (e.g., bedtime 20:42, waking 23:30 → before midnight)
    // Otherwise it rolled over (e.g., bedtime 20:42, waking 04:28 → after midnight)
    if(wMin>=startMin) wakingsBefore.push(w);
    else wakingsAfter.push(w);
  }
  const part1={...entry, durationMin:beforeMidnight, id:entry.id};
  const part2={...entry, date:nextDay, time:"00:00", durationMin:afterMidnight, id:entry.id+"_b"};
  // Only attach wakings array if non-empty (keeps entries clean for old code paths)
  if(wakingsBefore.length>0) part1.wakings=wakingsBefore; else delete part1.wakings;
  if(wakingsAfter.length>0) part2.wakings=wakingsAfter; else delete part2.wakings;
  return [part1, part2];
}
// v11.9.140: acha o par de uma entry partida por splitMidnight (achado #1 da auditoria —
// as 2 metades ficavam soltas, sem nenhum vínculo visual). Usa o próprio contrato de ID que
// splitMidnight cria (part2.id === part1.id+"_b") — não precisa remontar por hora/data como
// o relatório (_rpMergeSessions). Só considera merge quando NENHUMA metade tem wakings —
// noite com despertar já vira SleepBlock normalmente e não passa por aqui (escopo consciente).
function findMidnightPair(entry,entries){
  if(!entry||(entry.type!=="sleep"&&entry.type!=="nap")||!entry.durationMin||!entry.id)return null;
  const part1=entry.id.endsWith("_b")?entries.find(x=>x.id===entry.id.slice(0,-2)):entry;
  const part2=entry.id.endsWith("_b")?entry:entries.find(x=>x.id===entry.id+"_b");
  if(!part1||!part2)return null;
  if((part1.wakings&&part1.wakings.length)||(part2.wakings&&part2.wakings.length))return null;
  return{part1,part2};
}

// ── ROUTINE ENGINE v2 (loaded from routine-engine.js) ──
const {getSleepRec, getNapSug, analyzeSleepPatterns, projectSchedule, getDayInsights: _getDayInsights, getGuideline, toMinutes, minToTime, WW, predict: predictRoutine, getInsights: getRoutineInsights, analyze: analyzeRoutine, getStatus: getRoutineStatus, GUIDELINES} = RoutineEngine;
// Wrap getDayInsights to auto-inject current language
function getDayInsights(todayE, pattern, guideline) { return _getDayInsights(todayE, pattern, guideline, _lang); }

// ── ICON (filled + gradient for baby icons, stroke for UI) ──
let _ic=0;
