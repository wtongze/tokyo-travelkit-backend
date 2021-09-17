import { Model, DataTypes } from 'sequelize';
import { MultiLangObject } from './common';
import sequelize from '../database';

export class Calendar extends Model {
  dcDate!: string | null;

  owlSameAs!: string;

  dcTitle!: string | null;

  odptCalendarTitle!: MultiLangObject | null;

  odptDay!: string[] | null;

  odptDuration!: string | null;
}

Calendar.init(
  {
    dcDate: DataTypes.TEXT,
    owlSameAs: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    dcTitle: DataTypes.TEXT,
    odptCalendarTitle: DataTypes.JSON,
    odptDay: DataTypes.JSON,
    odptDuration: DataTypes.TEXT,
  },
  { sequelize }
);
