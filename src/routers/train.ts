import expres from 'express';
import { MultiLangObject } from '../models/common';
import { Operator } from '../models/operator';
import { RailDirection } from '../models/railDirection';
import { Railway } from '../models/railway';
import { TrainTimetable } from '../models/trainTimetable';
import { TrainType } from '../models/trainType';

const trainRouter = expres.Router();

interface TrainTimetableItem {
  id: string;
  operatorTitle?: MultiLangObject;
  railway: string;
  railwayTitle?: MultiLangObject;
  railDirectionTitle?: MultiLangObject;
  trainNumber?: string;
  trainTypeTitle?: MultiLangObject;
  trainName?: MultiLangObject[];
  trainOwnerTitle?: MultiLangObject;
  originStation?: string[];
  destinationStation?: string[];
  viaStation?: string[];
  viaRailway?: string[];
}

export async function getTrainTimetable(
  trainTimetable: TrainTimetable
): Promise<TrainTimetableItem> {
  const operator = await Operator.findByPk(trainTimetable.odptOperator);
  const railway = await Railway.findByPk(trainTimetable.odptRailway);
  const railDirection = await RailDirection.findByPk(
    trainTimetable.odptRailDirection || ''
  );
  const trainOwner = await Operator.findByPk(
    trainTimetable.odptTrainOwner || ''
  );
  const trainType = await TrainType.findByPk(
    trainTimetable.odptTrainType || ''
  );

  const response: TrainTimetableItem = {
    id: trainTimetable.owlSameAs,
    operatorTitle: operator?.odptOperatorTitle || undefined,
    railway: trainTimetable.odptRailway,
    railwayTitle: railway?.odptRailwayTitle || undefined,
    railDirectionTitle: railDirection?.odptRailDirectionTitle || undefined,
    trainNumber: trainTimetable.odptTrainNumber,
    trainTypeTitle: trainType?.odptTrainTypeTitle || undefined,
    trainName:
      trainTimetable.odptTrainName && trainTimetable.odptTrainName.length > 0
        ? trainTimetable.odptTrainName
        : undefined,
    trainOwnerTitle: trainOwner?.odptOperatorTitle || undefined,
    originStation: trainTimetable.odptOriginStation || undefined,
    destinationStation: trainTimetable.odptDestinationStation || undefined,
    viaStation: trainTimetable.odptViaStation || undefined,
    viaRailway: trainTimetable.odptViaRailway || undefined,
  };
  return response;
}

// partial implementation
trainRouter.get('/timetable/:id', async (req, res) => {
  const { id } = req.params;
  const trainTimetable = await TrainTimetable.findByPk(id);
  if (trainTimetable) {
    res.send(getTrainTimetable(trainTimetable));
  } else {
    res.sendStatus(404);
  }
});

export default trainRouter;
