import supertest from 'supertest';
import app from '../src/server/index'; // Import the app instance

describe('Test: Server should be running', () => {
  let server;

  beforeAll(() => {
    server = app.listen(3000); // Start the server for testing
  });

  afterAll((done) => {
    server.close(done); // Ensure the server is properly closed
  });

  it('should respond to GET / with status 200 and correct message', async () => {
    const response = await supertest(server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Server is running');
  });
});
