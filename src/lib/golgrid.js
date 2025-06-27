import { TextGrid } from "./grid.js";

export class GolGrid extends TextGrid {
  
  constructor(domObj, golEngine) {
    // domObj should be hidden DOM object used to calculate layout
    super(domObj);

    // child grids
    this.golEngine = golEngine;
  }

  redim(dims) {
    super.redim(dims);

    // resize gol engine
    this.golEngine.redim(dims.rows, dims.cols);
  }

  gol_to_text() {
    this.domObj.textContent = this.golEngine.toString();
  }

  restart_anim() {
    if (this.animInterval) {
      clearInterval(this.animInterval);
    }
    this.animInterval = setInterval(() => {
      // iterate gol grid
      this.golEngine.iterate_gol();
      // set text
      this.gol_to_text();
    }, 100);
  }
}
