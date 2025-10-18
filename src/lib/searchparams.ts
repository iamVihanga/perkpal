import {
  createSearchParamsCache,
  createSerializer,
  createLoader,
  parseAsInteger,
  parseAsString
} from "nuqs/server";

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  q: parseAsString,
  sort: parseAsString,
  update: parseAsString,
  category: parseAsString,
  perk: parseAsString,

  // Perks-specific search params
  search: parseAsString,
  categoryId: parseAsString,
  subcategoryId: parseAsString,
  location: parseAsString,
  status: parseAsString,
  redemptionMethod: parseAsString
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);

export const loadSearchParams = createLoader(searchParams);
