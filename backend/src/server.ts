import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import actionsRoutes from './hasuraActions';

dotenv.config();
const app = express();

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/actions', actionsRoutes);

app.listen(process.env.PORT);
