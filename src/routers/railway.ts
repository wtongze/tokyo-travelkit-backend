import express from 'express';
import { Operator } from '../models/operator';
import { RailDirection } from '../models/railDirection';
import { Railway } from '../models/railway';
import { RailwayFare } from '../models/railwayFare';
import { Station } from '../models/station';

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

railwayRouter.get('/fare/:from/:to', async (req, res) => {
  const from = await Station.findByPk(req.params.from);
  const to = await Station.findByPk(req.params.to);
  if (from && to) {
    const railwayFareList = await RailwayFare.findAll({
      where: {
        odptFromStation: from.owlSameAs,
        odptToStation: to.owlSameAs,
      },
    });
    const response: any[] = [];
    for (const railwayFare of railwayFareList) {
      const operator = await Operator.findByPk(railwayFare.odptOperator);
      const viaStation: any[] = [];
      for (const viaStationId of railwayFare.odptViaStation || []) {
        const viaStationObj = await Station.findByPk(viaStationId);
        viaStation.push({
          id: viaStationId,
          stationTitle: viaStationObj
            ? viaStationObj.odptStationTitle || undefined
            : undefined,
        });
      }
      const viaRailway: any[] = [];
      for (const viaRailwayId of railwayFare.odptViaRailway || []) {
        const viaRailwayObj = await Railway.findByPk(viaRailwayId);
        viaRailway.push({
          id: viaRailwayId,
          stationTitle: viaRailwayObj
            ? viaRailwayObj.odptRailwayTitle || undefined
            : undefined,
        });
      }
      response.push({
        id: railwayFare.owlSameAs,
        operatorTitle: operator ? operator.odptOperatorTitle : undefined,
        fromStationTitle: from.odptStationTitle || undefined,
        toStationTitle: to.odptStationTitle || undefined,
        ticketFare: railwayFare.odptTicketFare,
        icCardFare: railwayFare.odptIcCardFare || undefined,
        childTicketFare: railwayFare.odptChildIcCardFare || undefined,
        childIcCardFare: railwayFare.odptChildIcCardFare || undefined,
        viaStation: viaStation.length > 0 ? viaStation : undefined,
        viaRailway: viaRailway.length > 0 ? viaRailway : undefined,
        ticketType: railwayFare.odptTicketType || undefined,
        paymentMethod: railwayFare.odptPaymentMethod || undefined,
      });
    }
    res.send(response);
  } else {
    res.sendStatus(404);
  }
});

export default railwayRouter;
