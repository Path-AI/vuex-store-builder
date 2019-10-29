import { requested, received, failed } from "./strings";
import { ActionHandler } from "vuex/types";

export const defaultActionBuilder = <S, T>(
  slug: string,
  call: (params: any) => Promise<T | T[]>,
  {
    requestedMutationName = requested(slug),
    receivedMutationName = received(slug),
    failedMutationName = failed(slug),
    catchBlock = function(error) {
      this.commit(failedMutationName, error);
    }
  } = {}
): ActionHandler<S, T> => async ({ commit }, params) => {
  let response: T | T[];
  commit(requestedMutationName, params);
  try {
    response = await call(params);
  } catch (error) {
    return catchBlock.call({ commit }, error);
  }
  commit(receivedMutationName, { response, params });
  return response;
};

export default {
  defaultActionBuilder
};
