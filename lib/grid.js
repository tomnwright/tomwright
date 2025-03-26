import { seekDiscreteMax } from "./utils.js";
import { palindrome_line } from "./char_gen.js";

export class Grid {
  dims = { rows: 0, cols: 0 };

  constructor(rows, cols) {
    this.dims = { rows, cols };
  }

  toString() {
    return Array.from({ length: this.dims.cols }).fill("A").join("\n");
  }

  redim(rows, cols) {
    this.dims = { rows, cols };
  }
}

export class GridMaster extends Grid {
  div;
  children;
  styles = { fontSize: 30, minSpacing: { h: 2, v: 0 }, respace: true };

  constructor(div, children, styles = {}) {
    super(0, 0); // don't like this

    // DOM object used to calculate layout
    // child grids
    this.div = div;
    this.children = children;
    Object.assign(this.styles, styles);

    // bind resize event and initialise
    window.addEventListener("resize", () => this.resize_grid());
    this.resize_grid();
  }

  resize_grid() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // load styles to aid readability
    const { fontSize, minSpacing, respace } = this.styles;

    // apply initial styles
    this.div.style.fontSize = fontSize + "px";
    this.div.style.letterSpacing = minSpacing.h + "px";
    this.div.style.lineHeight = fontSize + minSpacing.v + "px";

    // calculate and apply conservative dims estimate
    const aspect = 0.5;
    let new_rows = Math.floor(vh / (fontSize + minSpacing.v));
    let new_cols = Math.floor(vw / (fontSize * aspect + minSpacing.h));
    this.redim(new_rows, new_cols);

    this.seekFitByTest(vw, vh);

    // REDIM CHILDREN

    // DELETE?
    // this.golObj.redim(new_rows, new_cols);
    this.children.forEach(childGrid => childGrid.redim(this.dims.rows, this.dims.cols));

    if (!respace) return;

    // remaining spacing
    const rw = vw - (this.div.offsetWidth - this.styles.minSpacing.h);
    const rh = vh - this.div.offsetHeight;

    const letter_rw = rw / this.dims.cols;
    const letter_rh = rh / (this.dims.rows - 1);

    // // apply initial styles
    this.div.style.letterSpacing = minSpacing.h + letter_rw + "px";
    this.div.style.lineHeight = fontSize + minSpacing.v + letter_rh + "px";
  }

  seekFitByTest(vw, vh) {
    let { rows, cols } = this.dims;

    const height = () => this.div.offsetHeight;
    const width = () => this.div.offsetWidth - this.styles.minSpacing.h;

    // determine max cols
    seekDiscreteMax(
      () => cols++,
      () => cols--,
      () => {
        this.setTestText(1,cols);
        return width() >= vw;
      },
      100,
      () => cols < 1
    );

    // determine max cols
    seekDiscreteMax(
      () => rows++,
      () => rows--,
      () => {
        this.setTestText(rows,1);
        return height() >= vh;
      },
      100,
      () => rows < 1
    );

    this.setTestText(rows,cols);
  }

  setTestText(rows, cols) {
    this.div.textContent = Array.from({ length: rows }, () =>
      "A".repeat(cols)
    ).join("\n");
  }

  
}
