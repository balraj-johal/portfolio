import { strict as assert } from "assert";

import dotenv from "dotenv";
import contentful from "contentful-management";

dotenv.config({ path: ".env" });

const {
  CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT,
} = process.env;

assert(CONTENTFUL_MANAGEMENT_ACCESS_TOKEN);
assert(CONTENTFUL_SPACE_ID);
assert(CONTENTFUL_ENVIRONMENT);

const getContentfulEnvironment = async () => {
  const contentfulClient = contentful.createClient({
    accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  });

  return contentfulClient
    .getSpace(CONTENTFUL_SPACE_ID)
    .then((space) => space.getEnvironment(CONTENTFUL_ENVIRONMENT));
};

export default getContentfulEnvironment;
