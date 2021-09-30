import { Calendar } from './calendar';
import { FlightInformationDeparture } from './flightInformationDeparture';
import { Operator } from './operator';
import { RailDirection } from './railDirection';
import { Railway } from './railway';
import { RailwayFare } from './railwayFare';
import { Station } from './station';
import { StationTimetable } from './stationTimetable';
import { TrainTimetable } from './trainTimetable';
import { TrainType } from './trainType';

function toCalendar(raw: any): Calendar {
  return Calendar.build({
    dcDate: null || raw['dc:date'],
    owlSameAs: raw['owl:sameAs'],
    dcTitle: null || raw['dc:title'],
    odptCalendarTitle: null || raw['odpt:calendarTitle'],
    odptDay: null || raw['odpt:day'],
    odptDuration: null || raw['odpt:duration'],
  });
}

function toOperator(raw: any): Operator {
  return Operator.build({
    dcDate: null || raw['dc:date'],
    owlSameAs: raw['owl:sameAs'],
    dcTitle: null || raw['dc:title'],
    odptOperatorTitle: null || raw['odpt:operatorTitle'],
  });
}

function toRailDirection(raw: any): RailDirection {
  return RailDirection.build({
    dcDate: null || raw['dc:date'],
    owlSameAs: raw['owl:sameAs'],
    dcTitle: null || raw['dc:title'],
    odptRailDirectionTitle: null || raw['odpt:railDirectionTitle'],
  });
}

function toRailway(raw: any): Railway {
  return Railway.build({
    dcDate: raw['dc:date'],
    owlSameAs: raw['owl:sameAs'],
    dcTitle: raw['dc:title'],
    odptRailwayTitle: null || raw['odpt:railwayTitle'],
    odptKana: null || raw['odpt:kana'],
    odptOperator: null || raw['odpt:operator'],
    odptLineCode: null || raw['odpt:lineCode'],
    odptColor: null || raw['odpt:color'],
    odptAscendingRailDirection: null || raw['odpt:ascendingRailDirection'],
    odptDescendingRailDirection: null || raw['odpt:descendingRailDirection'],
    odptStationOrder: raw['odpt:stationOrder'].map((i: any) => ({
      odptStation: i['odpt:station'],
      odptStationTitle: undefined || i['odpt:stationTitle'],
      odptIndex: i['odpt:index'],
    })),
  });
}

function toRailwayFare(raw: any): RailwayFare {
  return RailwayFare.build({
    dcDate: raw['dc:date'],
    dctIssued: null || raw['dct:issued'],
    dctValid: null || raw['dct:valid'],
    owlSameAs: raw['owl:sameAs'],
    odptOperator: raw['odpt:operator'],
    odptFromStation: raw['odpt:fromStation'],
    odptToStation: raw['odpt:toStation'],
    odptTicketFare: raw['odpt:ticketFare'],
    odptIcCardFare: null || raw['odpt:icCardFare'],
    odptChildTicketFare: null || raw['odpt:childTicketFare'],
    odptChildIcCardFare: null || raw['odpt:childIcCardFare'],
    odptViaStation: null || raw['odpt:viaStation'],
    odptTicketType: null || raw['odpt:ticketType'],
    odptPaymentMethod: null || raw['odpt:paymentMethod'],
  });
}

function toStation(raw: any): Station {
  return Station.build({
    dcDate: raw['dc:date'],
    owlSameAs: raw['owl:sameAs'],
    dcTitle: null || raw['dc:title'],
    odptStationTitle: null || raw['odpt:stationTitle'],
    odptOperator: raw['odpt:operator'],
    odptRailway: raw['odpt:railway'],
    odptStationCode: null || raw['odpt:stationCode'],
    geoLong: null || raw['geo:long'],
    geoLat: null || raw['geo:lat'],
    odptExit: null || raw['odpt:exit'],
    odptConnectingRailway: null || raw['odpt:connectingRailway'],
    odptConnectingStation: null,
    odptStationTimetable: null || raw['odpt:stationTimetable'],
  });
}

function toStationTimetable(raw: any): StationTimetable {
  return StationTimetable.build({
    dcDate: raw['dc:date'],
    dctIssued: null || raw['dct:issued'],
    dctValid: null || raw['dct:valid'],
    owlSameAs: raw['owl:sameAs'],
    odptOperator: raw['odpt:operator'],
    odptRailway: raw['odpt:railway'],
    odptRailwayTitle: null || raw['odpt:railwayTitle'],
    odptStation: raw['odpt:station'],
    odptStationTitle: null || raw['odpt:stationTitle'],
    odptRailDirection: null || raw['odpt:railDirection'],
    odptCalendar: null || raw['odpt:calendar'],
    odptStationTimetableObject: raw['odpt:stationTimetableObject'].map(
      (i: any) => ({
        odptArrivalTime: i['odpt:arrivalTime'],
        odptDepartureTime: i['odpt:departureTime'],
        odptOriginStation: i['odpt:originStation'],
        odptDestinationStation: i['odpt:destinationStation'],
        odptViaStation: i['odpt:viaStation'],
        odptViaRailway: i['odpt:viaRailway'],
        odptTrain: i['odpt:train'],
        odptTrainNumber: i['odpt:trainNumber'],
        odptTrainType: i['odpt:trainType'],
        odptTrainName: i['odpt:trainName'],
        odptTrainOwner: i['odpt:trainOwner'],
        odptIsLast: i['odpt:isLast'],
        odptIsOrigin: i['odpt:isOrigin'],
        odptPlatformNumber: i['odpt:platformNumber'],
        odptCarCompositions: i['odpt:carCompositions'],
        odptNote: i['odpt:note'],
      })
    ),
    odptNote: null || raw['odpt:note'],
  });
}

function toTrainTimetable(raw: any): TrainTimetable {
  return TrainTimetable.build({
    dcDate: raw['dc:date'],
    dctIssued: null || raw['dct:issued'],
    dctValid: null || raw['dct:valid'],
    owlSameAs: raw['owl:sameAs'],
    odptOperator: raw['odpt:operator'],
    odptRailway: raw['odpt:railway'],
    odptRailDirection: null || raw['odpt:railDirection'],
    odptCalendar: null || raw['odpt:calendar'],
    odptTrain: null || raw['odpt:train'],
    odptTrainNumber: raw['odpt:trainNumber'],
    odptTrainType: null || raw['odpt:trainType'],
    odptTrainName: null || raw['odpt:trainName'],
    odptTrainOwner: null || raw['odpt:trainOwner'],
    odptOriginStation: null || raw['odpt:originStation'],
    odptDestinationStation: null || raw['odpt:destinationStation'],
    odptViaStation: null || raw['odpt:viaStation'],
    odptViaRailway: null || raw['odpt:viaRailway'],
    odptPreviousTrainTimetable: null || raw['odpt:previousTrainTimetable'],
    odptNextTrainTimetable: null || raw['odpt:nextTrainTimetable'],
    odptTrainTimetableObject: raw['odpt:trainTimetableObject'].map(
      (i: any) => ({
        odptArrivalTime: i['odpt:arrivalTime'],
        odptArrivalStation: i['odpt:arrivalStation'],
        odptDepartureTime: i['odpt:departureTime'],
        odptDepartureStation: i['odpt:departureStation'],
        odptPlatformNumber: i['odpt:platformNumber'],
        odptPlatformName: i['odpt:platformName'],
        odptNote: i['odpt:note'],
      })
    ),
    odptNeedExtraFee: null || raw['odpt:needExtraFee'],
    odptNote: null || raw['odpt:note'],
  });
}

function toTrainType(raw: any): TrainType {
  return TrainType.build({
    dcDate: null || raw['dc:date'],
    owlSameAs: raw['owl:sameAs'],
    odptOperator: raw['odpt:operator'],
    dcTitle: null || raw['dc:title'],
    odptTrainTypeTitle: null || raw['odpt:trainTypeTitle'],
  });
}

function toFlightInformationDeparture(raw: any): FlightInformationDeparture {
  return new FlightInformationDeparture({
    owlSameAs: raw['owl:sameAs'],
    odptOperator: raw['odpt:operator'],
    odptAirline: raw['odpt:airline'],
    odptFlightNumber: raw['odpt:flightNumber'],
    odptFlightStatus: raw['odpt:flightStatus'],
    odptFlightInformationSummary: raw['odpt:flightInformationSummary'],
    odptFlightInformationText: raw['odpt:flightInformationText'],
    odptScheduledDepartureTime: raw['odpt:scheduledDepartureTime'],
    odptEstimatedDepartureTime: raw['odpt:estimatedDepartureTime'],
    odptActualDepartureTime: raw['odpt:actualDepartureTime'],
    odptDepartureAirport: raw['odpt:departureAirport'],
    odptDepartureAirportTerminal: raw['odpt:departureAirportTerminal'],
    odptDepartureGate: raw['odpt:departureGate'],
    odptCheckInCounter: raw['odpt:checkInCounter'],
    odptDestinationAirport: raw['odpt:destinationAirport'],
    odptViaAirport: raw['odpt:viaAirport'],
    odptAircraftType: raw['odpt:aircraftType'],
  });
}

export default {
  toCalendar,
  toOperator,
  toRailDirection,
  toRailway,
  toRailwayFare,
  toStation,
  toStationTimetable,
  toTrainTimetable,
  toTrainType,
  toFlightInformationDeparture,
};
