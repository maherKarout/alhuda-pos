export function getSearchParamsAsObject(
  searchParams: URLSearchParams,
  skippedQueries?: string[]
): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};

  searchParams.forEach((value, key) => {
    if (skippedQueries?.includes(key)) return;
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  });

  return params;
}
