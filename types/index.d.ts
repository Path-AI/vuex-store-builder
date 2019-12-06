import {
  ActionHandler,
  ActionTree,
  Dictionary,
  GetterTree,
  Module,
  ModuleTree,
  MutationMethod,
  MutationTree
} from "vuex/types";

export interface ActionBuilderOptions {
  requestedMutationName?: string;
  receivedMutationName?: string;
  failedMutationName?: string;
  catchBlock?: (error: any) => void;
}

export type ActionBuilder<S, R, T> = (
  slug: string,
  call: () => Promise<T | T[]>,
  options: ActionBuilderOptions
) => ActionHandler<S, R>;

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

export declare function VuexStoreBuilder<
  S extends { byId: Dictionary<T> },
  T,
  R
>(
  slug: string,
  call: (args: any) => Promise<T | T[]>,
  options: VuexStoreBuilderOptions<S, T, R>
): Module<S, R>;

declare const _default: {
  VuexStoreBuilder: typeof VuexStoreBuilder;
};

export default _default;
