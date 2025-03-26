import { GridMaster } from './lib/grid.js';
// import { GoLGrid } from './lib/gol.js';

console.log("Hey");

const calc_div = document.getElementById('ui-grid');
const ui_div = document.getElementById('ui-grid');
const gol_div = document.getElementById('gol-grid');




// set up gol grid object
// const gol = new GoLGrid();
//  - handles GoL grid

// set up ui grid object
// const ui = new UIGrid();

// const children = [gol, ui];

// create the grid controlller
const grid = new GridMaster(calc_div, []);
// const grid = new GridMaster(children, font-size, min-fontSize, min-rows, min-cols);
//  - fits a grid to the viewport
//  - determines grid dimensions and formatting
//  - handles cursor to 
//  - passes info to children



// start GoL animation
// gol.start_animation();
