import { loaded, errored, requested, received, failed } from "./strings";
import { requestBuilder, receiveBuilder, failBuilder } from "./mutations";
import { defaultActionBuilder } from "./actions";

export const vuexStoreBuilder = (
  slug,
  call,
  {
    getKey = ({ id }) => id,
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
