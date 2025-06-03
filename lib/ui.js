import { TextGrid } from "./grid.js";

export class UIGrid extends TextGrid {
  constructor(domObj, root) {
    super(domObj);

    // root app, should return document fragment
    this.root = root;
  }
  draw(space) {
    this.domObj.innerHTML = "";

    const fragResult = this.root(space);

    this.domObj.appendChild(fragResult);
  }
}

function rectify(rows) {
  return rows;
}

function Textblock(text, wrap = false) {
  return (space) => {
    // cap the text to the horizontal space available
    const capped = text.length > space.cols ? text.slice(0, space.cols) : text;

    // Can currently only handle one row.
    const rows = [document.createTextNode(capped)];

    // return the rows to be stitched together
    // rectify: add space to ensure

    // return rectify(rows);
    return rows[0];
  };
}

export function Container(children = [], column = true) {
  return (space) => {
    const rendered = children.map((child) => {
      const childSpace = space;

      if (typeof child !== "function") {
        child = Textblock(child.toString());
      }

      return child(childSpace);
    });

    console.log(rendered);

    // console.log(rendered)

    return rendered.reduce((fragment, child) => {
      fragment.appendChild(child);
      return fragment;
    }, document.createDocumentFragment());
  };
}
