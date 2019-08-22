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

export const request = slug =>
  function(state) {
    state[loaded(slug)] = false;
    state[errored(slug)] = {};
  };

export const receive = (slug, getKey) =>
  function(state, data) {
    if (Array.isArray(data)) {
      data.forEach(datum => (state.byId[getKey(datum)] = datum));
    } else {
      state.byId[getKey(data)] = data;
    }
    state[loaded(slug)] = true;
  };

export const fail = slug =>
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
    requestMutation = request(slug),
    receiveMutation = receive(slug, getKey),
    failMutation = fail(slug),
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
    [requestedMutationName]: requestMutation,
    [receivedMutationName]: receiveMutation,
    [failedMutationName]: failMutation,
    ...mutations
  },
  actions: {
    [slug]: action,
    ...actions
  }
});

export default vuexStoreBuilder;
