import { BlurLoadedVideoWrapper } from "./styles";

interface Props {
  src: string;
}

const BlurLoadedVideo = ({ children, ...rest }: Props) => {
  return <BlurLoadedVideoWrapper {...rest}>{children}</BlurLoadedVideoWrapper>;
};

export default BlurLoadedVideo;
