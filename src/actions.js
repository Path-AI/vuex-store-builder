import { requested, received, failed } from "./strings";

export const defaultActionBuilder = (
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

export default {
  defaultActionBuilder
};
