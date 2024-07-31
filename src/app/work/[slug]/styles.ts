import Link from "next/link";
import { styled } from "@phntms/css-components";

import SplitTitle from "@/components/SplitTitle";
import CutCornerTopLeft from "@/components/CutCornerTopLeft";

import css from "./style.module.scss";

export const Title = styled(SplitTitle, {
  css: css.Title,
});

export const BackLink = styled(Link, {
  css: css.BackLink,
});

export const BackLinkCutCorner = styled(CutCornerTopLeft, {
  css: css.BackLinkCutCorner,
});
