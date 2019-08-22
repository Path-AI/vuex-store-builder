import { requested, received, failed } from "./strings";
import { requestBuilder, receiveBuilder, failBuilder } from "./mutations";
import { defaultActionBuilder } from "./actions";

import vuexStoreBuilder from "./index";

jest.mock("./strings");
jest.mock("./mutations");
jest.mock("./actions");

describe("vuexStoreBuilder", () => {
  afterEach(jest.clearAllMocks);
  describe("default configuration", () => {
    const slug = "slug";
    const call = jest.fn();
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
        const getKey = {};
        it.each([
          ["requestBuilder", slug, requestBuilder],
          ["receiveBuilder", slug, receiveBuilder],
          ["failBuilder", slug, failBuilder]
        ])("%s receives %s as arguments", (name, arg, builder) => {
          vuexStoreBuilder(slug, call);
          expect(builder.mock.calls[0][0]).toEqual(arg);
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
  });
});
