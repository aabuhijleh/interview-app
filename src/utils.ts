import { Contributor, SortOrder } from "./types";

export const sortContributorsFunc = (
  field: keyof Contributor,
  order: SortOrder,
  a: Contributor,
  b: Contributor
) => {
  if (order === "asc") {
    if (a[field] < b[field]) {
      return -1;
    }
    if (a[field] > b[field]) {
      return 1;
    }
  }

  if (order === "des") {
    if (a[field] > b[field]) {
      return -1;
    }
    if (a[field] < b[field]) {
      return 1;
    }
  }

  return 0;
};

export const toggleSortOrder = (current: SortOrder) =>
  current === "asc" ? "des" : "asc";
