import supertest from 'supertest';
import server from '../src/server/index'; // Import your server (app instance)

describe('Test: Server PORT should be 3000', () => {
  it('should be running on port 3000', async () => {
    // Send a GET request to the root endpoint
    const response = await supertest(server).get('/'); 
    
    // Check if the server is responding with status 200
    expect(response.status).toBe(200);
    expect(response.text).toContain('Server is running');
  });
});
