const CONTOUR =
  "M 648.0 53.3 L 665.0 53.3 L 669.5 56.0 L 672.0 61.0 L 669.8 71.0 L 653.0 102.0 L 652.5 107.0 L 655.0 109.1 L 700.0 97.2 L 740.0 92.1 L 779.0 93.2 L 814.0 98.9 L 853.0 111.5 L 872.9 124.0 L 875.2 134.0 L 861.7 151.0 L 863.0 157.3 L 927.0 174.2 L 964.0 172.2 L 990.8 164.0 L 1024.0 150.2 L 1034.0 150.3 L 1037.8 154.0 L 1039.5 160.0 L 1035.8 184.0 L 1025.4 215.0 L 1007.1 250.0 L 1007.0 257.0 L 1074.1 304.0 L 1096.0 314.2 L 1128.0 322.7 L 1133.0 326.4 L 1135.0 332.0 L 1132.0 341.0 L 1122.2 354.0 L 1104.1 372.0 L 1084.6 387.0 L 1081.0 393.0 L 1097.0 427.0 L 1106.3 454.0 L 1111.7 484.0 L 1110.8 505.0 L 1107.0 509.9 L 1102.0 511.2 L 1080.0 502.9 L 1074.0 504.8 L 1075.1 540.0 L 1072.7 557.0 L 1065.0 563.3 L 1042.0 561.8 L 1035.4 566.0 L 1028.5 590.0 L 1019.5 644.0 L 1003.8 669.0 L 1003.9 675.0 L 1008.0 678.5 L 1044.0 683.3 L 1049.3 688.0 L 1051.6 696.0 L 1047.7 711.0 L 1027.2 755.0 L 1029.5 795.0 L 1027.3 824.0 L 1019.3 857.0 L 1005.4 889.0 L 991.0 909.0 L 974.0 924.9 L 954.0 938.2 L 927.3 950.0 L 907.0 994.0 L 891.2 1020.0 L 866.0 1050.4 L 837.0 1077.3 L 770.0 1130.3 L 720.0 1164.8 L 694.0 1176.3 L 664.0 1180.2 L 627.0 1177.4 L 600.0 1170.2 L 565.0 1151.3 L 523.0 1121.4 L 444.0 1057.4 L 397.6 1012.0 L 379.3 988.0 L 367.5 968.0 L 344.0 908.6 L 339.0 907.3 L 328.0 913.0 L 312.0 915.9 L 295.0 925.0 L 285.1 924.0 L 279.7 917.0 L 273.1 893.0 L 238.0 863.3 L 219.0 838.0 L 208.5 814.0 L 201.2 784.0 L 198.9 755.0 L 201.9 729.0 L 208.8 709.0 L 218.0 695.0 L 233.0 682.5 L 256.3 673.0 L 259.9 668.0 L 260.4 662.0 L 232.9 582.0 L 219.5 506.0 L 214.0 501.4 L 189.0 500.3 L 183.0 496.1 L 180.1 490.0 L 175.9 460.0 L 177.3 428.0 L 184.4 407.0 L 203.2 372.0 L 200.9 367.0 L 183.0 351.4 L 170.6 337.0 L 160.8 321.0 L 157.1 309.0 L 158.3 303.0 L 163.0 298.4 L 208.0 284.7 L 251.6 259.0 L 253.2 255.0 L 251.6 251.0 L 230.8 231.0 L 225.7 221.0 L 229.0 211.9 L 244.0 202.0 L 271.0 190.9 L 304.0 183.5 L 326.0 182.1 L 361.0 187.2 L 367.0 186.3 L 388.4 151.0 L 409.0 126.6 L 441.0 101.3 L 469.0 86.3 L 478.0 85.0 L 483.8 90.0 L 481.1 123.0 L 482.0 127.4 L 485.0 129.1 L 527.0 98.0 L 563.0 78.5 L 605.0 62.9 Z";

export function LogoReveal() {
  return (
    <svg
      className="fx-logo-svg"
      viewBox="0 0 1254 1254"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <mask
          id="fxrken-progress-mask"
          x="0"
          y="0"
          width="1254"
          height="1254"
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
          style={{ maskType: "alpha" }}
        >
          <path
            className="fx-logo-svg__reveal"
            d={CONTOUR}
            fill="none"
            stroke="#fff"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="3895"
              to="0"
              dur="2.8s"
              calcMode="spline"
              keyTimes="0;1"
              keySplines=".28 .06 .16 1"
              fill="freeze"
            />
            <animate
              attributeName="stroke-width"
              values="90;190;470;820;1220"
              keyTimes="0;.24;.52;.78;1"
              dur="2.8s"
              fill="freeze"
            />
          </path>
        </mask>

        <filter id="fxrken-trail-glow" x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="fxrken-head-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="wide" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="tight" />
          <feMerge>
            <feMergeNode in="wide" />
            <feMergeNode in="tight" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <image
        href="/fxrken-logo-3d.png?v=7"
        width="1254"
        height="1254"
        preserveAspectRatio="xMidYMid meet"
        mask="url(#fxrken-progress-mask)"
      >
        <set attributeName="visibility" to="hidden" begin="2.8s" fill="freeze" />
      </image>

      <image
        href="/fxrken-logo-3d.png?v=7"
        width="1254"
        height="1254"
        preserveAspectRatio="xMidYMid meet"
        visibility="hidden"
      >
        <set attributeName="visibility" to="visible" begin="2.8s" fill="freeze" />
      </image>

      <path
        d={CONTOUR}
        className="fx-logo-svg__trail"
        fill="none"
        stroke="#fff"
        filter="url(#fxrken-trail-glow)"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-3895"
          dur="2.8s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d={CONTOUR}
        className="fx-logo-svg__core"
        fill="none"
        stroke="#fff"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-3895"
          dur="2.8s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d={CONTOUR}
        className="fx-logo-svg__head"
        fill="none"
        stroke="#fff"
        filter="url(#fxrken-head-glow)"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="-455.7"
          to="-4350.7"
          dur="2.8s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}
