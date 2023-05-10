import FullHeight from "../FullHeight";
import Nav from "../Nav";
import ProfessionalEntry, { Entry } from "../ProfessionalEntry";
import { MyWorkWrapper } from "./styles";

const PROFRESSIONAL_ENTRIES: Entry[] = [
  {
    title: "Festive Fiends",
    oneLiner: "FWA Site of the Day",
    imageID: "festive_fiends",
    href: "https://www.festivefiends.com/",
  },
  {
    title: "Google's Digital Sovereignty",
    oneLiner: "Filler filler filler filler",
    imageID: "festive_fiends",
    href: "https://www.cloudsovereignty.withgoogle.com",
  },
  {
    title: "Google's Shopper Hopper",
    oneLiner: "Filler filler filler filler",
    imageID: "festive_fiends",
    href: "https://www.shopperhopper.withgoogle.com",
  },
  {
    title: "Zendesk 15 Years",
    oneLiner: "Filler filler filler filler",
    imageID: "festive_fiends",
    href: "",
  },
  {
    title: "Trustpilot Meme Generator",
    oneLiner: "Filler filler filler filler",
    imageID: "festive_fiends",
    href: "https://it.trustpilot.com/memes",
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
