import Prismic from "@prismicio/client";

export const getPrismicClient = (req?: unknown) => {
  return Prismic.client(process.env.PRISMIC_ENDPOINT, {
    req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
};
