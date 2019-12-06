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

import { VuexStoreBuilderOptions } from "../types";

import { Module, Dictionary } from "vuex/types";

export const strings = _strings;
export const mutations = _mutations;
export const actions = _actions;

export const defaultGetKey = ({ id }) => id;

export const vuexStoreBuilder = <S extends { byId: Dictionary<T> }, T, R>(
  slug: string,
  call: () => Promise<T | T[]>,
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
    state = <S>{},
    getters = {},
    mutations = {},
    actions = {},
    modules = {}
  }: VuexStoreBuilderOptions<S, T, R>
): Module<S, R> => ({
  namespaced: true,
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
});

export default vuexStoreBuilder;
