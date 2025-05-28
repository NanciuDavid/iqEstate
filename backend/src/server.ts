import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import authRoutes from './routes/auth.routes';

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const port: number = parseInt(process.env.PORT || '3001', 10);



app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from the backend!');
});

const {neon} = require('@neondatabase/serverless');

const sql = neon(process.env.DB_URL);


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

//route to check the users
app.get('/users', async (req: Request, res: Response) => {
  const result = await sql`SELECT * FROM users`;
  res.json(result);
  console.log(result);
});

app.get('/properties', async(req: Request, res:Response) => {
  const result = await sql`SELECT * from properties`;
  res.json(result);
  console.log(result);
});

app.get('/property_images', async(req: Request, res:Response) => {
  const result = await sql`SELECT * from property_images`;
  res.json(result);
  console.log(result);
});

app.get('/property_amenities', async(req: Request, res:Response) => {
  const result = await sql`SELECT * from property_amenities`;
  res.json(result);
});

// Logging middleware
app.use((req: Request, res: Response, next) => {
  console.log('Time:', Date.now());
  console.log('Request URL:', req.originalUrl);
  console.log('Request Type:', req.method);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});

app.use('/auth', authRoutes);