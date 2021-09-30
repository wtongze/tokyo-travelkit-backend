import express from 'express';
import path from 'path';
import { Operator } from './models/operator';
import { Railway } from './models/railway';
import { Station } from './models/station';
import flightRouter from './routers/flight';

const app = express();
const port = 3000;

app.use('/flight', flightRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/stations', async (req, res) => {
  const stations = await Station.findAll();
  const response: any[] = [];
  for (const station of stations) {
    const railway = await Railway.findByPk(station.odptRailway);
    const operator = await Operator.findByPk(station.odptOperator);
    if (railway && operator) {
      response.push({
        id: station.owlSameAs,
        stationCode: station.odptStationCode,
        title: station.odptStationTitle,
        railwayTitle: railway.odptRailwayTitle,
        operatorTitle: operator.odptOperatorTitle,
      });
    }
  }
  res.send(response);
});

app.get('/test', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../asset/station-icon/Tobu/TD07.png'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
