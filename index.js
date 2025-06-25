import { TextGrid, GridMaster } from "./lib/grid.js";
import { UIGrid, Container, Textblock } from "./lib/ui.js";
import { GolEngine } from "./lib/gol.js";
import { GolGrid } from "./lib/golgrid.js";
import { App } from "./app.js";


const master_div = document.getElementById("master-grid");
const ui_div = document.getElementById("ui-grid");
const gol_div = document.getElementById("gol-grid");


// initialise UI grid
const uiGrid = new UIGrid(ui_div, App);


// // set up gol grid object
const gol = new GolEngine();
const golGrid = new GolGrid(gol_div, gol);


golGrid.postDraw = () => {
  gol.fromString(ui_div.textContent);
  golGrid.gol_to_text();
  golGrid.restart_anim();
}


// create the grid controlller
const grid = new GridMaster(master_div, [uiGrid, golGrid], {
  respace: true,
  default_fontSize: 15,
  min_spacing: { row: -0, col: 2 },
});



console.log("Fitting...");
grid.fitToWindow();


// start GoL animation
// gol.set_rand();


console.log(gol.rows, gol.cols);
