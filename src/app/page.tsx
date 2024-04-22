import Image from "next/image";
import { AssetFile, AssetDetails } from "contentful";

import { extendedStyle } from "@/utils/css";
import { SearchParams } from "@/types/routing";
import {
  IProfessionalWork,
  IProfessionalWorkFields,
  ISelectedWorks,
  ISelectedWorksFields,
} from "@/types/generated/contentful";
import cssUtils from "@/theme/utils.module.scss";
import { getContentByType } from "@/content/contentful";
import SelectionColorSwitcher from "@/components/SelectionColorSwitcher";
import FaviconSwitcher from "@/components/FaviconSwitcher";

import css from "./page.module.scss";

// TODO: fix bad type assertions in this file

export default async function Main({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const selectedWorkEntries = (
    await getContentByType("selectedWorks")
  )[0] as ISelectedWorks;
  const selectedWorks = (selectedWorkEntries.fields as ISelectedWorksFields)
    .selections;

  return (
    <div className={css.PageContainer}>
      <SelectionColorSwitcher />
      <FaviconSwitcher />
      <header className={css.Header}>
        <h1 className={css.HeadingMain}>Balraj Johal</h1>
        <p className={css.Subheading}>{"[WIP] Portfolio"}</p>
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
        <p>3x Awwwards Honorable Mention</p>
      </section>

      <section className={css.SelectedWork}>
        <h2 className={cssUtils.ScreenReaderOnly}>Selected Works</h2>
        <ul className={css.WorkList}>
          {selectedWorks.map((entry, i) => (
            <SelectedWorkItem
              entry={entry}
              showAll={!!searchParams.all}
              first={i === 0}
              key={i}
            />
          ))}
        </ul>
      </section>
    </div>
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
  const getListItemStyle = (index: number) => {
    return extendedStyle({
      "--index": `${index}`,
    });
  };

  if (fields.isPublic || showAll) {
    return (
      <li>
        <a
          href={fields.linkToWork}
          aria-label={`link to ${fields.title}`}
          target="_blank"
        >
          {fields.image && (
            <div className={css.MediaContainer}>
              <Media
                url={`https:${fields.image.fields.file?.url}`}
                details={fields.image.fields.file?.details}
                first={first}
              />
            </div>
          )}
          <h3>{fields.title}</h3>
          {fields.roles && (
            <div className={css.RolesPanel}>
              <h4 className={cssUtils.ScreenReaderOnly}>
                Roles on this project
              </h4>
              <ul>
                {fields.roles.map((role, i) => (
                  <li key={role} style={getListItemStyle(i)}>
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </a>
      </li>
    );
  }
};

const SUPPORTED_FILE_TYPES = ["mp4", "webm"];

const Media = ({
  url,
  first,
  details,
}: {
  url: string;
  first?: boolean;
  details?: AssetFile | AssetDetails;
}) => {
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

  const imageDetails = (details as AssetDetails)?.image;
  if (imageDetails) {
    return (
      <Image
        src={url}
        width={imageDetails.width}
        height={imageDetails.height}
        priority={first}
        alt=""
      />
    );
  } else {
    return <Image src={url} alt="" fill priority={first} />;
  }
};
