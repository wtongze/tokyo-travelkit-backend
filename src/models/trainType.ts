import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';
import { MultiLangObject } from './common';

export class TrainType extends Model {
  dcDate!: string | null;

  owlSameAs!: string;

  odptOperator!: string;

  dcTitle!: string | null;

  odptTrainTypeTitle!: MultiLangObject | null;
}

TrainType.init(
  {
    dcDate: DataTypes.TEXT,
    owlSameAs: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    odptOperator: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dcTitle: DataTypes.TEXT,
    odptTrainTypeTitle: DataTypes.JSON,
  },
  { sequelize }
);
