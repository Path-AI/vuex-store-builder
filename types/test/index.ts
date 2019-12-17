import Vuex from "vuex";
import { VuexStoreBuilder } from "../index";
namespace AnimalTest {
  abstract class Animal<B> {
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
  }
  enum CatBreed {
    SNOWSHOE_SIAMESE,
    MAINE_COON,
    RUSSIAN_BLUE
  }
  class Cat extends Animal<CatBreed> {}

  enum DogBreed {
    CORGI,
    BICHON_FRISE,
    BERNESE_MOUNTAIN_DOG,
    LAB,
    GOLDEN_RETRIEVER
  }
  class Dog extends Animal<DogBreed> {}
  type CatState = {
    byId: {};
  };
  const buildCat = (name: string, breed: CatBreed, birthday?: Date) =>
    Promise.resolve(new Cat(name, breed, birthday));
  const catStoreOptions = VuexStoreBuilder<CatState, Cat>("build", buildCat, {
    getKey: cat => cat.id
  });
  const catStore = new Vuex.Store(catStoreOptions);
  catStore.dispatch("build", {
    name: "Oliver",
    breed: CatBreed.SNOWSHOE_SIAMESE,
    birthday: new Date("06/01/2010")
  });
}
