import Vuex from "vuex";
import { vuexStoreBuilder } from "../../src";
namespace AnimalTest {
  class Animal<B> {
    private static counter = 0;
    id: number;
    name: string;
    birthday: Date;
    breed: B;
    constructor(name: string, breed: B, birthday = new Date(Date.now())) {
      this.name = name;
      this.birthday = birthday;
      this.breed = breed;
      this.id = Animal.counter++;
    }

    static getId(animal: Animal<any>) {
      return animal.id;
    }
  }
  enum CatBreed {
    SNOWSHOE_SIAMESE,
    MAINE_COON,
    RUSSIAN_BLUE
  }
  class Cat extends Animal<CatBreed> {}

  type CatState = {
    byId: {};
  };

  const buildCat = (name: string, breed: CatBreed, birthday?: Date) =>
    Promise.resolve(new Cat(name, breed, birthday));
  const catStoreOptions = vuexStoreBuilder<CatState, Cat>("build", buildCat, {
    getKey: Animal.getId
  });
  const catStore = new Vuex.Store(catStoreOptions);
  catStore.dispatch("build", {
    name: "Oliver",
    breed: CatBreed.SNOWSHOE_SIAMESE,
    birthday: new Date("06/01/2010")
  });
  catStore.dispatch("build", {
    name: "Max",
    breed: CatBreed.MAINE_COON,
    birthday: new Date("02/25/2010")
  });
}
