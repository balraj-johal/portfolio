import { getImagesInfo } from "@/utils/contentful";
import { getContentByType } from "@/content/contentful";

import Preloader from ".";

const PreloaderManager = async () => {
  const professionalEntries = await getContentByType("professionalWork");
  const images = getImagesInfo(professionalEntries);

  return <Preloader images={images} />;
};

export default PreloaderManager;
