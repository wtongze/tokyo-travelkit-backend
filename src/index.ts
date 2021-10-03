import express from 'express';
import path from 'path';
import commonRouter from './routers/common';
import flightRouter from './routers/flight';
import stationRouter from './routers/station';

const app = express();
const port = 3000;

app.use('/flight', flightRouter);
app.use('/station', stationRouter);
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
