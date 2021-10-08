import express from 'express';
import path from 'path';
import { Calendar } from '../models/calendar';
import { MultiLangObject } from '../models/common';
import { Operator } from '../models/operator';
import { RailDirection } from '../models/railDirection';
import { Railway } from '../models/railway';
import { Station } from '../models/station';
import { StationTimetable } from '../models/stationTimetable';
import { TrainType } from '../models/trainType';

const stationRouter = express.Router();

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
        res.sendFile(
          getStationIconPath(`Toei/${stationCode.replace('-', '')}.png`)
        );
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

stationRouter.get('/map/:id', async (req, res) => {
  res.sendStatus(404);
});

stationRouter.get('/info/:id', async (req, res) => {
  const station = await Station.findByPk(req.params.id);
  if (station) {
    const operator = await Operator.findByPk(station.odptOperator);
    const railway = await Railway.findByPk(station.odptRailway);
    if (operator && railway) {
      const connectingRailway: {
        id: string;
        railwayTitle?: MultiLangObject;
      }[] = [];
      for (const railwayId of station.odptConnectingRailway || []) {
        const tempRailway = await Railway.findByPk(railwayId);
        if (tempRailway) {
          connectingRailway.push({
            id: railwayId,
            railwayTitle: tempRailway.odptRailwayTitle || undefined,
          });
        } else {
          connectingRailway.push({
            id: railwayId,
          });
        }
      }
      const connectingStation: {
        id?: string;
        stationTitle?: MultiLangObject;
      }[] = [];
      for (const stationId of station.odptConnectingStation || []) {
        const tempStation = await Station.findByPk(stationId || '');
        if (tempStation) {
          connectingStation.push({
            id: stationId || undefined,
            stationTitle: tempStation.odptStationTitle || undefined,
          });
        } else {
          connectingStation.push({
            id: stationId || undefined,
          });
        }
      }
      const stationTimetable: {
        id: string;
        calendarTitle?: MultiLangObject;
      }[] = [];
      for (const timetableId of station.odptStationTimetable || []) {
        const timetable = await StationTimetable.findByPk(timetableId);
        if (timetable) {
          const calendar = await Calendar.findByPk(
            timetable.odptCalendar || ''
          );
          if (calendar) {
            stationTimetable.push({
              id: timetableId,
              calendarTitle: calendar.odptCalendarTitle || undefined,
            });
          } else {
            stationTimetable.push({
              id: timetableId,
            });
          }
        } else {
          stationTimetable.push({
            id: timetableId,
          });
        }
      }
      const response = {
        id: station.owlSameAs,
        title: station.odptStationTitle || undefined,
        operatorTitle: operator.odptOperatorTitle || undefined,
        railwayTitle: railway.odptRailwayTitle || undefined,
        connectingRailway:
          connectingRailway.length > 0 ? connectingRailway : undefined,
        connectingStation:
          connectingStation.length > 0 ? connectingStation : undefined,
        stationTimetable:
          stationTimetable.length > 0 ? stationTimetable : undefined,
      };
      res.send(response);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
});

stationRouter.get('/timetable/:id', async (req, res) => {
  const timetable = await StationTimetable.findByPk(req.params.id);
  if (timetable) {
    const operator = await Operator.findByPk(timetable.odptOperator);
    const railDirection = await RailDirection.findByPk(
      timetable.odptRailDirection || ''
    );
    const calendar = await Calendar.findByPk(timetable.odptCalendar || '');
    if (operator && railDirection && calendar) {
      const stationTimetableObject: any[] = [];
      for (const item of timetable.odptStationTimetableObject) {
        const originStation: any[] = [];
        for (const originId of item.odptOriginStation || []) {
          const origin = await Station.findByPk(originId);
          if (origin) {
            originStation.push({
              id: originId,
              stationTitle: origin.odptStationTitle,
            });
          } else {
            originStation.push({
              id: originId,
            });
          }
        }
        const destinationStation: any[] = [];
        for (const destinationId of item.odptDestinationStation || []) {
          const destination = await Station.findByPk(destinationId);
          if (destination) {
            destinationStation.push({
              id: destinationId,
              stationTitle: destination.odptStationTitle,
            });
          } else {
            originStation.push({
              id: destinationId,
            });
          }
        }
        const viaStation: any[] = [];
        for (const viaId of item.odptViaStation || []) {
          const station = await Station.findByPk(viaId);
          if (station) {
            viaStation.push({
              id: viaId,
              stationTitle: station.odptStationTitle || undefined,
            });
          } else {
            viaStation.push({
              id: viaId,
            });
          }
        }
        const viaRailway: any[] = [];
        for (const viaId of item.odptViaRailway || []) {
          const railway = await Railway.findByPk(viaId);
          if (railway) {
            viaRailway.push({
              id: viaId,
              railwayTitle: railway.odptRailwayTitle || undefined,
            });
          } else {
            viaRailway.push({
              id: viaId,
            });
          }
        }
        const trainType = await TrainType.findByPk(item.odptTrainType);
        const trainOwner = await Operator.findByPk(item.odptTrainOwner);
        stationTimetableObject.push({
          arrivalTime: item.odptArrivalTime || undefined,
          departureTime: item.odptDepartureTime || undefined,
          originStation: originStation.length > 0 ? originStation : undefined,
          destinationStation:
            destinationStation.length > 0 ? destinationStation : undefined,
          viaStation: viaStation.length > 0 ? viaStation : undefined,
          viaRailway: viaRailway.length > 0 ? viaRailway : undefined,
          train: item.odptTrain,
          trainNumber: item.odptTrainNumber,
          trainTypeTitle: trainType
            ? trainType.odptTrainTypeTitle || undefined
            : undefined,
          trainName: item.odptTrainName,
          trainOwner: trainOwner
            ? trainOwner.odptOperatorTitle || undefined
            : undefined,
          isLast: item.odptIsLast,
          isOrigin: item.odptIsOrigin,
          platformNumber: item.odptPlatformNumber,
          carCompositions: item.odptCarCompositions,
          note: item.odptNote,
        });
      }
      const response: any = {
        id: timetable.owlSameAs,
        operatorTitle: operator.odptOperatorTitle || undefined,
        railwayTitle: timetable.odptRailwayTitle || undefined,
        stationTitle: timetable.odptStationTitle || undefined,
        railDirectionTitle: railDirection.odptRailDirectionTitle || undefined,
        calendarTitle: calendar.odptCalendarTitle || undefined,
        stationTimetableObject:
          stationTimetableObject.length > 0
            ? stationTimetableObject
            : undefined,
        note: timetable.odptNote || undefined,
      };
      res.send(response);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
});

export default stationRouter;
