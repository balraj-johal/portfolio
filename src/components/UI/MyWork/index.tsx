import FullHeight from "../FullHeight";
import Nav from "../Nav";
import ProfessionalEntry, { Entry } from "../ProfessionalEntry";
import { MyWorkWrapper } from "./styles";

const PROFRESSIONAL_ENTRIES: Entry[] = [
  {
    title: "Festive Fiends",
    oneLiner: "FWA Site of the Day",
    imageID: "festive_fiends",
  },
  {
    title: "Google's Digital Sovereignty",
    oneLiner: "FWA Site of the Day",
    imageID: "festive_fiends",
  },
  {
    title: "Google's Shopper Hopper",
    oneLiner: "FWA Site of the Day",
    imageID: "festive_fiends",
  },
  {
    title: "Zendesk 15 Years",
    oneLiner: "FWA Site of the Day",
    imageID: "festive_fiends",
  },
  {
    title: "Trustpilot Meme Generator",
    oneLiner: "FWA Site of the Day",
    imageID: "festive_fiends",
  },
];

const MyWork = () => {
  return (
    <MyWorkWrapper>
      {/* <Nav /> */}

      {PROFRESSIONAL_ENTRIES.map((entry, i) => (
        <ProfessionalEntry content={entry} key={i} />
      ))}
    </MyWorkWrapper>
  );
};

export default MyWork;
