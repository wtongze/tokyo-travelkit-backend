import 'dotenv/config';
import axios from 'axios';
import { Op } from 'sequelize';
import { getDistance } from 'geolib';
import database from './database';
import odptAdapter from './models/odptAdapter';
import { Station } from './models/station';
import transferPatch from './transferPatch';
import { Railway } from './models/railway';
import { operatorList } from './const';

type StaticRdf =
  | 'odpt:Calendar'
  | 'odpt:Operator'
  | 'odpt:Station'
  | 'odpt:StationTimetable'
  | 'odpt:TrainTimetable'
  | 'odpt:TrainType'
  | 'odpt:RailDirection'
  | 'odpt:Railway'
  | 'odpt:RailwayFare'
  | 'odpt:Airport'
  | 'odpt:AirportTerminal'
  | 'odpt:FlightStatus';

async function importStaticRdf(item: StaticRdf): Promise<void> {
  console.log(`Importing ${item}...`);
  const { data: rawItems } = await axios.get(
    `https://api-tokyochallenge.odpt.org/api/v4/${item}.json`,
    {
      params: {
        'acl:consumerKey': process.env.API_KEY,
      },
    }
  );

  let converter: (raw: any) => any;
  switch (item) {
    case 'odpt:Calendar':
      converter = odptAdapter.toCalendar;
      break;
    case 'odpt:Operator':
      converter = odptAdapter.toOperator;
      break;
    case 'odpt:RailDirection':
      converter = odptAdapter.toRailDirection;
      break;
    case 'odpt:Railway':
      converter = odptAdapter.toRailway;
      break;
    case 'odpt:RailwayFare':
      converter = odptAdapter.toRailwayFare;
      break;
    case 'odpt:Station':
      converter = odptAdapter.toStation;
      break;
    case 'odpt:StationTimetable':
      converter = odptAdapter.toStationTimetable;
      break;
    case 'odpt:TrainTimetable':
      converter = odptAdapter.toTrainTimetable;
      break;
    case 'odpt:TrainType':
      converter = odptAdapter.toTrainType;
      break;
    case 'odpt:Airport':
      converter = odptAdapter.toAirport;
      break;
    case 'odpt:AirportTerminal':
      converter = odptAdapter.toAirportTerminal;
      break;
    case 'odpt:FlightStatus':
      converter = odptAdapter.toFlightStatus;
      break;
    default:
      converter = () => {
        throw new Error(`Converter for ${item} is not defined`);
      };
      break;
  }

  await Promise.all(rawItems.map((rawItem: any) => converter(rawItem).save()));
}

async function stationTransferPatch() {
  const tempStations = await Station.findAll();
  for (const tempStation of tempStations) {
    tempStation.odptConnectingStation = null;
    await tempStation.save();
  }

  const stations = await Station.findAll({
    where: {
      odptConnectingRailway: {
        [Op.not]: null,
      },
      odptOperator: operatorList,
    },
  });
  console.log(stations.length);
  for (const station of stations) {
    for (const targetRailway of station.odptConnectingRailway!) {
      let targetStation: string | undefined;
      let targetDistance: number | undefined;

      const railway = await Railway.findByPk(targetRailway);

      if (
        railway &&
        operatorList.includes(railway.odptOperator) &&
        railway.odptStationOrder.length > 0
      ) {
        if (
          station.owlSameAs in transferPatch &&
          targetRailway in transferPatch[station.owlSameAs]
        ) {
          targetStation = transferPatch[station.owlSameAs][targetRailway];
        } else {
          const possibleStations = await Station.findAll({
            where: {
              odptRailway: targetRailway,
            },
          });
          if (
            station.geoLat !== null &&
            station.geoLong !== null &&
            possibleStations.length > 0 &&
            possibleStations.every(
              (sta) => sta.geoLat !== null && sta.geoLong !== null
            )
          ) {
            possibleStations.forEach((possibleStation) => {
              const currDistance = getDistance(
                {
                  lat: station.geoLat!,
                  lon: station.geoLong!,
                },
                {
                  lat: possibleStation.geoLat!,
                  lon: possibleStation.geoLong!,
                }
              );
              if (
                targetDistance === undefined ||
                currDistance < targetDistance
              ) {
                targetStation = possibleStation.owlSameAs;
                targetDistance = currDistance;
              }
            });
          } else {
            const newId = `odpt.Station:${targetRailway.split(':')[1]}.${
              station.owlSameAs.split('.').reverse()[0]
            }`;

            const newSta = await Station.findByPk(newId);
            if (newSta !== null) {
              targetStation = newSta.owlSameAs;
            } else {
              throw new Error(
                `TransferPatch fail: ${station.dcTitle} ${station.owlSameAs} ${targetRailway}`
              );
            }
          }
        }
      }

      if (station.odptConnectingStation === null) {
        station.odptConnectingStation = [];
      }

      station.odptConnectingStation.push(targetStation || null);
    }

    await station.save();
  }
}

(async () => {
  database.sync({ force: true });
  await importStaticRdf('odpt:Calendar');
  await importStaticRdf('odpt:Operator');
  await importStaticRdf('odpt:RailDirection');
  await importStaticRdf('odpt:Railway');
  await importStaticRdf('odpt:RailwayFare');
  await importStaticRdf('odpt:Station');
  await importStaticRdf('odpt:StationTimetable');
  await importStaticRdf('odpt:TrainTimetable');
  await importStaticRdf('odpt:TrainType');
  await importStaticRdf('odpt:Airport');
  await importStaticRdf('odpt:AirportTerminal');
  await importStaticRdf('odpt:FlightStatus');
  await stationTransferPatch();
  console.log('ok');
})();
