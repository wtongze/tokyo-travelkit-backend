import express from 'express';
import { sortBy } from 'lodash';
import { MultiLangObject } from '../models/common';
import { Operator } from '../models/operator';
import { Railway } from '../models/railway';
import { Station } from '../models/station';

const commonRouter = express.Router();

interface StationItem {
  id: string;
  stationCode?: string;
  title?: MultiLangObject;
  railway: string;
  railwayTitle?: MultiLangObject;
  operator: string;
  operatorTitle?: MultiLangObject;
  hasStationIcon?: boolean;
}

commonRouter.get('/stations', async (req, res) => {
  const stations = await Station.findAll();
  const response: StationItem[] = [];
  for (const station of stations) {
    const railway = await Railway.findByPk(station.odptRailway);
    const operator = await Operator.findByPk(station.odptOperator);

    let hasStationIcon = false;
    const stationCode = station.odptStationCode || '';
    if (
      station.odptOperator === 'odpt.Operator:Keikyu' &&
      stationCode.match(/^KK(0[1-9]|[1-6][0-9]|7[0-2])$/)
    ) {
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
        stationCode.match(/^TI-(0[1-9]|1[0-9]|2[0-5]|3[1-9]|4[1-7]|5[1-7])$/) ||
        stationCode.match(/^TJ-(0[1-9]|[1-2][0-9]|3[0-8]|4[1-7])$/) ||
        stationCode.match(/^TN-(0[1-9]|1[0-9]|2[0-5]|5[1-8]|3[1-9]|40)$/) ||
        stationCode.match(/^TS-(0[1-9]|[1-2][0-9]|30|51|4[1-4])$/))
    ) {
      hasStationIcon = true;
    }
    if (
      station.odptOperator === 'odpt.Operator:Toei' &&
      (stationCode.match(/^NT-(0[1-9]|1[0-3])$/) ||
        stationCode.match(/^SA-(0[1-9]|[1-2][0-9]|30)$/))
    ) {
      hasStationIcon = true;
    }
    if (
      station.odptOperator === 'odpt.Operator:TokyoMetro' &&
      (stationCode.match(/^C(0[1-9]|1[0-9]|20)$/) ||
        stationCode.match(/^F(0[1-9]|1[0-6])$/) ||
        stationCode.match(/^G(0[1-9]|1[0-9])$/) ||
        stationCode.match(/^H(0[1-9]|1[0-9]|20|21)$/) ||
        stationCode.match(/^M(0[1-9]|1[0-9]|2[0-5])$/) ||
        stationCode.match(/^Mb0[3-5]$/) ||
        stationCode.match(/^N(0[1-9]|1[0-9])$/) ||
        stationCode.match(/^T(0[1-9]|1[0-9]|2[0-3])$/) ||
        stationCode.match(/^Y(0[1-9]|1[0-9]|2[0-4])$/) ||
        stationCode.match(/^Z(0[1-9]|1[0-4])/))
    ) {
      hasStationIcon = true;
    }
    if (
      station.odptOperator === 'odpt.Operator:TWR' &&
      stationCode.match(/^R[1-8]$/)
    ) {
      hasStationIcon = true;
    }
    if (
      station.odptOperator === 'odpt.Operator:Yurikamome' &&
      stationCode.match(/^U([1-9]|1[0-6])$/)
    ) {
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
      hasStationIcon = false;
    }

    if (railway && operator) {
      response.push({
        id: station.owlSameAs,
        stationCode: station.odptStationCode || undefined,
        title: station.odptStationTitle || undefined,
        railway: railway.owlSameAs,
        railwayTitle: railway.odptRailwayTitle || undefined,
        operator: operator.owlSameAs,
        operatorTitle: operator.odptOperatorTitle || undefined,
        hasStationIcon: hasStationIcon || undefined,
      });
    }
  }
  res.send(sortBy(response, ['hasStationIcon', 'stationCode']));
});

interface RailwayItem {
  id: string;
  title?: MultiLangObject;
  kana?: string;
  operator: string;
  operatorTitle?: MultiLangObject;
  lineCode?: string;
  color?: string;
}

commonRouter.get('/railways', async (req, res) => {
  const railways = await Railway.findAll();
  const response: RailwayItem[] = [];
  for (const railway of railways) {
    const operator = await Operator.findByPk(railway.odptOperator);
    if (operator) {
      response.push({
        id: railway.owlSameAs,
        title: railway.odptRailwayTitle || undefined,
        kana: railway.odptKana || undefined,
        operator: railway.odptOperator,
        operatorTitle: operator.odptOperatorTitle || undefined,
        lineCode: railway.odptLineCode || undefined,
        color: railway.odptColor || undefined,
      });
    }
  }
  res.send(response);
});

export default commonRouter;
