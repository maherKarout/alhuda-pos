export function setSearchParams<T extends object>(url: URL, props: T, removeKeys?: string[]) {
  (Object.keys(props) as (keyof T)[]).forEach((key) => {
    props[key] !== "" && props[key] !== undefined && props[key] !== "undefined"
      ? url.searchParams.set(key as string, `${props[key]}`)
      : url.searchParams.delete(key as string);
  });
  if (removeKeys) {
    removeKeys.forEach((key) => {
      url.searchParams.delete(key);
    });
  }
  return url;
}
