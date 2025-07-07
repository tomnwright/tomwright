import { Container, Textblock } from "./lib/ui.js";
import { HomePage } from "./pages/home.js";
// import { CursorPopup } from "./lib/popup.js";

// const wipPopup = new CursorPopup("#popup");

const Header = Container(
  { gap: 4, column: false, justify: "space-between", pad: { rows: 1 } },
  [
    "TOM WRIGHT",
    // Textblock("Start typing to ask AI...", { wrap: true }),
    Container({ column: false }, [
      Textblock("LinkedIn", {
        styles: { cursor: "pointer" },
        onhover: (e, span, enter) => {
          span.style.fontWeight = enter ? "bold" : "";
        },
        link: "https://www.linkedin.com/in/tomnw/",
      }),
      " ",
      Textblock("GitHub", {
        styles: { cursor: "pointer" },
        onhover: (e, span, enter) => {
          span.style.fontWeight = enter ? "bold" : "";
        },
        link: "https://github.com/tomnwright",
      }),
    ]),
  ]
);

const Navbar = (page, setPage) => {
  return Container({ pad: { colsAfter: 4 } }, [
    ...[
      "About me",
      "Qualifications",
      "Projects",
      "About this site",
      "Contact me",
      "Chat",
    ].map((t, i) =>
      Textblock((i == page ? "> " : "") + t, {
        // onhover: (e, span, enter) =>
        //   enter ? wipPopup.showPopup(e) : wipPopup.hidePopup(e),
        // onmove: (e) => wipPopup.updatePosition(e),
        onclick: () => {
          setPage(i);
        },
        styles: {
          "font-weight": i == page ? "bold" : "regular",
          cursor: "pointer",
        },
        onhover: (e, span, enter) => {
          span.style.fontWeight = i == page || enter ? "bold" : "";
        },
      })
    ),
  ]);
};

// qualifications
const QualPage = Textblock(
  "I achieved a first class BSc in Mathematics from the University of Birmingham with an average score of 81%.",
  { wrap: true }
);

const ProjectsPage = Textblock("Page in progress...", {
  styles: { "font-style": "italic" },
});

const Bullet = (text) =>
  Container({ column: false, pad: { colsBefore: 2 } }, [
    "- ",
    Textblock(text, { wrap: true }),
  ]);

const SiteInfoPage = Container({ gap: 1 }, [
  Textblock("This site is an implementation of Conway's Game of Life (see link):", {
    wrap: true,
    link: "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life",
    styles: { cursor: "pointer", "font-style": "italic" },
    onhover: (e, span, enter) => {
      span.style.fontWeight = enter ? "bold" : "";
    },
  }),
  Bullet(
    "The app UI is rendered using a custom reactive grid system. The UI is one large HTML element, with monospace font to create the grid effect."
  ),
  Bullet(
    "The UI grid is used as starting state for the Game of Life."
  ),
  Bullet(
    "Each cell lives or dies in the next iteration based on its number of alive neighbours."
  ),
  Bullet(
    "The site is still in progress."
  ),
]);
const ContactPage = Textblock("Page in progress...", {
  styles: { "font-style": "italic" },
});
const ChatPage = Textblock("Page in progress...", {
  styles: { "font-style": "italic" },
});

// // main app
export const App = (space, state) => {
  const [page, setPage] = state.useState(0);

  return Container(
    {
      justify: "center",
      column: false,
    },
    [
      Container({ maxSize: { cols: 80 } }, [
        Container({ column: false, justify: "center" }, []),
        Header,
        Container({ column: false }, [
          Navbar(page, setPage),
          [
            HomePage,
            QualPage,
            ProjectsPage,
            SiteInfoPage,
            ContactPage,
            ChatPage,
          ][page],
        ]),
      ]),
    ]
  )(space, state);
};
