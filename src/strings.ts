export const loaded = (slug: string): string => `loaded_${slug}`;
export const errored = (slug: string): string => `errored_${slug}`;
export const requested = (slug: string): string => `requested_${slug}`;
export const received = (slug: string) => `received_${slug}`;
export const failed = (slug: string) => `failed_${slug}`;

export default {
  loaded,
  errored,
  requested,
  received,
  failed
};
