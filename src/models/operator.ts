import { Model, DataTypes } from 'sequelize';
import { MultiLangObject } from './common';
import sequelize from '../database';

export class Operator extends Model {
  dcDate!: string | null;

  owlSameAs!: string;

  dcTitle!: string | null;

  odptOperatorTitle!: MultiLangObject | null;
}

Operator.init(
  {
    dcDate: DataTypes.TEXT,
    owlSameAs: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    dcTitle: DataTypes.TEXT,
    odptOperatorTitle: DataTypes.JSON,
  },
  { sequelize }
);
