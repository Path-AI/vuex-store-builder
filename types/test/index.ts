import Vuex from "vuex";
import { VuexStoreBuilder } from "../index";

namespace Test {
  type State = {
    byId: {};
  };
  let startId = 0;
  class Datum {
    id: number;
    value: any;
    constructor(value?: any) {
      this.id = startId++;
      this.value = value;
    }
  }
  type R = {};
  const call = () => Promise.resolve(new Datum());
  const storeConfig = VuexStoreBuilder<State, Datum, R>("test", call, {
    getKey: datum => datum.id
  });
  const store = new Vuex.Store(storeConfig);
}
