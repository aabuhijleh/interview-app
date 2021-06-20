export type SortBy = "none" | "login" | "contributions";
export type SortOrder = "none" | "asc" | "des";

export interface Contributor {
  id: number;
  avatar_url: string;
  login: string;
  contributions: number;
}
