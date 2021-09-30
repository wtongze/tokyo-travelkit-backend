import { Model, DataTypes } from 'sequelize';
import { MultiLangObject } from './common';
import sequelize from '../database';

export class Airport extends Model {
  dcDate?: string;

  owlSameAs!: string;

  dcTitle?: string;

  odptAirportTitle?: MultiLangObject;

  odptAirportTerminal?: string[];

  geoLong?: number;

  geoLat?: number;

  ugRegion?: object;
}

Airport.init(
  {
    dcDate: DataTypes.TEXT,
    owlSameAs: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    dcTitle: DataTypes.TEXT,
    odptAirportTitle: DataTypes.JSON,
    odptAirportTerminal: DataTypes.JSON,
    geoLong: DataTypes.REAL,
    geoLat: DataTypes.REAL,
    ugRegion: DataTypes.JSON,
  },
  { sequelize }
);
