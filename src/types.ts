import {
  MutationTree,
  ActionHandler,
  GetterTree,
  ActionTree,
  ModuleTree,
  MutationMethod
} from "vuex/types";

export interface ActionBuilderOptions {
  requestedMutationName?: string;
  receivedMutationName?: string;
  failedMutationName?: string;
  catchBlock?: (error: any) => void;
}

export interface ActionBuilder<S, R, T> {
  (
    slug: string,
    call: () => Promise<T | T[]>,
    options: ActionBuilderOptions
  ): ActionHandler<S, R>;
}

export interface VuexStoreBuilderOptions<S, T, R> {
  getKey: (datum: T) => string | number;
  requestedMutationName?: string;
  receivedMutationName?: string;
  failedMutationName?: string;
  actionBuilder?: ActionBuilder<S, R, T>;
  action?: ActionHandler<S, R>;
  request?: MutationMethod;
  receive?: MutationMethod;
  fail?: MutationMethod;
  state?: S;
  getters?: GetterTree<S, R>;
  mutations?: MutationTree<S>;
  actions?: ActionTree<S, R>;
  modules?: ModuleTree<R>;
}
