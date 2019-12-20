import _strings, {
  loaded,
  errored,
  requested,
  received,
  failed
} from "./strings";
import _mutations, {
  requestBuilder,
  receiveBuilder,
  failBuilder
} from "./mutations";
import _actions, { defaultActionBuilder } from "./actions";

import { VuexStoreBuilder } from "../types";
import { StoreOptions, Dictionary } from "vuex";

export const strings = _strings;
export const mutations = _mutations;
export const actions = _actions;

export const vuexStoreBuilder: VuexStoreBuilder<S, T> = function<S, T>( // this doesn't work :(
  slug,
  call,
  {
    getKey,
    requestedMutationName = requested(slug),
    receivedMutationName = received(slug),
    failedMutationName = failed(slug),
    actionBuilder = defaultActionBuilder,
    action = actionBuilder(slug, call, {
      requestedMutationName,
      receivedMutationName,
      failedMutationName
    }),
    request = requestBuilder(slug),
    receive = receiveBuilder<S, T>(slug, getKey),
    fail = failBuilder(slug),
    state = {},
    getters = {},
    mutations = {},
    actions = {},
    modules = {}
  }
): StoreOptions<S> {
  return {
    modules,
    state: {
      byId: {},
      [loaded(slug)]: false,
      [errored(slug)]: undefined,
      ...state
    },
    getters: {
      list: state => Object.keys(state.byId).map(key => state.byId[key]),
      ...getters
    },
    mutations: {
      [requestedMutationName]: request,
      [receivedMutationName]: receive,
      [failedMutationName]: fail,
      ...mutations
    },
    actions: {
      [slug]: action,
      ...actions
    }
  };
};
