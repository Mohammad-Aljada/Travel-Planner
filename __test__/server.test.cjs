const request = require('supertest');
const app = require('../src/server/index.cjs'); // Import app
let server;

beforeAll(() => {
  const port = 0; // Dynamically assign an available port
  server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${server.address().port}`);
  });
});

afterAll(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        resolve();
      });
    });
    console.log('Server closed.');
  }
});

const newTrip = { location: 'Paris', date: '2025-08-15' };

describe('Trip API Endpoints', () => {
  it('should add a new trip', async () => {
    const response = await request(app)
      .post('/addtrip')
      .send(newTrip);

    expect(response.statusCode).toBe(200);
    // Check that the response body contains the success message
    expect(response.body).toEqual(
      expect.objectContaining({
        city: newTrip.location,
        message: expect.stringContaining('Trip added successfully'), // Assuming 'message' is returned
      })
    );
  });

  it('should delete a trip', async () => {
    const deleteResponse = await request(app)
      .delete('/removetrip')
      .send({ location: 'Paris' });

    expect(deleteResponse.statusCode).toBe(200);
    // Check that the response body contains the success message
    expect(deleteResponse.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining('Trip deleted successfully'), // Assuming 'message' is returned
      })
    );
  });


});
