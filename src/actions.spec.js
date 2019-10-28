import { defaultActionBuilder } from "./actions";

import { requested, received, failed } from "./strings";

jest.mock("./strings");

describe("actions", () => {
  const slug = "slug";
  afterEach(jest.clearAllMocks);
  describe("default mutationNames", () => {
    it.each([
      ["requested", requested],
      ["received", received],
      ["failed", failed]
    ])("passes slug to %sMutation name builder", (name, builder) => {
      const call = jest.fn();
      defaultActionBuilder(slug, call);
      expect(builder).toHaveBeenCalledWith(slug);
    });
  });
  describe("generated action makes commits", () => {
    const commit = jest.fn();
    const requestedMutationName = "requestedMutationName";
    const receivedMutationName = "receivedMutationName";
    const failedMutationName = "failedMutationName";
    const params = {};
    const response = { response: "response" };
    const error = { error: "error" };
    it.each([
      [requestedMutationName, () => {}, [requestedMutationName, params]],
      [
        receivedMutationName,
        () => Promise.resolve(response),
        [receivedMutationName, { response, params }],
        1
      ],
      [
        failedMutationName,
        () => Promise.reject(error),
        [failedMutationName, error],
        1
      ]
    ])("%s", async (mutationName, call, args, index = 0) => {
      await defaultActionBuilder(slug, call, {
        [mutationName]: mutationName
      })({ commit }, params);
      expect(commit.mock.calls[index]).toEqual(args);
    });
  });
  it("calls action with correct parameters", async () => {
    const response = {};
    const call = jest.fn();
    const parameters = {};
    call.mockResolvedValueOnce(response);
    expect(
      await defaultActionBuilder(slug, call)({ commit: () => {} }, parameters)
    ).toBe(response);
    expect(call.mock.calls[0][0]).toBe(parameters);
  });
});
