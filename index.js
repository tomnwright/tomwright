import { TextGrid, GridMaster } from "./lib/grid.js";
import { UIGrid, Container, Textblock } from "./lib/ui.js";
import { GoLGrid } from "./lib/gol.js";

const master_div = document.getElementById("master-grid");
const ui_div = document.getElementById("ui-grid");
// const gol_div = document.getElementById("gol-grid");

// set up gol grid object
// const golGrid = new TextGrid(gol_div);
// const gol = new GoLGrid();

const Header = Container({ column: false, justify: "space-between" }, [
  "TOM WRIGHT",
  Textblock("Start typing to ask AI...", { wrap: true }),
  Container({ column: false }, [
    Textblock("LinkedIn", {
      styles: { cursor: "pointer" },
      onhover: (span, enter) => {
        span.style.fontWeight = enter ? "bold" : "";
      },
      link: "https://www.linkedin.com/in/tomnw/",
    }),
    " ",
    Textblock("GitHub", {
      styles: { cursor: "pointer" },
      onhover: (span, enter) => {
        span.style.fontWeight = enter ? "bold" : "";
      },
      link: "https://github.com/tomnwright",
    }),
  ]),
]);

const Navbar = Container({justify:"space-between"}, [
  "About me",
  "Freelance",
  "Qualifications",
  "Projects",
  "Contact me",
  "Chat",
]);

const Content = Container({}, ["Content", "", "", "--●----"]);

// // main app
const App = Container(
  {
    justify: "center",
    column: false,
  },
  [Container({maxSize:{cols:80}}, [Header," ", Container({ column: false }, [Navbar,"       ", Content])])]
);

// Test: centre page
// const App = Container({ justify: "center", column: false }, [
//   Container({ justify: "center", column: true }, ["Hey"]),
// ]);

// Test: space-between
// const App = Container({column:false, justify:"space-between"}, ["This", "is", "a", "test"])

// set up ui grid object
const uiGrid = new UIGrid(ui_div, App);
// const uiGrid = new TextGrid(ui_div);
// uiGrid.domObj.textContent = "Hey"

// create the grid controlller
const grid = new GridMaster(master_div, [uiGrid], {
  respace: true,
  default_fontSize: 40,
  min_spacing: { row: -0, col: 2 },
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
