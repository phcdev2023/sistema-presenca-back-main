import supertest from 'supertest';
import mongoose from 'mongoose';
import App from '../app';
import { User } from '../models/User';

const appInstance = new App();
const request = supertest(appInstance.app);

beforeAll(async () => {
  // Connect to the database before running tests
  await appInstance.connect();
});

afterAll(async () => {
  // Disconnect from the database after all tests are done
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear the users collection before each test
  await User.deleteMany({});
});

describe('User Routes', () => {
  it('should register a new user successfully', async () => {
    const res = await request
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        course: 'Computer Science',
        registration: '123456',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should login an existing user and return a token', async () => {
    // First, register a user
    await request
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        course: 'Computer Science',
        registration: '123456',
      });

    // Then, try to login
    const res = await request
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
