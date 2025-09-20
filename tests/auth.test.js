const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const authRoutes = require('../routes/authRoutes')

const app = express()
app.use(bodyParser.json())
app.use('/api/auth', authRoutes)

describe('Auth routes basic smoke tests', () => {
  test('POST /api/auth/register returns 400 for missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({})
    expect(res.statusCode).toBe(400)
  })
  
  test('POST /api/auth/login returns 400 for missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({})
    expect(res.statusCode).toBe(400)
  })
})
