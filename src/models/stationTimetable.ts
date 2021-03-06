import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';
import { MultiLangObject } from './common';

interface StationTimetableObject {
  odptArrivalTime?: string;
  odptDepartureTime?: string;
  odptOriginStation?: string[];
  odptDestinationStation?: string[];
  odptViaStation?: string[];
  odptViaRailway?: string[];
  odptTrain?: string;
  odptTrainNumber?: string;
  odptTrainType?: string;
  odptTrainName?: MultiLangObject[];
  odptTrainOwner?: string;
  odptIsLast?: boolean;
  odptIsOrigin?: boolean;
  odptPlatformNumber?: string;
  odptCarCompositions?: number;
  odptNote?: MultiLangObject;
}

export class StationTimetable extends Model {
  dcDate!: string;

  dctIssued!: string | null;

  dctValid!: string | null;

  owlSameAs!: string;

  odptOperator!: string;

  odptRailway!: string;

  odptRailwayTitle!: MultiLangObject | null;

  odptStation!: string;

  odptStationTitle!: MultiLangObject | null;

  odptRailDirection!: string | null;

  odptCalendar!: string | null;

  odptStationTimetableObject!: StationTimetableObject[];

  odptNote!: MultiLangObject | null;
}

StationTimetable.init(
  {
    dcDate: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dctIssued: DataTypes.TEXT,
    dctValid: DataTypes.TEXT,
    owlSameAs: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    odptOperator: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    odptRailway: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    odptRailwayTitle: DataTypes.JSON,
    odptStation: DataTypes.TEXT,
    odptStationTitle: DataTypes.JSON,
    odptRailDirection: DataTypes.TEXT,
    odptCalendar: DataTypes.TEXT,
    odptStationTimetableObject: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    odptNote: DataTypes.JSON,
  },
  { sequelize }
);
