import type { FetchError } from "ofetch";

export function GetFetchErrorMessage(error: FetchError) {
  return error.data?.statusMessage || error.statusMessage || "An unknown error occurred.";
}
