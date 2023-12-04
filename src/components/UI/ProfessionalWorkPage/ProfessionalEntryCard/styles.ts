import { styled } from "@phntms/css-components";

import TransitionLink from "../../TransitionLink";
import css from "./style.module.scss";

export const ProfessionalEntryCardWrapper = styled("div", {
  css: css.ProfessionalEntryCardWrapper,
});

export const ProfessionalEntryCardTitle = styled("h2", {
  css: css.ProfessionalEntryCardTitle,
});

export const ProfessionalEntryCardOneLiner = styled("p", {
  css: css.ProfessionalEntryCardOneLiner,
});

export const ProfessionalEntryCardLink = styled(TransitionLink, {
  css: css.ProfessionalEntryCardLink,
});
