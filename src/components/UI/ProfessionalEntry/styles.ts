import { styled } from "@phntms/css-components";
import Link from "next/link";
import css from "./style.module.css";

export const ProfessionalEntryWrapper = styled('div', {
  css: css.ProfessionalEntryWrapper,
})

export const ProfessionalEntryTitle = styled('h2', {
  css: css.ProfessionalEntryTitle,
})

export const ProfessionalEntryOneLiner = styled('p', {
  css: css.ProfessionalEntryOneLiner,
})

export const ProfessionalEntryImageLink = styled(Link, {
  css: css.ProfessionalEntryImageLink,
})

export const ProfessionalEntryImage = styled('img', {
  css: css.ProfessionalEntryImage,
})