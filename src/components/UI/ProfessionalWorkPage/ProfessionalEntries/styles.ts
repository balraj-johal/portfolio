import Image from "next/image";
import { styled } from "@phntms/css-components";

import TransitionLink from "../../TransitionLink";
import css from "./style.module.css";

export const ProfessionalEntriesWrapper = styled("div", {
  css: css.ProfessionalEntriesWrapper,
});

export const ProfessionalEntriesTitle = styled("h2", {
  css: css.ProfessionalEntriesTitle,
});

export const ProfessionalEntriesOneLiner = styled("p", {
  css: css.ProfessionalEntriesOneLiner,
});

export const ProfessionalEntriesLink = styled(TransitionLink, {
  css: css.ProfessionalEntriesLink,
});

export const ProfessionalEntriesImage = styled(Image, {
  css: css.ProfessionalEntriesImage,
});
