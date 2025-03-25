const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const dying = null;

let time;

function rules(n, alive) {
  // determines whether cell is alive in next iteration

  // if alive...
  // Rule 1: Any live cell with fewer than two live neighbours dies, as if by underpopulation.
  // Rule 2: Any live cell with two or three live neighbours lives on to the next generation.
  // Rule 3: Any live cell with more than three live neighbours dies, as if by overpopulation.
  if (alive) return n === 2 || n === 3;

  // if dead...
  // Rule 4: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  return n === 3;
}

Set.prototype.addAll = function (values) {
  for (let v of values) {
    this.add(v);
  }
};

export class GoLGrid {

  constructor(rows = 0, cols = 0) {
    // 1D sparse array containing all active cells
    this.data = [];

    // set containing the index of active cells
    // active = alive && (changed last iteration or a neighbour changed last iteration)
    this.active = new Set();

    // dimensions
    this.rows = rows;
    this.cols = cols;

    // set grid dimensions and initialize grid
    this.redim(rows, cols);
  }

  redim(new_rows, new_cols) {
    // Create new sparse data array
    this.new_data = new Array(new_rows * new_cols);

    // Only copy existing values that fit in the new dimensions
    this.data.forEach((val, k) => {
      // get coordinates in current grid system
      const i = Math.floor(k / this.cols);
      const j = k % this.cols;

      // don't copy if out of bounds in new grid
      if (i >= new_rows || j >= new_cols) return;

      // copy to position in new grid system
      const new_k = i * new_cols + j;
      this.new_data[new_k] = val;
    });

    // TODO: redim active set

    this.data = this.new_data;
    this.rows = new_rows;
    this.cols = new_cols;
  }

  set_rand(p_alive = 0.3) {
    const bernoulli = (p) => Math.random() < p;
    const rand_char = () =>
      chars.charAt(Math.floor(Math.random() * chars.length));

    this.data = new Array(this.data.length);

    for (let k = 0; k < this.data.length; k++) {
      if (bernoulli(p_alive)) {
        this.data[k] = rand_char();
        this.active.add(k);
      }
    }
  }

  iterate_gol() {
    let changes = new Map();
    let checked = new Set(this.active);
    let reactivated = new Set();

    // process active cells (alive & recent neighbourhood changes)
    for (let cell of this.active) {
      const nbs_alive = this.alive_neighbours(cell);

      if (!rules(nbs_alive.length, true)) {
        changes.set(cell, dying); // dies
        reactivated.addAll(nbs_alive);
      }
    }

    // loop through neighbours of active cells
    for (let cell of this.active) {
      // check neighbours
      for (let nb of this.neighbours(cell)) {
        // skip if already checked
        if (checked.has(nb)) continue;
        checked.add(nb);

        // find number of alive neighbours
        const nbs_alive = this.alive_neighbours(nb);
        const alive = this.is_alive(nb);
        const surv = rules(nbs_alive.length, alive);

        // if cell changes
        if (alive == surv) continue; // no change

        // change => newly active cell found!
        changes.set(nb, surv ? "A" : dying);
        reactivated.addAll(nbs_alive);
      }
    }

    // set active = changed & active
    this.active = new Set();

    // apply changes to data
    for (let [cell, newState] of changes) {
      if (newState === dying) {
        delete this.data[cell];
      } else {
        this.data[cell] = newState;
        this.active.add(cell);
      }
    }

    // add anything from reactivated which is not in changes, to changes
    for (let cell of reactivated) {
      if (this.is_alive(cell)) this.active.add(cell);
    }
  }


  alive_neighbours(cell) {
    let alive_nbs = [];

    for (let nb of this.neighbours(cell)) {
      if (this.is_alive(nb)) alive_nbs.push(nb);
    }
    return alive_nbs;
  }

  get_neighbours(cell) {
    let nbs = [];

    for (let nb of this.neighbours(cell)) {
      nbs.push(nb);
    }
    return nbs;
  }

  count_neighbours(k) {
    let n = 0;
    for (let nb of this.neighbours(k)) {
      if (this.is_alive(nb)) n++;
    }
    return n;
  }

  is_alive(k) {
    return k in this.data;
  }

  *neighbours(k) {
    const i = Math.floor(k / this.cols);
    const j = k % this.cols;

    const positive_mod = (n, m) => ((n % m) + m) % m;

    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        // skip self
        if (di === 0 && dj === 0) continue;

        // stitch edges
        const ni = positive_mod(i + di, this.rows);
        const nj = positive_mod(j + dj, this.cols);

        // yield index of neighbour
        yield ni * this.cols + nj;
      }
    }
  }

  toDebugString(dead_char = " ") {
    let str = "Grid:\n";

    for (let k = 0; k < this.data.length; k++) {
      if (k % this.cols === 0) str += Math.floor(k / this.cols) + " ";
      // add if value exists, else add dead_char
      if (k in this.data) str += this.data[k];
      else str += dead_char;

      // add newline if end of row
      if (k % this.cols === this.cols - 1) str += "\n";
    }

    return str;
  }
  
  toString(dead_char = " ") {
    let str = "";

    for (let k = 0; k < this.data.length; k++) {
      // add if value exists, else add dead_char
      if (k in this.data) str += this.data[k];
      else str += dead_char;

      // add newline if end of row
      if (k % this.cols === this.cols - 1) str += "\n";
    }

    return str;
  }

  

  print_set(s, title = "Grid") {
    let str = title + "\n";

    for (let k = 0; k < this.data.length; k++) {
      if (k % this.cols === 0) str += Math.floor(k / this.cols) + " ";
      // add if value exists, else add dead_char
      if (s.has(k)) str += "X";
      else str += "-";

      // add newline if end of row
      if (k % this.cols === this.cols - 1) str += "\n";
    }

    console.log(str);
  }

  set_cell(i, j, val) {
    const k = i * this.cols + j;
    this.data[k] = val;
    this.active.add(k);
  }

  get_cell(i, j) {
    const k = i * this.cols + j;
    return this.data[k];
  }

  add_glider(i, j) {
    this.set_cell(i + 1, j, "X");
    this.set_cell(i + 2, j + 1, "X");

    this.set_cell(i + 0, j + 2, "X");
    this.set_cell(i + 1, j + 2, "X");
    this.set_cell(i + 2, j + 2, "X");
  }
}
