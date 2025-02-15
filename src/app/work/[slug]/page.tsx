import { notFound } from "next/navigation";

import { findEntryBySlug, getMediaContent } from "@/utils/contentful";
import { IProfessionalWorkFields } from "@/types/generated/contentful";
import utilCss from "@/theme/utils.module.scss";
import { getContentByType } from "@/content/contentful";
import { WORK_STUDY_CAROUSEL_ENABLED } from "@/config/flags";
import VerticalList from "@/components/VerticalList";
import Media from "@/components/Media";
import Carousel from "@/components/Carousel";

import { BackLink, BackLinkCutCorner, Title } from "./styles";
import css from "./style.module.scss";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const CONTENT_TYPE = "professionalWork";

export async function generateMetadata({ params }: Props) {
  const entries = await getContentByType(CONTENT_TYPE);

  const { slug } = await params;

  const entry = findEntryBySlug(entries, slug);
  return {
    title: entry?.fields.title,
    robots: {
      index: false,
    },
  };
}

export async function generateStaticParams() {
  const entries = await getContentByType(CONTENT_TYPE);
  return entries.map((entry) => ({
    slug: entry.fields.slug,
  }));
}

export default async function Work({ params }: Props) {
  const { slug } = await params;
  const entries = await getContentByType(CONTENT_TYPE);

  const entry = findEntryBySlug(entries, slug);
  if (!entry) notFound();

  const fields = entry?.fields as unknown as IProfessionalWorkFields;
  const { title, description, roles, stackIUsed, linkToWork } = fields;

  const mediaContent = getMediaContent(fields);
  if (!mediaContent) {
    throw new Error(`Item ${fields.title} does not have media content.`);
  }

  return (
    <main className={css.WorkStudyContainer}>
      <section className={css.MediaContainer}>
        <Carousel>
          <Media key={1} content={mediaContent} />
          {WORK_STUDY_CAROUSEL_ENABLED && (
            <>
              <Media key={2} content={mediaContent} />
              <Media key={3} content={mediaContent} />
              <Media key={4} content={mediaContent} />
            </>
          )}
        </Carousel>
        <BackLink href="/">
          <BackLinkCutCorner>
            <span>Back</span>
          </BackLinkCutCorner>
        </BackLink>
      </section>

      <div className={css.ContentRow}>
        <section className={css.Meta}>
          <a
            href={linkToWork}
            className={utilCss.LinkWithChevron}
            target="_blank"
          >
            <Title title={title} />
          </a>
          {stackIUsed && stackIUsed.length > 0 && (
            <VerticalList
              className={css.Stack}
              heading="Stack"
              list={stackIUsed}
            />
          )}
          {roles && roles.length > 0 && (
            <VerticalList
              className={css.Role}
              heading="What I did"
              list={roles}
            />
          )}
        </section>
        <section className={css.Description}>
          <div className={css.DescriptionTextColumn}>
            <p>{description}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
