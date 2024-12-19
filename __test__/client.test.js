import { addTrip } from "../src/client/js/app";

jest.mock("../src/client/js/app", () => ({
    addTrip: jest.fn(),
}));

test('addTrip must be a function', () => {
    expect(jest.isMockFunction(addTrip)).toBe(true);
});
