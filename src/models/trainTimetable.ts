import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';
import { MultiLangObject } from './common';

interface TrainTimetableObject {
  odptArrivalTime: string | null;
  odptArrivalStation: string | null;
  odptDepartureTime: string | null;
  odptDepartureStation: string | null;
  odptPlatformNumber: string | null;
  odptPlatformName: MultiLangObject | null;
  odptNote: MultiLangObject | null;
}

export class TrainTimetable extends Model {
  dcDate!: string;

  dctIssued!: string | null;

  dctValid!: string | null;

  owlSameAs!: string;

  odptOperator!: string;

  odptRailway!: string;

  odptRailDirection!: string | null;

  odptCalendar!: string | null;

  odptTrain!: string | null;

  odptTrainNumber!: string;

  odptTrainType!: string | null;

  odptTrainName!: MultiLangObject[] | null;

  odptTrainOwner!: string | null;

  odptOriginStation!: string[] | null;

  odptDestinationStation!: string[] | null;

  odptViaStation!: string[] | null;

  odptViaRailway!: string[] | null;

  odptPreviousTrainTimetable!: string[] | null;

  odptNextTrainTimetable!: string[] | null;

  odptTrainTimetableObject!: TrainTimetableObject[];

  odptNeedExtraFee!: boolean | null;

  odptNote!: MultiLangObject | null;
}

TrainTimetable.init(
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
    odptRailway: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    odptRailDirection: DataTypes.TEXT,
    odptCalendar: DataTypes.TEXT,
    odptTrain: DataTypes.TEXT,
    odptTrainNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    odptTrainType: DataTypes.TEXT,
    odptTrainName: DataTypes.JSON,
    odptTrainOwner: DataTypes.TEXT,
    odptOriginStation: DataTypes.JSON,
    odptDestinationStation: DataTypes.JSON,
    odptViaStation: DataTypes.JSON,
    odptViaRailway: DataTypes.JSON,
    odptPreviousTrainTimetable: DataTypes.JSON,
    odptNextTrainTimetable: DataTypes.JSON,
    odptTrainTimetableObject: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    odptNeedExtraFee: DataTypes.BOOLEAN,
    odptNote: DataTypes.JSON,
  },
  { sequelize }
);
