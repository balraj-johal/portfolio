import { WebsitePendingSplashWrapper } from "./styles";

const WebsitePendingSplash = () => {
  return (
    <WebsitePendingSplashWrapper
      pending={process.env.VERCEL_ENV === "production"}
    >
      <h1>WEBSITE PENDING, GIVE ME A MINUTE</h1>
    </WebsitePendingSplashWrapper>
  );
};

export default WebsitePendingSplash;
