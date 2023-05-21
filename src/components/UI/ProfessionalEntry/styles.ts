import Image from "next/image";
import { styled } from "@phntms/css-components";

import TransitionLink from "../TransitionLink";
import css from "./style.module.css";

export const ProfessionalEntryWrapper = styled("div", {
  css: css.ProfessionalEntryWrapper,
});

export const ProfessionalEntryTitle = styled("h2", {
  css: css.ProfessionalEntryTitle,
});

export const ProfessionalEntryOneLiner = styled("p", {
  css: css.ProfessionalEntryOneLiner,
});

export const ProfessionalEntryLink = styled(TransitionLink, {
  css: css.ProfessionalEntryLink,
});

export const ProfessionalEntryImage = styled(Image, {
  css: css.ProfessionalEntryImage,
});
