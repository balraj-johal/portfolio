import { Container } from "./styles";
import css from "./style.module.scss";

interface Props {
  children: React.ReactNode;
}

const TopLeftIncutSvg = () => (
  <svg
    width="4"
    height="4"
    viewBox="0 0 4 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 0H0V4C0 1.79086 1.79087 0 4 0Z"
      fill="white"
    />
  </svg>
);

const CutCornerTopLeft = ({ children, ...rest }: Props) => {
  return (
    <Container {...rest}>
      {children}
      <div className={css.BevelTopRight}>
        <TopLeftIncutSvg />
      </div>
      <div className={css.BevelBottomLeft}>
        <TopLeftIncutSvg />
      </div>
    </Container>
  );
};

export default CutCornerTopLeft;
