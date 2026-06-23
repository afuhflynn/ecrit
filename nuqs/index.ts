import { parseAsString, parseAsInteger } from "nuqs";

export const SearchParamsSchema = {
  redirect: parseAsString,
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(50),
  search: parseAsString.withDefault(""),
  activeModal: parseAsString.withDefault(""),
};
