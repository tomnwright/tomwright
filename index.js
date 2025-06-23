import { TextGrid, GridMaster } from "./lib/grid.js";
import { UIGrid, Container, Textblock } from "./lib/ui.js";
import { GoLGrid } from "./lib/gol.js";

const master_div = document.getElementById("master-grid");
const ui_div = document.getElementById("ui-grid");
// const gol_div = document.getElementById("gol-grid");

// set up gol grid object
// const golGrid = new TextGrid(gol_div);
// const gol = new GoLGrid();

const Header = Container(
  { gap: 4, column: false, justify: "space-between", pad: { rows: 1 } },
  [
    "TOM WRIGHT",
    // Textblock("Start typing to ask AI...", { wrap: true }),
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
  ]
);

const Navbar = Container({ pad: { colsAfter: 4 } }, [
  Textblock("> About me", { styles: { "font-weight": "bold" } }),
  "Freelance",
  "Qualifications",
  "Projects",
  "Contact me",
  "Chat",
]);

const Content = Container({}, [
  "Hey there!",
  "I'm Tom, welcome to my portfolio.",
  Textblock("Here you can see some of the things I've been up to.", {
    wrap: true,
  }),
]);

// // main app
const App = Container(
  {
    justify: "center",
    column: false,
  },
  [
    Container({ maxSize: { cols: 80 } }, [
      Container({ column: false, justify: "center" }, [
        Textblock("This site is a work in progress!", {
          link: "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life",
          styles: { cursor: "pointer", "font-style": "italic" },
          onhover: (span, enter) => {
            span.style.fontWeight = enter ? "bold" : "";
          },
        }),
      ]),
      Header,
      Container({ column: false }, [Navbar, Content]),
    ]),
  ]
);

const uiGrid = new UIGrid(ui_div, App);

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
