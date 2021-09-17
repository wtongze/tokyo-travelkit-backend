import { Model, DataTypes } from 'sequelize';
import { MultiLangObject } from './common';
import sequelize from '../database';

export class RailDirection extends Model {
  dcDate!: string | null;

  owlSameAs!: string;

  dcTitle!: string | null;

  odptRailDirectionTitle!: MultiLangObject | null;
}

RailDirection.init(
  {
    dcDate: DataTypes.TEXT,
    owlSameAs: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    dcTitle: DataTypes.TEXT,
    odptRailDirectionTitle: DataTypes.JSON,
  },
  { sequelize }
);
