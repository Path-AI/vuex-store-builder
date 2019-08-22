export const loaded = slug => `loaded_${slug}`;
export const errored = slug => `errored_${slug}`;
export const requested = slug => `requested_${slug}`;
export const received = slug => `received_${slug}`;
export const failed = slug => `failed_${slug}`;

export default {
  loaded,
  errored,
  requested,
  received,
  failed
};
