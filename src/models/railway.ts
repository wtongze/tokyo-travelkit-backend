import { Model, DataTypes } from 'sequelize';
import { MultiLangObject } from './common';
import sequelize from '../database';

interface StationOrder {
  odptStation: string;
  odptStationTitle?: MultiLangObject;
  odptIndex: number;
}

export class Railway extends Model {
  dcDate!: string;

  owlSameAs!: string;

  dcTitle!: string;

  odptRailwayTitle!: string | null;

  odptKana!: string | null;

  odptOperator!: string;

  odptLineCode!: string | null;

  odptColor!: string | null;

  odptAscendingRailDirection!: string | null;

  odptDescendingRailDirection!: string | null;

  odptStationOrder!: StationOrder[];
}

Railway.init(
  {
    dcDate: DataTypes.TEXT,
    owlSameAs: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    dcTitle: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    odptRailwayTitle: DataTypes.JSON,
    odptKana: DataTypes.TEXT,
    odptOperator: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    odptLineCode: DataTypes.TEXT,
    odptColor: DataTypes.TEXT,
    odptAscendingRailDirection: DataTypes.TEXT,
    odptDescendingRailDirection: DataTypes.TEXT,
    odptStationOrder: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  { sequelize }
);
