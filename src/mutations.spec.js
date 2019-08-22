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
  describe.skip("receiveBuilder", () => {
    const getKey = jest.fn(({ id }) => id);
  });
  describe.skip("failBuilder", () => {});
});
