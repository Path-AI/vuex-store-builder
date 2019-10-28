import { loaded, errored } from "./strings";

export const requestBuilder = slug =>
  function(state, params) {
    state[loaded(slug)] = false;
    state[errored(slug)] = {};
  };

export const receiveBuilder = (slug, getKey) =>
  function(state, { response, params } = {}) {
    if (Array.isArray(response)) {
      response.forEach(datum => (state.byId[getKey(datum)] = datum));
    } else {
      state.byId[getKey(response)] = response;
    }
    state[loaded(slug)] = true;
  };

export const failBuilder = slug =>
  function(state, error) {
    state[errored(slug)] = error;
  };

export default {
  requestBuilder,
  receiveBuilder,
  failBuilder
};
