import Image from "next/image";

import { getMediaContent } from "@/utils/contentful";
import { SearchParams } from "@/types/routing";
import type {
  IProfessionalWork,
  IProfessionalWorkFields,
  ISelectedWorks,
  ISelectedWorksFields,
} from "@/types/generated/contentful";
import cssUtils from "@/theme/utils.module.scss";
import { getContentByType } from "@/content/contentful";
import { BLOG_HAS_SOME_PUBLISHED_ENTRIES } from "@/content/blog-meta";
import { WORK_STUDY_PAGE_ENABLED } from "@/config/flags";
import Media from "@/components/Media";
import FaviconSwitcher from "@/components/FaviconSwitcher";
import DefaultContainer from "@/components/DefaultContainer";
import CopyValueButton from "@/components/CopyValueButton";
import BlogLinks from "@/components/Blog/BlogLinks";

import meImage from "../../public/assets/images/me.png";
import css from "./page.module.scss";

// TODO: fix bad type assertions in this file

interface Props {
  searchParams: SearchParams;
}

export default async function Main({ searchParams }: Props) {
  const selectedWorkEntries = (
    await getContentByType("selectedWorks")
  )[0] as ISelectedWorks;
  const selectedWorks = (selectedWorkEntries.fields as ISelectedWorksFields)
    .selections;

  const { secret, all } = await searchParams;

  const showBlogLinks = BLOG_HAS_SOME_PUBLISHED_ENTRIES || !!secret;

  return (
    <DefaultContainer contained={false}>
      <div className={css.Homepage}>
        <FaviconSwitcher />
        <div className={css.DesktopSticky}>
          <header className={css.Header}>
            <h1 className="heading-main">
              <span>Balraj</span>
              <span className={css.AnimateWidth}>
                <span>
                  <span>
                    <Image src={meImage} alt="" />
                  </span>
                </span>
              </span>
              <span>Johal</span>
            </h1>
            <p className={css.Subheading}>{"[2025] Portfolio"}</p>
            <ul className={css.ContactMe}>
              <h2 className={cssUtils.ScreenReaderOnly}>Contact Me</h2>
              <li>
                <a
                  className={css.InvertOnHover}
                  href="https://twitter.com/BalrajJohal_"
                  target="_blank"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  className={css.InvertOnHover}
                  href="https://bsky.app/profile/balrajjohal.bsky.social"
                  aria-label="bluesky"
                  target="_blank"
                >
                  Bsky
                </a>
              </li>
              <li>
                <a
                  className={css.InvertOnHover}
                  href="https://www.linkedin.com/in/balraj-johal/"
                  target="_blank"
                >
                  Linkedin
                </a>
              </li>
              <li>
                <CopyValueButton
                  className={css.InvertOnHover}
                  value="workwithbalraj@gmail.com"
                  ariaLabel="Copy email"
                >
                  Email
                </CopyValueButton>
              </li>
            </ul>
          </header>

          <section className={css.AboutMe}>
            <p>Creative Developer</p>
            <p>
              Currently&nbsp;
              <a
                className={`${css.PhantomLink} ${css.InvertOnHover}`}
                href="https://phantom.land"
                target="_blank"
              >
                @PHANTOM
              </a>
            </p>
            <p>Based in London</p>
          </section>

          <section className={css.AccoladesSection}>
            <h2 className={cssUtils.ScreenReaderOnly}>Accolades</h2>
            <p>1x FWA Site of the Day</p>
            <p>1x Lovie People&apos;s Choice</p>
            <p>1x Lovie Silver</p>
            <p>3x Awwwards Honorable Mention</p>
          </section>
        </div>

        {showBlogLinks && (
          <section className={css.BlogLinksSection}>
            <BlogLinks />
          </section>
        )}

        <section className={css.SelectedWork}>
          <h2 className={cssUtils.ScreenReaderOnly}>Selected Works</h2>
          <ul className={css.WorkList}>
            {selectedWorks.map((entry, i) => (
              <SelectedWorkItem
                entry={entry}
                showAll={!!all}
                key={entry.sys.id}
                first={i === 0}
              />
            ))}
          </ul>
        </section>
      </div>
    </DefaultContainer>
  );
}

const SelectedWorkItem = ({
  entry,
  showAll,
  first,
}: {
  entry: IProfessionalWork;
  showAll: boolean;
  first: boolean;
}) => {
  const fields = entry.fields as unknown as IProfessionalWorkFields;

  if (!fields.isPublic && !showAll) {
    return null;
  }

  const href = WORK_STUDY_PAGE_ENABLED
    ? `work/${fields.slug}`
    : fields.linkToWork;

  const mediaContent = getMediaContent(fields);
  if (!mediaContent) {
    throw new Error(`Item ${fields.title} does not have media content.`);
  }

  return (
    <li>
      <a href={href}>
        <div className={css.MediaContainer} aria-hidden>
          <Media content={mediaContent} first={first} />
        </div>
        <h3>{fields.title}</h3>
        <div className={css.Oneliner}>{fields.oneLiner}</div>
      </a>
    </li>
  );
};
