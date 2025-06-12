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
  // currently horizontal only

  // justify options:
  // - start
  // - even
  // - centre [todo]
  // - space-between [todo]
  // - wrapping [todo]
  // - padding [todo]

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
    const cappedSpace = {
      rows: Math.min(maxSize.rows || Infinity, space.rows),
      cols: Math.min(maxSize.cols || Infinity, space.cols),
    };

    // initialise space variables
    let flexSpace = getFlexPerp(cappedSpace); // total space available and perpendicular
    let usedSize = { flex: 0, perp: 0 };

    // temporary... should be better way to handle this once we have many justify options
    // e.g. flexpace = 16, children = 3. evenSize = 16/3 = 5.33 -> 5. Last space = 16 - 5*2 = 6.
    // e.g. flexpace = 17, children = 3. evenSize = 17/3 = 5.66 -> 6. Last space = 17 - 6*2 = 5.
    const evenSize = Math.round(flexSpace.flex / children.length);
    const lastEvenSize = flexSpace.flex - evenSize * (children.length - 1); // adjustment in case rows not divisible by children
    // if (justify == "even") console.log(flexSpace.flex, evenSize, lastEvenSize);
    // render each element
    let rendered = children.map((child, i) => {
      // if child is not function (e.g. string, number), initialise as default text node
      if (typeof child !== "function") {
        child = Textblock(child.toString());
      }

      const flexEven = i + 1 == children.length ? lastEvenSize : evenSize;
      // calculate space assigned to child
      const childSpace = {
        flex:
          // justify == "start"
          //   ? maxSize.flex - usedSize.flex
          //   : justify == "even"
          //   ? evenSize
          //   : null,
          // justify == "start"

          justify == "even" ? flexEven : flexSpace.flex - usedSize.flex,
        perp: flexSpace.perp,
      };

      // call render
      let result = child(getRowCol(childSpace));
      if (justify == "even")
        result = rectify(result, getRowCol({ flex: childSpace.flex }));

      // adjust used space
      const resultSize = getFlexPerp(size(result));
      usedSize.flex += resultSize.flex;
      usedSize.perp = Math.max(usedSize.perp, resultSize.perp);

      return result;
    });

    if (justify == "even" && usedSize.flex < flexSpace.flex)
      console.log("Bad!", evenSize, lastEvenSize, flexSpace);

    // rectify all elements to take up the full container size
    rendered = rendered.map((element) =>
      rectify(
        element,
        getRowCol({
          perp: usedSize.perp,
        })
      )
    );

    const maxLines = (elements) => Math.max(...elements.map((e) => e.length)); // can this be calculated above?

    // join lines
    let joinedLines = column
      ? rendered.flat() // if column, simply output child lines as ordered flat array
      : // if row, construct nth line by joining nth line from each element
        Array.from({ length: maxLines(rendered) }, (_, i) =>
          htmlJoin(rendered.map((r) => r[i] ?? ""))
        ); //.slice(0, space.rows); // last check to ensure number of lines doesn't exceed space allocated; SHOULD'T BE NECESSARY

    if (justify != "center") return joinedLines;

    const spaceRem = flexSpace.flex - usedSize.flex;
    const spaceBefore = Math.floor(spaceRem / 2);
    const spaceAfter = spaceRem - spaceBefore;

    console.log(flexSpace, usedSize, spaceBefore, spaceAfter);

    const spacedLines = column
      ? [
          ...Array(spaceBefore)
            .fill()
            .map(() => Space(usedSize.perp)),
          ...joinedLines,
          ...Array(spaceAfter)
            .fill()
            .map(() => Space(usedSize.perp)),
        ]
      : joinedLines.map((line) =>
          htmlJoin([Space(spaceBefore), line, Space(spaceAfter)])
        );
    // returns an array of HTML objects representing the lines (rows) of the element.
    return spacedLines;
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

function Space(chars) {
  return document.createTextNode(SPACE_CHAR.repeat(chars));
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
