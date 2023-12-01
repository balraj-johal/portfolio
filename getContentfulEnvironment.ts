import { strict as assert } from "assert";

import dotenv from "dotenv";
import { EnvironmentGetter } from "contentful-typescript-codegen";
import { createClient } from "contentful-management";

dotenv.config({ path: ".env" });

const {
  CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT,
} = process.env;

assert(CONTENTFUL_MANAGEMENT_ACCESS_TOKEN);
assert(CONTENTFUL_SPACE_ID);
assert(CONTENTFUL_ENVIRONMENT);

const getContentfulEnvironment: EnvironmentGetter = () => {
  const contentfulClient = createClient({
    accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  });

  return contentfulClient
    .getSpace(CONTENTFUL_SPACE_ID)
    .then((space) => space.getEnvironment(CONTENTFUL_ENVIRONMENT));
};

module.exports = getContentfulEnvironment;
