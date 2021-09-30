import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';
import { MultiLangObject } from './common';

export class AirportTerminal extends Model {
  dcDate?: string;

  owlSameAs!: string;

  dcTitle?: string;

  odptAirportTerminalTitle?: MultiLangObject;

  odptAirport!: string;

  geoLong?: number;

  geoLat?: number;

  ugRegion?: object;
}

AirportTerminal.init(
  {
    dcDate: DataTypes.TEXT,
    owlSameAs: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    dcTitle: DataTypes.TEXT,
    odptAirportTerminalTitle: DataTypes.JSON,
    odptAirport: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    geoLong: DataTypes.REAL,
    geoLat: DataTypes.REAL,
    ugRegion: DataTypes.JSON,
  },
  { sequelize }
);
