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

export const strings = _strings;
export const mutations = _mutations;
export const actions = _actions;

export const defaultGetKey = ({ id }) => id;

export const vuexStoreBuilder = (
  slug,
  call,
  {
    getKey = defaultGetKey,
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
    receive = receiveBuilder(slug, getKey),
    fail = failBuilder(slug),
    state = {},
    getters = {},
    mutations = {},
    actions = {}
  } = {}
) => ({
  namespaced: true,
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
