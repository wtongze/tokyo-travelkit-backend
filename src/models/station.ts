import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';
import { MultiLangObject } from './common';

export class Station extends Model {
  dcDate!: string;

  owlSameAs!: string;

  dcTitle!: string | null;

  odptStationTitle!: MultiLangObject | null;

  odptOperator!: string;

  odptRailway!: string;

  odptStationCode!: string | null;

  geoLong!: number | null;

  geoLat!: number | null;

  odptExit!: string[] | null;

  odptConnectingRailway!: string[] | null;

  // additional property
  odptConnectingStation!: (string | null)[] | null;

  odptStationTimetable!: string[] | null;
}

Station.init(
  {
    dcDate: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    owlSameAs: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    dcTitle: DataTypes.TEXT,
    odptStationTitle: DataTypes.JSON,
    odptOperator: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    odptRailway: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    odptStationCode: DataTypes.TEXT,
    geoLong: DataTypes.REAL,
    geoLat: DataTypes.REAL,
    odptExit: DataTypes.JSON,
    odptConnectingRailway: DataTypes.JSON,
    odptConnectingStation: DataTypes.JSON,
    odptStationTimetable: DataTypes.JSON,
  },
  { sequelize }
);
