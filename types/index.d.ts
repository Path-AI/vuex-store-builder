import {
  Action,
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

export type ActionBuilderOptions = {
  requestedMutationName?: string;
  receivedMutationName?: string;
  failedMutationName?: string;
  catchBlock?: (error: any) => void;
};

export type ActionBuilder<S, T> = (
  slug: string,
  call: (payload?: any) => Promise<T>,
  options: ActionBuilderOptions
) => Action<S, any>;

export type VuexStoreBuilderOptions<S, T> = {
  getKey: (datum: T) => string | number;
  requestedMutationName?: string;
  receivedMutationName?: string;
  failedMutationName?: string;
  actionBuilder?: ActionBuilder<S, T>;
  action?: Action<S, any>;
  request?: MutationMethod;
  receive?: MutationMethod;
  fail?: MutationMethod;
  state?: S;
  getters?: GetterTree<S, any>;
  mutations?: MutationTree<S>;
  actions?: ActionTree<S, any>;
  modules?: ModuleTree<S>;
  namespaced?: boolean;
};

export type VuexStoreBuilder<S extends { byId: Dictionary<T> }, T> = (
  slug: string,
  call: (...args: any[]) => Promise<T>,
  options: VuexStoreBuilderOptions<S, T>
) => StoreOptions<S>;
