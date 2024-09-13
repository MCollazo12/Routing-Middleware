const request = require('supertest');
const express = require('express');
const router = require('./itemRoutes');
const ITEMS = require('./fakeDb');

const app = express();
app.use(express.json());
app.use('/', router);

beforeEach(() => {
  // Reset ITEMS before each test
  ITEMS.length = 0;
  ITEMS.push({ name: 'popsicle', price: 1.45 });
  ITEMS.push({ name: 'cheerios', price: 3.4 });
});

describe('GET /', () => {
  test('It should respond with an array of items', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(ITEMS);
  });
});

describe('POST /', () => {
  test('It should add a new item', async () => {
    const newItem = { name: 'chocolate', price: 2.5 };
    const response = await request(app).post('/').send(newItem);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Added item successfully!' });
    expect(ITEMS).toContainEqual(newItem);
  });

  test('It should return 400 if name is missing', async () => {
    const response = await request(app).post('/').send({ price: 2.5 });
    expect(response.statusCode).toBe(400);
  });

  test('It should return 400 if price is invalid', async () => {
    const response = await request(app)
      .post('/')
      .send({ name: 'chocolate', price: 'invalid' });
    expect(response.statusCode).toBe(400);
  });
});

describe('GET /:name', () => {
  test('It should return a single item', async () => {
    const response = await request(app).get('/popsicle');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ name: 'popsicle', price: 1.45 });
  });

  test('It should return 404 for non-existent item', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.statusCode).toBe(404);
  });
});

describe('PATCH /:name', () => {
  test('It should update an existing item', async () => {
    const response = await request(app)
      .patch('/popsicle')
      .send({ name: 'new popsicle', price: 2.45 });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      updated: { name: 'new popsicle', price: 2.45 },
    });
  });

  test('It should return 404 for non-existent item', async () => {
    const response = await request(app)
      .patch('/nonexistent')
      .send({ name: 'new name', price: 1.0 });
    expect(response.statusCode).toBe(404);
  });
});

describe('DELETE /:name', () => {
  test('It should delete an item', async () => {
    const response = await request(app).delete('/popsicle');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Deleted' });
    expect(ITEMS).not.toContainEqual({ name: 'popsicle', price: 1.45 });
  });

  test('It should return 404 for non-existent item', async () => {
    const response = await request(app).delete('/nonexistent');
    expect(response.statusCode).toBe(404);
  });
});
