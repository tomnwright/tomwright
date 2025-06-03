import { TextGrid } from "./grid.js";

export class UIGrid extends TextGrid {
  constructor(domObj, root) {
    super(domObj);

    // root app, should return document fragment
    this.root = root;
  }
  draw(space) {
    this.domObj.innerHTML = "";

    const result = htmlJoin(this.root(space), "\n");
    this.domObj.appendChild(result);
  }
}

function htmlJoin(elements, separator = "") {
  console.log(elements);
  return elements.reduce((frag, el, i) => {
    frag.appendChild(el);
    if (separator && i < elements.length - 1)
      frag.appendChild(document.createTextNode(separator));
    return frag;
  }, document.createDocumentFragment());
}

function rectify(rows) {
  return rows;
}

function Textblock(text, wrap = false) {
  return (space) => {
    const rand_col = `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`;

    // cap the text to the horizontal space available
    const capped = text.length > space.cols ? text.slice(0, space.cols) : text;

    // debugging with different colours
    const span = document.createElement("span");
    span.textContent = capped;
    span.style.color = rand_col;
    span.style.textDecoration = "underline";
    span.style.cursor = "pointer";
    span.addEventListener("mouseenter", () => {
      span.style.fontWeight = "bold";
    });
    span.addEventListener("mouseleave", () => {
      span.style.fontWeight = "";
    });
    span.addEventListener("click", () => {
      window.open("https://google.com", "_blank");
    });

    // Can currently only handle one row.
    // const lines = [document.createTextNode(capped)];
    const lines = [span];

    // return the rows to be stitched together
    // rectify: add space to ensure

    // return rectify(rows);
    return lines;
  };
}

export function Container(children = [], column = false) {
  // currently horizontal only

  const getFlex = (space, column) => (column ? space.rows : space.cols);
  const getPerp = (space, column) => (!column ? space.rows : space.cols);
  const getSpace = (flex, perp, column) => ({
    rows: column ? flex : perp,
    cols: column ? perp : flex,
  });

  return (space) => {
    let flex = getFlex(space, column); // total space available
    const perp = getPerp(space, column); //  perpendicular

    const rendered = children.map((child) => {
      if (typeof child !== "function") {
        child = Textblock(child.toString());
      }

      const result = child(getSpace(flex, perp, column));

      const flexUsed = getFlex(size(result), column);
      flex -= flexUsed;

      return result;
    });

    // Transpose rendered (array of arrays) to group nth line of each child

    let joinedRows = [];
    console.log("Rendered", rendered);
    if (column) {
      joinedRows = rendered.flat();
    } else {
      const maxLines = Math.max(...rendered.map((arr) => arr.length));
      for (let i = 0; i < maxLines; i++) {
        const lineEls = rendered.map(
          (arr) => arr[i] || document.createTextNode("")
        );
        joinedRows.push(htmlJoin(lineEls));
      }
    }

    return joinedRows;
    // return rendered.reduce((fragment, child) => {
    //   fragment.appendChild(child);
    //   return fragment;
    // }, document.createDocumentFragment());
  };
}

function size(lines) {
  // console.log(lines);
  const rows = lines.length;
  const cols = Math.max(
    0,
    ...lines.map((line) => (line.textContent || "").length)
  );

  return { rows, cols };
}

function Space(size) {
  return;
}
