import {
  Action,
  ActionHandler,
  ActionTree,
  Dictionary,
  GetterTree,
  Module,
  ModuleTree,
  MutationMethod,
  MutationTree,
  Store,
  StoreOptions
} from "vuex/types";

export interface ActionBuilderOptions {
  requestedMutationName?: string;
  receivedMutationName?: string;
  failedMutationName?: string;
  catchBlock?: (error: any) => void;
}

export type ActionBuilder<S, T> = (
  slug: string,
  call: (payload?: any) => Promise<T>,
  options: ActionBuilderOptions
) => Action<S, any>;

export interface VuexStoreBuilderOptions<S, T> {
  getKey: (datum: T) => string | number;
  requestedMutationName?: string;
  receivedMutationName?: string;
  failedMutationName?: string;
  actionBuilder?: ActionBuilder<S, T>;
  action?: ActionHandler<S, any>;
  request?: MutationMethod;
  receive?: MutationMethod;
  fail?: MutationMethod;
  state?: S;
  getters?: GetterTree<S, any>;
  mutations?: MutationTree<S>;
  actions?: ActionTree<S, any>;
  modules?: ModuleTree<S>;
}

export declare function VuexStoreBuilder<S extends { byId: Dictionary<T> }, T>(
  slug: string,
  call: (...args: any[]) => Promise<T>,
  options: VuexStoreBuilderOptions<S, T>
): StoreOptions<S>;

declare const _default: {
  VuexStoreBuilder: typeof VuexStoreBuilder;
};

export default _default;
