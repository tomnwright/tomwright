import {Container, Textblock} from "./lib/ui.js"

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
export const App = Container(
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
