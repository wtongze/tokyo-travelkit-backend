import { DataTypes, Model } from 'sequelize';
import { MultiLangObject } from './common';
import sequelize from '../database';

export class FlightStatus extends Model {
  dcDate!: string | null;

  owlSameAs!: string;

  dcTitle!: string | null;

  odptFlightStatusTitle!: MultiLangObject | null;
}

FlightStatus.init(
  {
    dcDate: DataTypes.TEXT,
    owlSameAs: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    dcTitle: DataTypes.TEXT,
    odptFlightStatusTitle: DataTypes.JSON,
  },
  { sequelize }
);
