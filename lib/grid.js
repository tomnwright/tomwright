import { seekDiscreteMax } from "./utils.js";
import { palindrome_line } from "./char_gen.js";

// helper function to assign styles more quickly
HTMLElement.prototype.applyStyles = function (styles) {
  Object.assign(this.style, styles);
};

export class MonoGrid {
  animator;
  constructor(domObj, golObj) {
    // grid display
    this.domObj = domObj;

    this.golObj = golObj;

    // cell data
    this.cells = [];

    // initialise dimensions
    this.dims = { rows: 0, cols: 0 };

    // bind resize event
    window.addEventListener("resize", () => this.resize_grid());

    this.resize_grid();
  }

  resize_grid(font_size = 30, min_spacing = { h: 10, v: 3 }, respace = true) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // apply initial styles
    this.domObj.applyStyles({
      fontSize: font_size + "px",
      letterSpacing: min_spacing.h + "px",
      lineHeight: font_size + min_spacing.v + "px",
    });

    // Calculate conservative estimate
    let new_cols = Math.floor(vw / (font_size + min_spacing.h));
    let new_rows = Math.floor(vh / (font_size + min_spacing.v));

    // determine max cols
    seekDiscreteMax(
      () => new_cols++,
      () => new_cols--,
      () => {
        this.domObj.textContent = "A".repeat(new_cols);
        return this.domObj.offsetWidth >= vw;
      }
    );

    // determine max cols
    seekDiscreteMax(
      () => new_rows++,
      () => new_rows--,
      () => {
        this.domObj.textContent = Array.from({ length: new_rows })
          .fill("A")
          .join("\n");
        return this.domObj.offsetHeight >= vh;
      }
    );

    this.dims = { rows: new_rows, cols: new_cols };
    this.domObj.textContent = (palindrome_line(new_cols) + "\n").repeat(
      new_rows
    );

    this.golObj.redim(new_rows, new_cols);

    if (!respace) return;
    // remaining spacing
    const rw = vw - this.domObj.offsetWidth;
    const rh = vh - this.domObj.offsetHeight;

    const dsw = rw / (new_cols - 1);
    const dsh = rh / (new_rows - 1);

    // apply initial styles
    this.domObj.applyStyles({
      letterSpacing: min_spacing.h + dsw + "px",
      lineHeight: font_size + min_spacing.v + dsh + "px",
    });
  }

  start_anim(interval = 50) {
    this.golObj.set_rand();

    // if (this.animator) clearInterval(this.animator);
    this.animator = setInterval(() => this.iterate_gol(), interval); // 200 milliseconds = 0.2 seconds
  }

  iterate_gol() {
    const time = performance.now();
    this.golObj.iterate_gol();
    console.log(performance.now() - time);

    this.domObj.textContent = this.golObj.toString();
  }
}

// function redim_cells(new_dims = {}) {
//   if (new_dims) Object.assign(dims, new_dims);

//   const redim_row = (row) => {
//     if (!row) return Array(dims.cols).fill("");
//     return Array.from({ length: dims.cols }, (_, j) => row[j] || "");
//   };

//   cells = Array.from({ length: dims.rows }, (_, i) => redim_row(cells[i]));
// }

// function update_grid() {
//   grid.textContent = cells.map((row) => row.join("")).join("\n");
// }

// // container.style.letterSpacing="10px;"
