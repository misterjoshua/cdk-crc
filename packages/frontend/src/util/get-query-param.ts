import { ParsedUrlQuery } from 'node:querystring';

export function getQueryParam(
  query: ParsedUrlQuery,
  name: string,
): string | undefined {
  return Array.isArray(query[name])
    ? query[name][0]
    : (query[name] as string | undefined);
}

export function getQueryParamOrDefault(
  query: ParsedUrlQuery,
  name: string,
  defaultValue: string,
): string {
  return getQueryParam(query, name) ?? defaultValue;
}
