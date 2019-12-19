import { loaded, errored } from "./strings";
import { Mutation } from "vuex/types";

export const requestBuilder = <S>(slug: string): Mutation<S> =>
  function(state: S, params) {
    state[loaded(slug)] = false;
    state[errored(slug)] = {};
  };

export const receiveBuilder = <S extends { byId?: object }, T>(
  slug: string,
  getKey: (datum: T) => string | number
): Mutation<S> =>
  function(state: S, { response, params }: { response: T | T[]; params }) {
    if (Array.isArray(response)) {
      response.forEach(datum => (state.byId[getKey(datum)] = datum));
    } else {
      state.byId[getKey(response)] = response;
    }
    state[loaded(slug)] = true;
  };

export const failBuilder = <S>(slug: string): Mutation<S> =>
  function(state: S, error: any) {
    state[errored(slug)] = error;
  };

export default {
  requestBuilder,
  receiveBuilder,
  failBuilder
};
