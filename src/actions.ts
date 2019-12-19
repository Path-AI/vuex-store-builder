import { requested, received, failed } from "./strings";
import { ActionHandler } from "vuex/types";
import { ActionBuilderOptions } from "../types";

export const defaultActionBuilder = <S, T>(
  slug: string,
  call: (payload?: any) => Promise<T>,
  {
    requestedMutationName = requested(slug),
    receivedMutationName = received(slug),
    failedMutationName = failed(slug),
    catchBlock = function(error) {
      this.commit(failedMutationName, error);
    }
  }: ActionBuilderOptions = {}
): ActionHandler<S, any> => async ({ commit }, payload) => {
  let response: T;
  commit(requestedMutationName, payload);
  try {
    response = await call(payload);
  } catch (error) {
    return catchBlock.call({ commit }, error);
  }
  commit(receivedMutationName, { response, payload });
  return response;
};

export default {
  defaultActionBuilder
};
