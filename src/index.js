import { loaded, errored, requested, received, failed } from "./stringBuilders";

export const defaultActionHydrator = (
  slug,
  call,
  {
    requestedMutationName = requested(slug),
    receivedMutationName = received(slug),
    failedMutationName = failed(slug),
    catchBlock = function(error) {
      this.commit(failedMutationName, error);
    }
  } = {}
) => async ({ commit }, params) => {
  let response;
  commit(requestedMutationName);
  try {
    response = await call(params);
  } catch (error) {
    return catchBlock.call({ commit }, error);
  }
  commit(receivedMutationName, response);
  return response;
};

export const requestBuilder = slug =>
  function(state) {
    state[loaded(slug)] = false;
    state[errored(slug)] = {};
  };

export const receiveBuilder = (slug, getKey) =>
  function(state, data) {
    if (Array.isArray(data)) {
      data.forEach(datum => (state.byId[getKey(datum)] = datum));
    } else {
      state.byId[getKey(data)] = data;
    }
    state[loaded(slug)] = true;
  };

export const failBuilder = slug =>
  function(state, error) {
    state[errored(slug)] = error;
  };

export const vuexStoreBuilder = (
  slug,
  call,
  {
    getKey = ({ id }) => id,
    requestedMutationName = requested(slug),
    receivedMutationName = received(slug),
    failedMutationName = failed(slug),
    actionHydrator = defaultActionHydrator,
    action = actionHydrator(slug, call, {
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
