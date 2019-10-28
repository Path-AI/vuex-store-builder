import { loaded, errored } from "./strings";
import { requestBuilder, receiveBuilder, failBuilder } from "./mutations";

jest.mock("./strings");

describe("mutation builders", () => {
  const slug = "slug";
  describe("requestBuilder", () => {
    it.each([
      ["loaded on state", loaded, false],
      ["errored on state", errored, {}]
    ])("requestBuilder puts %s", (mockedValue, attributeBuilder, initial) => {
      attributeBuilder.mockImplementationOnce(() => mockedValue);
      const state = {};
      requestBuilder(slug)(state);
      expect(state[mockedValue]).toEqual(initial);
    });
  });
  describe("receiveBuilder", () => {
    const getKey = jest.fn(({ id } = {}) => id);
    it("handles data arrays", () => {
      const datum1 = { id: 123 };
      const datum2 = { id: 234 };
      const state = {
        byId: {}
      };
      receiveBuilder(slug, getKey)(state, { response: [datum1, datum2] });
      expect(state.byId).toEqual({
        123: datum1,
        234: datum2
      });
    });
    it("handles data singletons", () => {
      const datum = { id: 123 };
      const state = {
        byId: {}
      };
      receiveBuilder(slug, getKey)(state, { response: datum });
      expect(state.byId).toEqual({
        123: datum
      });
    });
    it("flips loaded boolean", () => {
      loaded.mockImplementationOnce(() => "loaded");
      const state = {
        byId: {}
      };
      receiveBuilder(slug, getKey)(state, {});
      expect(state.loaded).toBe(true);
    });
  });
  describe("failBuilder", () => {
    it("passes error into state", () => {
      errored.mockImplementationOnce(() => "errored");
      const state = {};
      const error = {};
      failBuilder(slug)(state, error);
      expect(state.errored).toBe(error);
    });
  });
});
