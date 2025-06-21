import { TextGrid } from "./grid.js";

const SPACE_CHAR = "-";

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

export function Textblock(
  text,
  {
    styles = {},
    link,
    onclick = undefined,
    onhover = undefined,
    wrap = false,
  } = {}
) {
  if (link) onclick = () => window.open(link);
  return (space) => {
    // we'll return an array of spans representing the lines of our text
    let lines = [];
    // helper function to link events on each line to behavour on all lines
    const linkEvent = (target, event, fun) =>
      target.addEventListener(event, () => lines.forEach(fun));

    // helper function for creating span and applying span
    const createSpan = (textContent) => {
      const span = document.createElement("span");
      span.textContent = textContent;
      Object.assign(span.style, styles);

      if (onhover) linkEvent(span, "mouseenter", (s) => onhover(s, true));
      if (onhover) linkEvent(span, "mouseleave", (s) => onhover(s, false));
      if (onclick) span.addEventListener("click", () => onclick(span));
      return span;
    };

    // intialise remaining text to full string
    let rem = text;
    while (rem) {
      // split the text into capped and remaining
      const fitText = rem.slice(0, space.cols);
      rem = rem.slice(space.cols).trim();

      // create span and add to spans list
      lines.push(createSpan(fitText));

      // if wrapping is not enabled, simply return the line
      if (!wrap) break;
    }

    return lines;
  };
}

export function Container(
  { column = true, justify = "start", maxSize = {} },
  children = []
) {
  // functions to convert between flex dimensions (flex/perp) and row/col given orientation of container
  const getFlexPerp = ({ rows, cols }) => ({
    flex: column ? rows : cols,
    perp: !column ? rows : cols,
  });
  const getRowCol = ({ flex, perp }) => ({
    rows: column ? flex : perp,
    cols: column ? perp : flex,
  });

  // return a function which draws the element in a given space
  return (space) => {
    // initialise available flex space, applying maxSize
    let flexSpace = getFlexPerp({
      rows: Math.min(space.rows, maxSize.rows ?? space.rows),
      cols: Math.min(space.cols, maxSize.cols ?? space.cols),
    });
    // initialise cumulative space used by children
    let usedSize = { flex: 0, perp: 0 };

    // RENDER STEP
    // render each child to available space
    // iterate over children elements
    let renderedElements = children.map((child, i) => {
      // if child is not function (e.g. string, number), initialise as default text node
      if (typeof child !== "function") {
        child = Textblock(child.toString());
      }

      // CHILD SPACE
      // calculate flex space
      let flex;
      if (justify === "even") {
        // e.g. flexpace = 16, children = 3. evenSize = 16/3 = 5.33 -> 5. Last space = 16 - 5*2 = 6.
        // e.g. flexpace = 17, children = 3. evenSize = 17/3 = 5.66 -> 6. Last space = 17 - 6*2 = 5.
        const totalChildren = children.length;
        const evenSize = Math.round(flexSpace.flex / totalChildren);
        const lastEvenSize = flexSpace.flex - evenSize * (totalChildren - 1);
        flex = i === totalChildren - 1 ? lastEvenSize : evenSize;
      } else {
        flex = flexSpace.flex - usedSize.flex;
      }
      // assign space to this child
      const childSpace = { flex, perp: flexSpace.perp };

      // RENDER
      // call child to render in allocated space
      let result = child(getRowCol(childSpace));

      // RECTIFY FLEX DIMENSION
      // even spacing requires padding to even size
      if (justify == "even")
        result = rectify(result, getRowCol({ flex: childSpace.flex }));

      // calculate cumulative space
      const resultSize = getFlexPerp(size(result));
      usedSize.flex += resultSize.flex; // add rendered child size to
      usedSize.perp = Math.max(usedSize.perp, resultSize.perp);

      return result;
    });

    // RECTIFY PERPENDICULAR DIMENSION
    // rectify all elements to take up the full perpendicular container size
    renderedElements = renderedElements.map((element) =>
      rectify(
        element,
        getRowCol({
          perp: usedSize.perp,
        })
      )
    );

    // ELEMENT SPACE STEP
    let spacedElements = renderedElements;
    // initialise remaining space
    const spaceRem = flexSpace.flex - usedSize.flex;

    if (justify == "space-between") {
      const spaceBetween = Math.round(spaceRem / (children.length - 1));
      const lastSpaceBetween = spaceRem - spaceBetween * (children.length - 2);
      const lastIndex = children.length - 2;

      spacedElements = renderedElements.map((element, i) =>
        addRowsCols(
          element,
          getRowCol({
            flex:
              i < lastIndex
                ? spaceBetween
                : i == lastIndex
                ? lastSpaceBetween
                : 0,
          })
        )
      );
    } else if (justify == "center") {
      const spaceBefore = Math.floor(spaceRem / 2);
      const spaceAfter = spaceRem - spaceBefore;

      // add spacing elements at start and end of flex dimension
      spacedElements = [
        SpaceBlock(getRowCol({ flex: spaceBefore, perp:usedSize.perp})), // space before
        ...renderedElements,
        SpaceBlock(getRowCol({ flex: spaceAfter, perp: usedSize.perp}))   // space after
      ];
    }

    // JOIN STEP
    // join together
    let joinedLines = column
      ? // if column container, simply stitch the element lines together
        spacedElements.flat()
      : // if row container, construct nth row by joining the nth rows of the elements
        Array.from({ length: usedSize.perp }, (_, row_index) =>
          htmlJoin(spacedElements.map((element) => element[row_index] ?? ""))
        );

        return joinedLines;
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

function rectify(lines, { rows, cols }) {
  // add space to make rectangular
  // if no horizontal size (columns) given, assign by max line length
  const htmlLen = (line) => (line.textContent || "").length;

  // Determine the number of columns: use provided value or calculate max line length
  rows = rows || lines.length;
  cols = cols || Math.max(...lines.map(htmlLen));

  return Array.from({ length: rows }, (_, i) =>
    htmlResize(lines[i] || Space(cols), cols)
  );
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

function addRowsCols(lines, { rows, cols }, before = false) {
  return addSpace(lines, {
    rowsBefore: rows && before ? rows : 0,
    rowsAfter: rows && !before ? rows : 0,
    colsBefore: cols && before ? cols : 0,
    colsAfter: cols && !before ? cols : 0,
  });
}

function addSpace(lines, { rowsBefore, rowsAfter, colsBefore, colsAfter }) {
  const initialCols = size(lines).cols;

  const emptyLines = (n) => Array.from({ length: n }, () => Space(initialCols));

  return [
    ...emptyLines(rowsBefore ?? 0),
    ...lines,
    ...emptyLines(rowsAfter ?? 0),
  ].map((line) =>
    htmlJoin([Space(colsBefore ?? 0), line, Space(colsAfter ?? 0)])
  );
}

function Space(chars) {
  return document.createTextNode(SPACE_CHAR.repeat(chars));
}

function SpaceBlock({rows, cols}){
  return Array.from({ length: rows }, () => Space(cols));
}

function htmlResize(root, maxChars) {
  // check input node is of correct type
  if (!(root instanceof Node))
    throw new Error(
      `Cannot perform htmlResize on ${root}. Not instance of HTML node.`
    );

  // pad
  let d = maxChars - root.textContent.length;
  if (d >= 0) return htmlJoin([root, SPACE_CHAR.repeat(d)]);

  // crop
  const cap = (node) => {
    if (d <= 0) return node;

    if (node.textContent.length <= d) {
      d -= node.textContent.length;
      return null;
    }

    if (n.nodeType === Node.TEXT_NODE) {
      const l = node.textContent.length - d;
      const text = n.textContent.slice(0, l);
      d = 0;
      return document.createTextNode(text);
    }

    const copy = node.cloneNode(false);
    node.childNodes.reverse.forEach((child) => copy.appendChild(cap(child)));
    return copy;
  };

  return cap(root);
}
