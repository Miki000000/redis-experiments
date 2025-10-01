import type { BunRequest } from "bun";

type MockType<TPath extends `/${string}`, TBody extends object> = {
  endpoint: TPath;
  body?: TBody;
  params?: Object;
  headers?: Record<string, string>;
};

export function mockBunRequest<TPath extends `/${string}`, TBody extends object>({
  body,
  endpoint,
  headers = {},
  params = {},
}: MockType<TPath, TBody>) {
  return {
    url: `https://mock.mock/${endpoint}`,
    headers: new Headers(headers),
    json: async () => body,
    params,
  } as unknown as BunRequest<TPath>;
}
