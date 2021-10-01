import express from 'express';
import path from 'path';
import { Operator } from '../models/operator';
import { Railway } from '../models/railway';
import { Station } from '../models/station';

const stationRouter = express.Router();

stationRouter.get('/all', async (req, res) => {
  const stations = await Station.findAll();
  const response: any[] = [];
  for (const station of stations) {
    const railway = await Railway.findByPk(station.odptRailway);
    const operator = await Operator.findByPk(station.odptOperator);

    let hasStationIcon = false;
    const stationCode = station.odptStationCode || '';
    if (station.odptOperator === 'odpt.Operator:Keikyu') {
      hasStationIcon = true;
    }
    if (
      station.odptOperator === 'odpt.Operator:Keisei' &&
      stationCode.match(/^KS(0[1-9]|[1-5][0-9]|6[0-5])$/)
    ) {
      hasStationIcon = true;
    }
    if (
      station.odptOperator === 'odpt.Operator:Tobu' &&
      (stationCode.match(/^TD-(0[1-9]|[1-2][0-9]|3[0-5])$/) ||
        stationCode.match(/^TI-(0[1-9]|[1-4][0-9]|5[0-7])$/) ||
        stationCode.match(/^TJ-(0[1-9]|[1-3][0-9]|4[0-7])$/) ||
        stationCode.match(/^TN-(0[1-9]|[1-4][0-9]|5[0-8])$/) ||
        stationCode.match(/^TS-(0[1-9]|[1-4][0-9]|5[0-1])$/))
    ) {
      hasStationIcon = true;
    }
    if (
      station.odptOperator === 'odpt.Operator:Toei' &&
      (stationCode.match(/^NT(0[1-9]|1[0-3])]$/) ||
        stationCode.match(/^SA(0[1-9]|[1-2][0-9]|30)$/))
    ) {
      hasStationIcon = true;
    }
    if (station.odptOperator === 'odpt.Operator:TokyoMetro') {
      hasStationIcon = true;
    }
    if (station.odptOperator === 'odpt.Operator:TWR') {
      hasStationIcon = true;
    }
    if (station.odptOperator === 'odpt.Operator:Yurikamome') {
      hasStationIcon = true;
    }
    if (
      (station.odptOperator === 'odpt.Operator:JR-East' &&
        stationCode.match(/^JT0[1-7]$/)) ||
      stationCode.match(/^JO(0[1-9]|1[0-9]|2[0-8])$/) ||
      stationCode.match(/^JK(0[1-9]|[1-3][0-9]|4[0-7])$/) ||
      stationCode.match(/^JH(1[3-9]|2[0-9]|3[0-2])$/) ||
      stationCode.match(/^JN(0[1-9]|1[0-9]|2[0-6]|5[1-4])$/) ||
      stationCode.match(/^JI(0[1-9]|10|51|52|61)$/) ||
      stationCode.match(/^JY(0[1-9]|[1-2][0-9]|30)$/) ||
      stationCode.match(
        /^JC(0[1-9]|1[0-9]|2[0-4]|5[1-9]|6[0-9]|7[0-4]|8[1-6])$/
      ) ||
      stationCode.match(/^JB(0[1-9]|[1-3][0-9])$/) ||
      stationCode.match(/^JU(0[1-7])$/) ||
      stationCode.match(/^JA(0[8-9]|1[0-9]|2[0-6])$/) ||
      stationCode.match(/^JJ(0[1-9]|10)$/) ||
      stationCode.match(/^JL(19|2[0-9]|3[0-2])$/) ||
      stationCode.match(/^JE(0[1-9]|1[0-6])$/) ||
      stationCode.match(/^JM([1-2][0-9]|3[0-5])$/) ||
      stationCode.match(/^JS(0[6-9]|1[0-9]|2[0-4])$/)
    ) {
      hasStationIcon = true;
    }

    if (railway && operator) {
      response.push({
        id: station.owlSameAs,
        stationCode: station.odptStationCode || undefined,
        title: station.odptStationTitle || undefined,
        railwayTitle: railway.odptRailwayTitle || undefined,
        operatorTitle: operator.odptOperatorTitle || undefined,
        hasStationIcon: hasStationIcon || undefined,
      });
    }
  }
  res.send(response);
});

function getAssetPath(additionalPath: string): string {
  return path.join(path.resolve(__dirname, '../../asset'), additionalPath);
}

function getStationIconPath(additionalPath: string): string {
  return path.join(getAssetPath('station-icon'), additionalPath);
}

stationRouter.get('/icon/:id', async (req, res) => {
  const station = await Station.findByPk(req.params.id);
  if (station) {
    try {
      const stationCode = station.odptStationCode || '';
      if (station.odptOperator === 'odpt.Operator:Keikyu') {
        res.sendFile(getStationIconPath(`Keikyu/${stationCode}.png`));
      }
      if (
        station.odptOperator === 'odpt.Operator:Keisei' &&
        stationCode.match(/^KS(0[1-9]|[1-5][0-9]|6[0-5])$/)
      ) {
        res.sendFile(getStationIconPath(`Keisei/${stationCode}.png`));
      }
      if (
        station.odptOperator === 'odpt.Operator:Tobu' &&
        (stationCode.match(/^TD-(0[1-9]|[1-2][0-9]|3[0-5])$/) ||
          stationCode.match(/^TI-(0[1-9]|[1-4][0-9]|5[0-7])$/) ||
          stationCode.match(/^TJ-(0[1-9]|[1-3][0-9]|4[0-7])$/) ||
          stationCode.match(/^TN-(0[1-9]|[1-4][0-9]|5[0-8])$/) ||
          stationCode.match(/^TS-(0[1-9]|[1-4][0-9]|5[0-1])$/))
      ) {
        res.sendFile(
          getStationIconPath(`Tobu/${stationCode.replace('-', '')}.png`)
        );
      }
      if (
        station.odptOperator === 'odpt.Operator:Toei' &&
        (stationCode.match(/^NT(0[1-9]|1[0-3])]$/) ||
          stationCode.match(/^SA(0[1-9]|[1-2][0-9]|30)$/))
      ) {
        res.sendFile(getStationIconPath(`Toei/${stationCode}.png`));
      }
      if (station.odptOperator === 'odpt.Operator:TokyoMetro') {
        res.sendFile(getStationIconPath(`TokyoMetro/${stationCode}.png`));
      }
      if (station.odptOperator === 'odpt.Operator:TWR') {
        res.sendFile(getStationIconPath(`TWR/${stationCode}.png`));
      }
      if (station.odptOperator === 'odpt.Operator:Yurikamome') {
        res.sendFile(getStationIconPath(`Yurikamome/${stationCode}.png`));
      }
      if (
        (station.odptOperator === 'odpt.Operator:JR-East' &&
          stationCode.match(/^JT0[1-7]$/)) ||
        stationCode.match(/^JO(0[1-9]|1[0-9]|2[0-8])$/) ||
        stationCode.match(/^JK(0[1-9]|[1-3][0-9]|4[0-7])$/) ||
        stationCode.match(/^JH(1[3-9]|2[0-9]|3[0-2])$/) ||
        stationCode.match(/^JN(0[1-9]|1[0-9]|2[0-6]|5[1-4])$/) ||
        stationCode.match(/^JI(0[1-9]|10|51|52|61)$/) ||
        stationCode.match(/^JY(0[1-9]|[1-2][0-9]|30)$/) ||
        stationCode.match(
          /^JC(0[1-9]|1[0-9]|2[0-4]|5[1-9]|6[0-9]|7[0-4]|8[1-6])$/
        ) ||
        stationCode.match(/^JB(0[1-9]|[1-3][0-9])$/) ||
        stationCode.match(/^JU(0[1-7])$/) ||
        stationCode.match(/^JA(0[8-9]|1[0-9]|2[0-6])$/) ||
        stationCode.match(/^JJ(0[1-9]|10)$/) ||
        stationCode.match(/^JL(19|2[0-9]|3[0-2])$/) ||
        stationCode.match(/^JE(0[1-9]|1[0-6])$/) ||
        stationCode.match(/^JM([1-2][0-9]|3[0-5])$/) ||
        stationCode.match(/^JS(0[6-9]|1[0-9]|2[0-4])$/)
      ) {
        // draw svg
        res.sendStatus(500);
      }
    } catch (e) {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
});

// stationRouter.get('/info/:id', async (req, res) => {
// });

export default stationRouter;
