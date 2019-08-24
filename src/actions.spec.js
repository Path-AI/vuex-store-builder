import { defaultActionBuilder } from "./actions";

import { requested, received, failed } from "./strings";

jest.mock("./strings");

describe("actions", () => {
  const slug = "slug";
  const call = jest.fn();
  afterEach(jest.clearAllMocks);
  describe("default configuration", () => {
    it.each([
      ["requested", requested],
      ["received", received],
      ["failed", failed]
    ])("passes slug to %sMutation name builder", (name, builder) => {
      defaultActionBuilder(slug, call);
      expect(builder).toHaveBeenCalledWith(slug);
    });
  });
});
