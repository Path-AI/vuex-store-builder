import _strings, {
  requested,
  received,
  failed,
  loaded,
  errored
} from "./strings";
import _mutations, {
  requestBuilder,
  receiveBuilder,
  failBuilder
} from "./mutations";
import _actions, { defaultActionBuilder } from "./actions";

import vuexStoreBuilder, {
  defaultGetKey,
  strings,
  mutations,
  actions
} from "./index";

jest.mock("./strings");
jest.mock("./mutations");
jest.mock("./actions");

describe("index", () => {
  describe("aliased exports", () => {
    it.each([
      ["strings", strings, _strings],
      ["mutations", mutations, _mutations],
      ["actions", actions, _actions]
    ])("correctly aliases %s", (name, a, b) => {
      expect(a).toBe(b);
    });
  });
  describe("vuexStoreBuilder", () => {
    const slug = "slug";
    const call = jest.fn();
    afterEach(jest.clearAllMocks);
    describe("default configuration", () => {
      describe("mutation", () => {
        describe("name builders", () => {
          it.each([
            ["requested", requested],
            ["received", received],
            ["failed", failed]
          ])("%s receives slug", (name, builder) => {
            vuexStoreBuilder(slug, call);
            expect(builder.mock.calls[0][0]).toBe(slug);
          });
        });
        describe("function builders", () => {
          it.each([
            ["requestBuilder", requestBuilder, [slug]],
            ["receiveBuilder", receiveBuilder, [slug, defaultGetKey]],
            ["failBuilder", failBuilder, [slug]]
          ])("%s receives %s as arguments", (name, builder, args) => {
            vuexStoreBuilder(slug, call);
            expect(builder.mock.calls[0]).toEqual(args);
          });
        });
      });
      it("actionBuilder is called with default arguments", () => {
        const requestedMutationName = "requestedMutationName";
        const receivedMutationName = "receivedMutationName";
        const failedMutationName = "failedMutationName";
        requested.mockImplementationOnce(() => requestedMutationName);
        received.mockImplementationOnce(() => receivedMutationName);
        failed.mockImplementationOnce(() => failedMutationName);
        vuexStoreBuilder(slug, call);
        expect(defaultActionBuilder.mock.calls[0]).toEqual([
          slug,
          call,
          {
            requestedMutationName,
            receivedMutationName,
            failedMutationName
          }
        ]);
      });
      describe("generated store has expected shape", () => {
        let store;
        beforeEach(() => {
          store = vuexStoreBuilder(slug, call);
        });
        it("is namespaced", () => {
          expect(store.namespaced).toBe(true);
        });
        describe("state", () => {
          loaded.mockImplementation(jest.requireActual("./strings").loaded);
          errored.mockImplementation(jest.requireActual("./strings").errored);
          it.each([
            ["byId", {}],
            [loaded(slug), false],
            [errored(slug), undefined]
          ])("%s has expected initial value, %o", (attribute, initial) => {
            expect(store.state[attribute]).toEqual(initial);
          });
        });
        describe("getters", () => {
          it("lists the values in byId", () => {
            const one = {};
            const two = {};
            const byId = {
              one,
              two
            };
            const state = {
              byId
            };
            expect(store.getters.list(state)).toStrictEqual([one, two]);
          });
        });
      });
    });
    describe("overrides", () => {
      describe("mutations", () => {
        it("spreads additional provided mutations", () => {
          const extraMutation = jest.fn();
          expect(
            vuexStoreBuilder(slug, call, {
              mutations: {
                extraMutation
              }
            }).mutations.extraMutation
          ).toBe(extraMutation);
        });
        it.each([
          ["request", "requestedMutationName"],
          ["receive", "receivedMutationName"],
          ["fail", "failedMutationName"]
        ])(
          "defines provided %s mutation with provided mutation name, %s",
          (name, mutationName) => {
            const built = jest.fn();
            expect(
              vuexStoreBuilder(slug, call, {
                [name]: built,
                [mutationName]: mutationName
              }).mutations[mutationName]
            ).toBe(built);
          }
        );
      });
      describe("actions", () => {
        it("spreads additional provided actions", () => {
          const action2 = jest.fn();
          expect(
            vuexStoreBuilder(slug, call, {
              actions: {
                action2
              }
            }).actions.action2
          ).toBe(action2);
        });
        it("defines provided action with key slug", () => {
          const action = jest.fn();
          expect(vuexStoreBuilder(slug, call, { action }).actions[slug]).toBe(
            action
          );
        });
      });
    });
  });
});
