import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';

export class RailwayFare extends Model {
  dcDate!: string;

  dctIssued!: string | null;

  dctValid!: string | null;

  owlSameAs!: string;

  odptOperator!: string;

  odptFromStation!: string;

  odptToStation!: string;

  odptTicketFare!: number;

  odptIcCardFare!: number | null;

  odptChildTicketFare!: number | null;

  odptChildIcCardFare!: number | null;

  odptViaStation!: string[] | null;

  odptViaRailway!: string[] | null;

  odptTicketType!: string | null;

  odptPaymentMethod!: string[] | null;
}

RailwayFare.init(
  {
    dcDate: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dctIssued: DataTypes.TEXT,
    dctValid: DataTypes.TEXT,
    owlSameAs: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    odptOperator: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    odptFromStation: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    odptToStation: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    odptTicketFare: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    odptIcCardFare: DataTypes.NUMBER,
    odptChildTicketFare: DataTypes.NUMBER,
    odptChildIcCardFare: DataTypes.NUMBER,
    odptViaStation: DataTypes.JSON,
    odptViaRailway: DataTypes.JSON,
    odptTicketType: DataTypes.TEXT,
    odptPaymentMethod: DataTypes.JSON,
  },
  { sequelize }
);
