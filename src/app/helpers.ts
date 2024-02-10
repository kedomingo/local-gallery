import { useRouter } from "next/router";

export interface KeyValue {
  [key: string]: string | number | string[] | number[] | undefined;
}

export const createQueryString = (keyValues: KeyValue) => {
  const params = new URLSearchParams();
  populateUrlSearchParams(keyValues, params);

  return params.toString();
};

export const populateUrlSearchParams = (
  searchParams: KeyValue,
  params: URLSearchParams,
) => {
  Object.keys(searchParams).forEach((key) => {
    // @ts-ignore
    const val = searchParams[key];
    if (Array.isArray(val)) {
      let first = true;
      val.forEach((arrayValue) => {
        // Append __ suffix if not yet done - to identify arrays
        const decodedKey = decodeURIComponent(key);
        const useKey = decodedKey.match(/__$/) ? decodedKey : key + "__";
        if (first) {
          params.set(useKey, arrayValue + "");
          first = false;
        } else {
          params.append(useKey, arrayValue + "");
        }
      });
    } else if (!!val) {
      params.set(key, val + "");
    }
  });
  return params;
};

export const ucfirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
