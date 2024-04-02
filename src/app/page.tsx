import Image from "next/image";

import {
  IProfessionalWorkFields,
  ISelectedWorks,
  ISelectedWorksFields,
} from "@/types/generated/contentful";
import cssUtils from "@/theme/utils.module.scss";
import { getContentByType } from "@/content/contentful";

import css from "./page.module.scss";

// TODO: fix bad type asseertions in this file

export default async function Main() {
  const selectedWorkEntries = (
    await getContentByType("selectedWorks")
  )[0] as ISelectedWorks;
  const selectedWorks = (selectedWorkEntries.fields as ISelectedWorksFields)
    .selections;

  return (
    <div className={css.PageContainer}>
      <header className={css.Header}>
        <h1 className={css.HeadingMain}>Balraj Johal</h1>
        <p className={css.Subheading}>{"[WIP] Portfolio"}</p>
        <ul className={css.ContactMe}>
          <h2 className={cssUtils.ScreenReaderOnly}>Contact Me</h2>
          <li>
            <a
              className={css.InvertOnHover}
              href="https://twitter.com/balrajJohal_"
              target="_blank"
            >
              Twitter
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
            <a
              className={css.InvertOnHover}
              href="mailto:workwithbalraj@gmail.com"
            >
              email
            </a>
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
        <p>2x Awwwards Honorable Mention</p>
      </section>

      <section className={css.SelectedWork}>
        <h2 className={cssUtils.ScreenReaderOnly}>Selected Works</h2>
        <ul className={css.WorkList}>
          {selectedWorks.map((entry, i) => {
            const fields = entry.fields as unknown as IProfessionalWorkFields;

            return (
              <li key={fields.slug}>
                <a
                  href={fields.linkToWork}
                  aria-label={`link to ${fields.title}`}
                  target="_blank"
                >
                  {fields.image && (
                    <div className={css.MediaContainer}>
                      <Media
                        url={`https:${fields.image.fields.file?.url}`}
                        first={i === 0}
                      />
                    </div>
                  )}
                  <h3>{fields.title}</h3>
                  {fields.roles && (
                    <div className={css.RolesPanel}>
                      <h4 className={cssUtils.ScreenReaderOnly}>
                        Roles on this project
                      </h4>
                      <ul className={css.Column_RightAligned}>
                        {fields.roles.map((role) => (
                          <li key={role}>- {role}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

const SUPPORTED_FILE_TYPES = ["mp4", "webm"];

const Media = ({ url, first }: { url: string; first?: boolean }) => {
  const isVideo = !!SUPPORTED_FILE_TYPES.find((filetype) =>
    url.includes(filetype),
  );

  if (isVideo) {
    return (
      <video muted playsInline autoPlay loop>
        <source src={url}></source>
      </video>
    );
  }
  return <Image src={url} alt="" width={400} height={200} priority={first} />;
};
