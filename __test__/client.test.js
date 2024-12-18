import { addTrip  } from "../src/client/js/app";
describe('addTrip  must be a function', () => {
    it('must be a function', async () => {
        expect(typeof addTrip ).toBe('function');
    })
})