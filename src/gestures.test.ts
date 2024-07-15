import { isValidStoredGestureData } from "./gestures-hooks";

describe("isValidStoredGestureData", () => {
  it("checks data", () => {
    expect(isValidStoredGestureData({})).toEqual(false);
    expect(isValidStoredGestureData({ data: [] })).toEqual(true);
    expect(isValidStoredGestureData({ data: 123 })).toEqual(false);
    expect(isValidStoredGestureData({ data: {} })).toEqual(false);
  });
  it("checks data properties", () => {
    expect(isValidStoredGestureData({ data: [{ invalid: 3 }] })).toEqual(false);
    expect(isValidStoredGestureData({ data: [{ name: 3 }] })).toEqual(false);
    expect(
      isValidStoredGestureData({
        data: [{ ID: 0, name: "some name", recordings: [] }],
      })
    ).toEqual(true);
  });
  it("checks data recordings", () => {
    const generateData = (recordings: unknown) => ({
      data: [{ ID: 0, name: "some name", recordings }],
    });
    expect(isValidStoredGestureData(generateData({}))).toEqual(false);
    expect(isValidStoredGestureData(generateData([]))).toEqual(true);
    expect(
      isValidStoredGestureData(generateData([{ ID: 0, data: [] }]))
    ).toEqual(false);
    expect(
      isValidStoredGestureData(generateData([{ ID: 0, data: {} }]))
    ).toEqual(false);
    expect(
      isValidStoredGestureData(
        generateData([{ ID: 0, data: { x: 0, y: 0, z: 0 } }])
      )
    ).toEqual(false);
    expect(
      isValidStoredGestureData(
        generateData([{ ID: 0, data: { x: [], y: [], z: [] } }])
      )
    ).toEqual(true);
  });
});
