import { Container, Textblock} from "../lib/ui";




const Project = (
  title = "Project title",
  descr = "Description...",
  link = ""
) => {
  return Container({ pad: { rowsBefore: 1 } }, [
    Textblock(title, {
      styles: { cursor: "pointer" },
      link,
    }),
    Container({ pad: { colsBefore: 1 } }, [
      Textblock(descr, {
        wrap: true,
        styles: { "font-style": "italic", cursor: "pointer" },
        link,
      }),
    ]),
  ]);
};

const projectList = [
  Project(
    "OfficeJS Addin",
    "Developed FIECON Powerups Office 365 add-in with 75% adoption, saving £40K annually.",
    "https://www.linkedin.com/posts/tomnw_at-fiecon-were-using-technology-to-enhance-activity-7336734483787759616-WY3E?utm_source=share&utm_medium=member_desktop&rcm=ACoAABjc42YBPiUfkzVSPG36c0JHKBDtbn-Rj94"
  ),
  Project(
    "University dissertation",
    "'Deep learning and its applications', on the mathematics of neural networks",
    "https://drive.google.com/file/d/1vHy7rvSqQRU3JVmmJXgndWkH3knlqRFU/view?usp=sharing"
  ),
  Project(
    "XOR training",
    "Training a shallow NN on the XOR problem (Python).",
    "https://github.com/tomnwright/shallow-XOR"
  ),
  Project(
    "Mobile games",
    "Published two mobile games to the Google Play store, developed in Unity using C#.",
    "https://tomnwright.itch.io/highest"
  ),
  Project(
    "RSA",
    "Python implementation of RSA encryption.",
    "https://github.com/tomnwright/rsa-encryption"
  ),
  Project(
    "Sky Chess",
    "Relaxing two-person chess designed for console.",
    "https://tomnwright.itch.io/skychess"
  ),
];



// based in London
export const HomePage = Container({}, [
  Textblock(
    "Hi! I'm Tom.\nI'm a first-class maths grad based in London. I'm interested in AI, innovation, and building impactful tech. Here's some of the things I've been up to.",
    {
      wrap: true,
    }
  ),
  " ",
  "- - - - - - - - - - -",
  ...projectList,
]);


