import style from "./style.module.scss";

// TODO: Convert this svg to symbols

const MediaPlaceholder = () => {
  return (
    <div className={style.MediaPlaceholder}>
      <div className={style.MediaPlaceholderBackground}>
        <svg
          preserveAspectRatio="none"
          fill="none"
          viewBox="0 0 810 468"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="0.274098"
            y1="-0.418175"
            x2="357.274"
            y2="233.582"
            stroke="black"
          />
          <line
            y1="-0.5"
            x2="426.855"
            y2="-0.5"
            transform="matrix(-0.83635 0.548196 0.548196 0.83635 810 0)"
            stroke="black"
          />
          <line
            y1="-0.5"
            x2="426.855"
            y2="-0.5"
            transform="matrix(0.83635 -0.548196 -0.548196 -0.83635 0 468)"
            stroke="black"
          />
          <line
            x1="809.726"
            y1="468.418"
            x2="452.726"
            y2="234.418"
            stroke="black"
          />
        </svg>
      </div>
      <p>
        Loading
        <span>
          {"...".split("").map((char, i) => (
            <span key={i} className={style.LoadingEllipsis}>
              {char}
            </span>
          ))}
        </span>
      </p>
    </div>
  );
};

export default MediaPlaceholder;
