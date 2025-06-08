import { TextGrid } from "./grid.js";

const SPACE_CHAR = " ";


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
  return elements.reduce((frag, e, i) => {
    e = typeof e == "string" ? document.createTextNode(e) : e;
    if (!(e instanceof Node)) {
      console.log(e);
      throw new TypeError(
        `Cannot htmlJoin [${elements}]. Element ${e} is of the wrong type.`
      );
    }

    frag.appendChild(e);
    if (separator && i < elements.length - 1)
      frag.appendChild(document.createTextNode(separator));
    return frag;
  }, document.createDocumentFragment());
}

function rectify(rows, size = undefined) {
  return rows;
}

export function Textblock(text, {styles={}, link, onclick=undefined, onhover=undefined}={}) {
  return (space) => {

    // cap the text to the horizontal space available
    const capped = text.length > space.cols ? text.slice(0, space.cols) : text;

    // debugging with different colours
    const span = document.createElement("span");
    span.textContent = capped;
    Object.assign(span.style, styles);
    
    if (link) onclick = ()=> window.open(link);
    if (onhover) span.addEventListener("mouseenter", () => onhover(span, true));
    if (onhover) span.addEventListener("mouseleave", () => onhover(span, false));
    if (onclick) span.addEventListener("click", ()=>onclick(span));

    // Can currently only handle one row.
    // const lines = [document.createTextNode(capped)];
    const lines = [span];

    // return the rows to be stitched together
    // rectify: add space to ensure

    // return rectify(rows);
    return lines;
  };
}

export function Container({column=true, justify="start"}, children = []) {
  // currently horizontal only

  // justify options:
  // - start


  const getFlexPerp = ({ rows, cols }) => ({
    flex: column ? rows : cols,
    perp: !column ? rows : cols,
  });
  const getRowCol = ({ flex, perp }) => ({
    rows: column ? flex : perp,
    cols: column ? perp : flex,
  });

  return (space) => {
    let maxSize = getFlexPerp(space); // total space available and perpendicular
    let usedSize = { flex: 0, perp: 0 };

    let rendered = children.map((child) => {
      if (typeof child !== "function") {
        child = Textblock(child.toString());
      }

      const childSpace = getRowCol({
        flex: maxSize.flex - usedSize.flex,
        perp: maxSize.perp,
      });
      const result = child(childSpace);

      const resultSize = getFlexPerp(size(result));

      usedSize.flex += resultSize.flex;

      usedSize.perp = Math.max(usedSize.perp, resultSize.perp);

      return result;
    });

    // rectify all elements to take up the full container size
    rendered = rendered.map((element) => {
      if (column) {
        return element.map((line) =>
          htmlJoin([
            line,
            SPACE_CHAR.repeat(
              Math.max(
                0,
                usedSize.perp - (line.textContent ? line.textContent.length : 0)
              )
            ),
          ])
        );
      } else {
        const { rows, cols } = size(element);
        return [
          ...element,
          ...Array(usedSize.perp - rows).fill(SPACE_CHAR.repeat(cols)),
        ];
      }
    });

    
    const maxLines = (elements) => Math.max(...elements.map(arr => arr.length));

    let joinedLines = column
      ? rendered.flat()
      : Array.from(
          { length: maxLines(rendered)},
          (_, i) => htmlJoin(rendered.map((r) => r[i] ?? ""))
        );

    // returns an array of HTML objects representing the lines (rows) of the element.
    return joinedLines.slice(0, space.rows); // last check to ensure number of lines doesn't exceed space allocated
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

