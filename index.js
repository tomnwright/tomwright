import { TextGrid, GridMaster } from "./lib/grid.js";
import { UIGrid, Container } from "./lib/ui.js";
import { GoLGrid } from "./lib/gol.js";

const master_div = document.getElementById("master-grid");
const ui_div = document.getElementById("ui-grid");
// const gol_div = document.getElementById("gol-grid");

// set up gol grid object
// const golGrid = new TextGrid(gol_div);
// const gol = new GoLGrid();

// set up ui grid object
const uiGrid = new UIGrid(
  ui_div,
  Container([
    Container(["HI there"]),
    "Hello world,this is a big old test",
    "Hello world,this is a big old test",
  ])
);
// const uiGrid = new TextGrid(ui_div);
// uiGrid.domObj.textContent = "Hey"

// create the grid controlller
const grid = new GridMaster(master_div, [uiGrid], {
  respace: true,
  default_fontSize: 40,
  min_spacing: { row: -8, col: 2 },
});

console.log("Fitting...");
grid.fitToWindow();

// const grid = new GridMaster(children, font-size, min-fontSize, min-rows, min-cols);
//  - fits a grid to the viewport
//  - determines grid dimensions and formatting
//  - handles cursor to
//  - passes info to children

// start GoL animation
// gol.start_animation();

// when to draw UI...
// - upon initialisation
// -
