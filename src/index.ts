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

import { Mutation, ActionHandler } from "vuex/types";

export const strings = _strings;
export const mutations = _mutations;
export const actions = _actions;

export const defaultGetKey = ({ id }) => id;

interface ActionBuilder<S, T> {
  (
    slug: string,
    call: () => Promise<T | T[]>,
    options: {
      requestedMutationName: string;
      receivedMutationName: string;
      failedMutationName: string;
    }
  ): ActionHandler<S, T>;
}

interface vuexStoreBuilderOptions<S, T> {
  getKey: (datum: T) => string | number;
  requestedMutationName?: string;
  receivedMutationName?: string;
  failedMutationName?: string;
  actionBuilder?: ActionBuilder<S, T>;
  action?: ActionHandler<S, T>;
  request?: Mutation<S>;
  receive?: Mutation<S>;
  fail?: Mutation<S>;
  state?: S;
  getters?: object;
  mutations?: object;
  actions?: object;
  modules?: object;
}

export const vuexStoreBuilder = <S, T>(
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
    receive = receiveBuilder<T>(slug, getKey),
    fail = failBuilder(slug),
    state = {},
    getters = {},
    mutations = {},
    actions = {},
    modules = {}
  }: vuexStoreBuilderOptions<S, T>
) => ({
  namespaced: true,
  modules,
  state: {
    byId: {},
    [loaded(slug)]: false,
    [errored(slug)]: undefined,
    ...state
  },
  getters: {
    list: state => Object.values(state.byId),
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
