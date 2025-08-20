
import Cors from 'cors';
import initMiddleware from './init-middleware';

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: process.env.NEXTAUTH_URL || 'http://localhost:3000', // your frontend URL
    credentials: true,
  })
);

export default cors;
