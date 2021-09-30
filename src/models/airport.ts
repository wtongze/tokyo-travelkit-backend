import { Model, DataTypes } from 'sequelize';
import { MultiLangObject } from './common';
import sequelize from '../database';

export class Airport extends Model {
  dcDate!: string | null;

  owlSameAs!: string;

  dcTitle!: string | null;

  odptAirportTitle!: MultiLangObject | null;

  odptAirportTerminal!: string[] | null;

  geoLong!: number | null;

  geoLat!: number | null;

  ugRegion!: object | null;
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
