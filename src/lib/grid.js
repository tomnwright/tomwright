import { seekDiscreteMax, debounce, deepCopy } from "./utils.js";

const MONO_FONT_ASPECT_RATIO = 0.55;

export class TextGrid {
  constructor(domObj) {
    // constructor variables
    this.domObj = domObj;

    // default variables
    this.dims = { rows: 0, cols: 0 };
    this.styles = { fontSize: 30, spacing: { row: 0, col: 0 } };
  }

  setStyles(styles, apply_dom = true) {
    Object.assign(this.styles, deepCopy(styles));
    if (apply_dom) this.applyStyleToDOM();
  }

  applyStyleToDOM() {
    const { fontSize, spacing } = this.styles;

    Object.assign(this.domObj.style, {
      fontSize: fontSize + "px",
      letterSpacing: spacing.col + "px",
      lineHeight: fontSize + spacing.row + "px",
    });
  }

  redim(dims) {
    Object.assign(this.dims, { ...dims });
  }

  setTestText(rows, cols) {
    this.domObj.textContent = Array.from({ length: rows }, () =>
      "A".repeat(cols)
    ).join("\n");
  }
}

// GridMaster

export class GridMaster extends TextGrid {
  children;

  settings = {
    default_fontSize: 30,
    min_dims: { rows: 100, cols: 100 },
    min_spacing: { row: 0, col: 0 },
    respace: true,
  };

  constructor(domObj, children = [], settings = {}) {
    // domObj should be hidden DOM object used to calculate layout
    super(domObj);

    // child grids
    this.children = children;
    this.setSettings(settings);

    // bind resize event and initialise
    window.addEventListener(
      "resize",
      debounce(() => this.fitToWindow(), 35)
    );
  }

  setSettings(settings) {
    Object.assign(this.settings, deepCopy(settings));
  }
  getSettings() {
    return deepCopy(this.settings);
  }

  fitToWindow() {
    // todo:
    //   - handle min rows/cols and small screens
    //   - fade to black in between

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // apply initial styles
    const {
      default_fontSize: fontSize,
      min_spacing: spacing,
      respace,
    } = this.getSettings();

    this.setStyles({ fontSize, spacing });

    // calculate and apply conservative dims estimate
    let rows = Math.floor(vh / (fontSize + spacing.row));
    let cols = Math.floor(
      vw / (fontSize * MONO_FONT_ASPECT_RATIO + spacing.col)
    );

    const height = () => this.domObj.offsetHeight;
    const width = () => this.domObj.offsetWidth - spacing.col;

    // determine max cols
    seekDiscreteMax(
      () => cols++,
      () => cols--,
      () => {
        this.setTestText(1, cols);
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
        this.setTestText(rows, 1);
        return height() >= vh;
      },
      100,
      () => rows < 1
    );

    // re-apply test text
    this.setTestText(rows, cols);

    if (respace) {
      // remaining spacing
      const rw = vw - width();
      const rh = vh - height();

      // distribute extra space over each letter/line
      spacing.row += rh / rows;
      spacing.col += rw / cols;

      // apply respacing
      this.setStyles({ spacing });
    }

    // apply dims here
    this.redim({ rows, cols });

    // apply dims and styling to children
    this.children.forEach((childGrid) => {
      if (!childGrid.domObj) return;
      childGrid.redim({ rows, cols });
      childGrid.setStyles(this.styles);
    });

    // call post draw where defined
    this.children.forEach((childGrid)=>childGrid.postDraw?.());
  }
}
