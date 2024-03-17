import Image from "next/image";

import {
  IProfessionalWorkFields,
  ISelectedWorks,
  ISelectedWorksFields,
} from "@/types/generated/contentful";
import { getContentByType } from "@/content/contentful";

import css from "./page.module.scss";

// TODO: fix bad type asseertions in this file
// TODO: fix prettier dangling comma rule conflicts
export default async function Main() {
  const selectedWorkEntries = (
    await getContentByType(
      // eslint-disable-next-line prettier/prettier
      "selectedWorks"
    )
  )[0] as ISelectedWorks;
  const selectedWorks = (selectedWorkEntries.fields as ISelectedWorksFields)
    .selections;

  return (
    <div className={css.PageContainer}>
      <header className={css.Header}>
        <h1 className={css.HeadingMain}>Balraj Johal</h1>
        <p className={css.Subheading}>{"[WIP] Portfolio"}</p>
        <ul className={css.ContactMe}>
          <h2 className={css.VisuallyHidden}>Contact Me</h2>
          <li>
            <a href="https://twitter.com/balrajJohal_" target="_blank">
              Twitter
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/balraj-johal/" target="_blank">
              Linkedin
            </a>
          </li>
          <li>
            <a href="mailto:workwithbalraj@gmail.com">email</a>
          </li>
        </ul>
      </header>

      <section>
        <p>Creative Developer</p>
        <p>
          Currently&nbsp;
          <a
            className={css.PhantomLink}
            href="https://phantom.land"
            target="_blank"
          >
            @PHANTOM
          </a>
        </p>
        <p>Based in London</p>
      </section>

      <section className={css.AccoladesSection}>
        <h2 className={css.VisuallyHidden}>Accolades</h2>
        <p>1x FWA Site of the Day</p>
        <p>1x Lovie People&apos;s Choice</p>
        <p>1x Lovie Silver</p>
        <p>2x Awwwards Honorable Mention</p>
      </section>

      <section className={css.SelectedWork}>
        <h2 className={css.VisuallyHidden}>Selected Works</h2>
        <ul className={css.WorkList}>
          {selectedWorks.map((entry) => {
            const fields = entry.fields as unknown as IProfessionalWorkFields;

            return (
              <li key={fields.slug}>
                <a
                  href={fields.linkToWork}
                  target="_blank"
                  aria-label={`link to ${fields.title}`}
                >
                  {fields.image && (
                    <div className={css.MediaContainer}>
                      <Media url={`https:${fields.image.fields.file?.url}`} />
                    </div>
                  )}
                  <h3>{fields.title}</h3>
                  {fields.roles && (
                    <div className={css.RolesPanel}>
                      <h4 className={css.VisuallyHidden}>
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

const Media = ({ url }: { url: string }) => {
  const isVideo = url.includes("mp4") || url.includes("webm");

  if (isVideo) {
    return (
      <video muted playsInline autoPlay loop>
        <source src={url}></source>
      </video>
    );
  }
  return <Image src={url} alt="" width={400} height={200} />;
};
