const CONTOUR =
  "M 648.0 53.5 L 665.0 52.5 L 673.5 59.0 L 659.5 88.0 L 660.0 104.5 L 677.0 104.5 L 705.0 96.5 L 738.0 92.5 L 780.0 93.5 L 823.0 101.5 L 857.0 113.5 L 875.5 126.0 L 877.5 132.0 L 866.5 144.0 L 867.0 160.5 L 915.0 173.5 L 964.0 173.5 L 993.0 164.5 L 1026.0 149.5 L 1035.0 148.5 L 1039.5 155.0 L 1036.5 180.0 L 1022.5 221.0 L 1008.5 245.0 L 1008.5 261.0 L 1076.0 306.5 L 1102.0 317.5 L 1132.0 323.5 L 1136.5 329.0 L 1135.5 335.0 L 1123.5 352.0 L 1102.0 373.5 L 1083.5 387.0 L 1083.5 403.0 L 1095.5 424.0 L 1107.5 460.0 L 1111.5 507.0 L 1103.0 512.5 L 1090.0 506.5 L 1074.0 506.5 L 1073.5 559.0 L 1069.0 563.5 L 1034.5 563.0 L 1026.5 592.0 L 1025.5 615.0 L 1018.5 647.0 L 1015.5 654.0 L 1004.5 661.0 L 1005.0 679.5 L 1040.0 679.5 L 1051.5 690.0 L 1049.5 706.0 L 1026.5 752.0 L 1029.5 794.0 L 1027.5 821.0 L 1021.5 849.0 L 1004.5 890.0 L 991.5 908.0 L 970.0 927.5 L 949.0 940.5 L 925.5 947.0 L 914.5 978.0 L 897.5 1010.0 L 878.5 1036.0 L 842.0 1072.5 L 785.0 1118.5 L 720.0 1164.5 L 693.0 1176.5 L 673.0 1179.5 L 637.0 1178.5 L 604.0 1171.5 L 566.0 1151.5 L 525.0 1122.5 L 439.0 1052.5 L 395.5 1009.0 L 370.5 973.0 L 347.0 912.5 L 310.0 914.5 L 300.0 923.5 L 285.0 926.5 L 278.5 914.0 L 277.5 896.0 L 234.5 859.0 L 217.5 835.0 L 207.5 810.0 L 200.5 777.0 L 199.5 747.0 L 202.5 727.0 L 210.5 706.0 L 226.0 687.5 L 242.0 678.5 L 260.5 675.0 L 260.5 657.0 L 234.5 587.0 L 224.5 541.0 L 221.5 501.0 L 187.0 500.5 L 180.5 494.0 L 176.5 465.0 L 176.5 433.0 L 184.5 407.0 L 200.5 381.0 L 200.5 365.0 L 176.5 344.0 L 156.5 310.0 L 159.0 299.5 L 207.0 286.5 L 247.5 263.0 L 247.5 246.0 L 224.5 222.0 L 225.5 215.0 L 240.0 204.5 L 273.0 190.5 L 306.0 183.5 L 328.0 182.5 L 371.0 186.5 L 383.5 159.0 L 403.5 133.0 L 437.0 104.5 L 471.0 85.5 L 481.0 83.5 L 485.5 89.0 L 482.5 119.0 L 499.0 119.5 L 530.0 96.5 L 566.0 77.5 L 604.0 63.5 Z";

export function LogoReveal() {
  return (
    <svg
      className="fx-logo-svg"
      viewBox="0 0 1254 1254"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <path id="fxrken-contour" d={CONTOUR} />
        <clipPath id="fxrken-silhouette"><path d={CONTOUR} /></clipPath>

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
          />
        </mask>

        <filter id="fxrken-trail-glow" x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="fxrken-head-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="wide" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="tight" />
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
        clipPath="url(#fxrken-silhouette)"
      />

      <use
        href="#fxrken-contour"
        className="fx-logo-svg__trail"
        fill="none"
        stroke="#fff"
        filter="url(#fxrken-trail-glow)"
      />
      <use
        href="#fxrken-contour"
        className="fx-logo-svg__core"
        fill="none"
        stroke="#fff"
      />
      <use
        href="#fxrken-contour"
        className="fx-logo-svg__head"
        fill="none"
        stroke="#fff"
        filter="url(#fxrken-head-glow)"
      />
    </svg>
  );
}
