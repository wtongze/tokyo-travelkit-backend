import express from 'express';
import path from 'path';
import cors from 'cors';
import commonRouter from './routers/common';
import directionRouter from './routers/direction';
import flightRouter from './routers/flight';
import railwayRouter from './routers/railway';
import stationRouter from './routers/station';
import trainRouter from './routers/train';

const app = express();
const port = 4000;

app.use(cors());
app.use('/flight', flightRouter);
app.use('/station', stationRouter);
app.use('/railway', railwayRouter);
app.use('/train', trainRouter);
app.use('/direction', directionRouter);
app.use('/common', commonRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/test', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../asset/station-icon/Tobu/TD07.png'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
