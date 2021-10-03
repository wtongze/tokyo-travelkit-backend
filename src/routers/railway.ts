import express from 'express';
import { Operator } from '../models/operator';
import { RailDirection } from '../models/railDirection';
import { Railway } from '../models/railway';

const railwayRouter = express.Router();

railwayRouter.get('/info/:id', async (req, res) => {
  const railway = await Railway.findByPk(req.params.id);
  if (railway) {
    const operator = await Operator.findByPk(railway.odptOperator);
    const ascendingRailDirection = await RailDirection.findByPk(
      railway.odptAscendingRailDirection || ''
    );
    const descendingRailDirection = await RailDirection.findByPk(
      railway.odptDescendingRailDirection || ''
    );
    if (operator && ascendingRailDirection && descendingRailDirection) {
      const response: any = {
        id: railway.owlSameAs,
        title: railway.odptRailwayTitle || undefined,
        kana: railway.odptKana || undefined,
        operatorTitle: operator.odptOperatorTitle || undefined,
        lineCode: railway.odptLineCode || undefined,
        color: railway.odptColor || undefined,
        ascendingRailDirectionTitle:
          ascendingRailDirection.odptRailDirectionTitle || undefined,
        descendingRailDirectionTitle:
          descendingRailDirection.odptRailDirectionTitle || undefined,
        stationOrder: railway.odptStationOrder.map((i) => ({
          station: i.odptStation,
          title: i.odptStationTitle || undefined,
          index: i.odptIndex,
        })),
      };
      res.send(response);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
});

export default railwayRouter;
