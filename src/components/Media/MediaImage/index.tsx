import Image from "next/image";

interface Props {
  src: string;
  isFirst?: boolean;
}

const MediaImage = ({ src, isFirst }: Props) => {
  return <Image src={src} alt="" fill priority={isFirst} />;
};

export default MediaImage;
