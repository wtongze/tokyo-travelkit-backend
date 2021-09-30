import express from 'express';
import 'dotenv/config';
import axios from 'axios';
import odptAdapter from '../models/odptAdapter';
import { Operator } from '../models/operator';
import { MultiLangObject } from '../models/common';
import { Airport } from '../models/airport';
import { FlightStatus } from '../models/flightStatus';
import { AirportTerminal } from '../models/airportTerminal';

const flightRouter = express.Router();

interface Info {
  id: string;
  title: MultiLangObject | null;
}

interface DepartureInformationItem {
  dcDate: string;
  dctValid?: string;
  id: string;
  operator: Info;
  airline?: Info;
  flightNumber: string[];
  flightStatus?: Info;
  flightInformationSummary?: object;
  flightInformationText?: object;
  scheduledDepartureTime?: string;
  estimatedDepartureTime?: string;
  actualDepartureTime?: string;
  departureAirport: Info;
  departureAirportTerminal?: Info;
  departureGate?: string;
  checkInCounter?: string[];
  destinationAirport?: Info;
  viaAirport?: Info[];
  aircraftType?: string;
}

interface ArrivalInformationItem {
  dcDate: string;
  dctValid?: string;
  id: string;
  operator: Info;
  airline?: Info;
  flightNumber: string[];
  flightStatus?: Info;
  flightInformationSummary?: object;
  flightInformationText?: object;
  scheduledArrivalTime?: string;
  estimatedArrivalTime?: string;
  actualArrivalTime?: string;
  arrivalAirport: Info;
  arrivalAirportTerminal?: Info;
  arrivalGate?: string;
  baggageClaim?: string[];
  originAirport?: Info;
  viaAirport?: Info[];
  aircraftType?: string;
}

flightRouter.get('/departure-information/:airport', async (req, res) => {
  const { terminal: terminalRaw = null } = req.query;
  const { airport } = req.params;
  let rawData: any[] = [];
  if (airport === 'NRT') {
    let terminal = {};
    switch (terminalRaw) {
      case '1':
        terminal = {
          'odpt:departureAirportTerminal': 'odpt.AirportTerminal:NRT.Terminal1',
        };
        break;
      case '2':
        terminal = {
          'odpt:departureAirportTerminal': 'odpt.AirportTerminal:NRT.Terminal2',
        };
        break;
      case '3':
        terminal = {
          'odpt:departureAirportTerminal': 'odpt.AirportTerminal:NRT.Terminal3',
        };
        break;
      default:
        break;
    }
    const { status, data } = await axios.get<any[]>(
      'https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightInformationDeparture',
      {
        params: {
          'odpt:operator': 'odpt.Operator:NAA',
          'acl:consumerKey': process.env.API_KEY,
          ...terminal,
        },
      }
    );
    if (status === 200) {
      rawData = data;
    } else {
      res.sendStatus(500);
    }
  } else if (airport === 'HND') {
    let terminal = {};
    switch (terminalRaw) {
      case '1.NorthWing':
        terminal = {
          'odpt:departureAirportTerminal':
            'odpt.AirportTerminal:HND.Terminal1.NorthWing',
        };
        break;
      case '1.SouthWing':
        terminal = {
          'odpt:departureAirportTerminal':
            'odpt.AirportTerminal:HND.Terminal1.SouthWing',
        };
        break;
      case '1':
        terminal = {
          'odpt:departureAirportTerminal': 'odpt.AirportTerminal:HND.Terminal1',
        };
        break;
      case '2':
        terminal = {
          'odpt:departureAirportTerminal': 'odpt.AirportTerminal:HND.Terminal2',
        };
        break;
      case '3':
        terminal = {
          'odpt:departureAirportTerminal': 'odpt.AirportTerminal:HND.Terminal3',
        };
        break;
      default:
        break;
    }
    const { status, data } = await axios.get<any[]>(
      'https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightInformationDeparture',
      {
        params: {
          'odpt:operator': 'odpt.Operator:HND-JAT',
          'acl:consumerKey': process.env.API_KEY,
          ...terminal,
        },
      }
    );
    const { status: status2, data: data2 } = await axios.get<any[]>(
      'https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightInformationDeparture',
      {
        params: {
          'odpt:operator': 'odpt.Operator:HND-TIAT',
          'acl:consumerKey': process.env.API_KEY,
          ...terminal,
        },
      }
    );
    if (status === 200 && status2 === 200) {
      rawData = [...data, ...data2];
    } else {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }

  if (airport === 'HND' || airport === 'NRT') {
    try {
      const informationList = (rawData as any[]).map((i) =>
        odptAdapter.toFlightInformationDeparture(i)
      );
      const response: DepartureInformationItem[] = [];
      for (const flight of informationList) {
        const airlineObj = await Operator.findByPk(flight.odptAirline);
        const airline =
          flight.odptAirline && airlineObj
            ? {
                id: flight.odptAirline,
                title: airlineObj.odptOperatorTitle,
              }
            : undefined;
        const flightStatusObj = await FlightStatus.findByPk(
          flight.odptFlightStatus
        );
        const flightStatus =
          flight.odptFlightStatus && flightStatusObj
            ? {
                id: flight.odptFlightStatus,
                title: flightStatusObj.odptFlightStatusTitle,
              }
            : undefined;
        const departureAirportTerminalObj = await AirportTerminal.findByPk(
          flight.odptDepartureAirportTerminal
        );
        const departureAirportTerminal =
          flight.odptDepartureAirportTerminal && departureAirportTerminalObj
            ? {
                id: flight.odptDepartureAirportTerminal,
                title: departureAirportTerminalObj.odptAirportTerminalTitle,
              }
            : undefined;
        const destinationAirportObj = await Airport.findByPk(
          flight.odptDestinationAirport
        );
        const destinationAirport =
          flight.odptDestinationAirport && destinationAirportObj
            ? {
                id: flight.odptDestinationAirport,
                title: destinationAirportObj.odptAirportTitle,
              }
            : undefined;

        const viaAirport: Info[] = [];
        if (flight.odptViaAirport) {
          for (const viaAirportId of flight.odptViaAirport) {
            const airportObj = await Airport.findByPk(viaAirportId);
            if (airportObj && airportObj.odptAirportTitle) {
              viaAirport.push({
                id: viaAirportId,
                title: airportObj.odptAirportTitle,
              });
            } else {
              viaAirport.push({
                id: viaAirportId,
                title: null,
              });
            }
          }
        }

        response.push({
          dcDate: flight.dcDate,
          dctValid: flight.dctValid,
          id: flight.owlSameAs,
          operator: {
            id: flight.odptOperator,
            title: (await Operator.findByPk(flight.odptOperator))!
              .odptOperatorTitle,
          },
          airline,
          flightNumber: flight.odptFlightNumber,
          flightStatus,
          flightInformationSummary: flight.odptFlightInformationSummary,
          flightInformationText: flight.odptFlightInformationText,
          scheduledDepartureTime: flight.odptScheduledDepartureTime,
          estimatedDepartureTime: flight.odptEstimatedDepartureTime,
          actualDepartureTime: flight.odptActualDepartureTime,
          departureAirport: {
            id: flight.odptDepartureAirport,
            title: (await Airport.findByPk(flight.odptDepartureAirport))!
              .odptAirportTitle,
          },
          departureAirportTerminal,
          departureGate: flight.odptDepartureGate,
          checkInCounter: flight.odptCheckInCounter,
          destinationAirport,
          viaAirport: flight.odptViaAirport ? viaAirport : undefined,
          aircraftType: flight.odptAircraftType,
        });
      }
      res.send(response);
    } catch (error) {
      res.sendStatus(500);
    }
  }
});

flightRouter.get('/arrival-information/:airport', async (req, res) => {
  const { terminal: terminalRaw = null } = req.query;
  const { airport } = req.params;
  let rawData: any[] = [];
  if (airport === 'NRT') {
    let terminal = {};
    switch (terminalRaw) {
      case '1':
        terminal = {
          'odpt:arrivalAirportTerminal': 'odpt.AirportTerminal:NRT.Terminal1',
        };
        break;
      case '2':
        terminal = {
          'odpt:arrivalAirportTerminal': 'odpt.AirportTerminal:NRT.Terminal2',
        };
        break;
      case '3':
        terminal = {
          'odpt:arrivalAirportTerminal': 'odpt.AirportTerminal:NRT.Terminal3',
        };
        break;
      default:
        break;
    }
    const { status, data } = await axios.get<any[]>(
      'https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightInformationArrival',
      {
        params: {
          'odpt:operator': 'odpt.Operator:NAA',
          'acl:consumerKey': process.env.API_KEY,
          ...terminal,
        },
      }
    );
    if (status === 200) {
      rawData = data;
    } else {
      res.sendStatus(500);
    }
  } else if (airport === 'HND') {
    let terminal = {};
    switch (terminalRaw) {
      case '1.NorthWing':
        terminal = {
          'odpt:arrivalAirportTerminal':
            'odpt.AirportTerminal:HND.Terminal1.NorthWing',
        };
        break;
      case '1.SouthWing':
        terminal = {
          'odpt:arrivalAirportTerminal':
            'odpt.AirportTerminal:HND.Terminal1.SouthWing',
        };
        break;
      case '1':
        terminal = {
          'odpt:arrivalAirportTerminal': 'odpt.AirportTerminal:HND.Terminal1',
        };
        break;
      case '2':
        terminal = {
          'odpt:arrivalAirportTerminal': 'odpt.AirportTerminal:HND.Terminal2',
        };
        break;
      case '3':
        terminal = {
          'odpt:arrivalAirportTerminal': 'odpt.AirportTerminal:HND.Terminal3',
        };
        break;
      default:
        break;
    }
    const { status, data } = await axios.get<any[]>(
      'https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightInformationArrival',
      {
        params: {
          'odpt:operator': 'odpt.Operator:HND-JAT',
          'acl:consumerKey': process.env.API_KEY,
          ...terminal,
        },
      }
    );
    const { status: status2, data: data2 } = await axios.get<any[]>(
      'https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightInformationArrival',
      {
        params: {
          'odpt:operator': 'odpt.Operator:HND-TIAT',
          'acl:consumerKey': process.env.API_KEY,
          ...terminal,
        },
      }
    );
    if (status === 200 && status2 === 200) {
      rawData = [...data, ...data2];
    } else {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }

  if (airport === 'HND' || airport === 'NRT') {
    try {
      const informationList = (rawData as any[]).map((i) =>
        odptAdapter.toFlightInformationArrival(i)
      );
      const response: ArrivalInformationItem[] = [];
      for (const flight of informationList) {
        const airlineObj = await Operator.findByPk(flight.odptAirline);
        const airline =
          flight.odptAirline && airlineObj
            ? {
                id: flight.odptAirline,
                title: airlineObj.odptOperatorTitle,
              }
            : undefined;
        const flightStatusObj = await FlightStatus.findByPk(
          flight.odptFlightStatus
        );
        const flightStatus =
          flight.odptFlightStatus && flightStatusObj
            ? {
                id: flight.odptFlightStatus,
                title: flightStatusObj.odptFlightStatusTitle,
              }
            : undefined;
        const arrivalAirportTerminalObj = await AirportTerminal.findByPk(
          flight.odptArrivalAirportTerminal
        );
        const arrivalAirportTerminal =
          flight.odptArrivalAirportTerminal && arrivalAirportTerminalObj
            ? {
                id: flight.odptArrivalAirportTerminal,
                title: arrivalAirportTerminalObj.odptAirportTerminalTitle,
              }
            : undefined;
        const originAirportObj = await Airport.findByPk(
          flight.odptOriginAirport
        );
        const originAirport =
          flight.odptOriginAirport && originAirportObj
            ? {
                id: flight.odptOriginAirport,
                title: originAirportObj.odptAirportTitle,
              }
            : undefined;

        const viaAirport: Info[] = [];
        if (flight.odptViaAirport) {
          for (const viaAirportId of flight.odptViaAirport) {
            const airportObj = await Airport.findByPk(viaAirportId);
            if (airportObj && airportObj.odptAirportTitle) {
              viaAirport.push({
                id: viaAirportId,
                title: airportObj.odptAirportTitle,
              });
            } else {
              viaAirport.push({
                id: viaAirportId,
                title: null,
              });
            }
          }
        }

        response.push({
          dcDate: flight.dcDate,
          dctValid: flight.dctValid,
          id: flight.owlSameAs,
          operator: {
            id: flight.odptOperator,
            title: (await Operator.findByPk(flight.odptOperator))!
              .odptOperatorTitle,
          },
          airline,
          flightNumber: flight.odptFlightNumber,
          flightStatus,
          flightInformationSummary: flight.odptFlightInformationSummary,
          flightInformationText: flight.odptFlightInformationText,
          scheduledArrivalTime: flight.odptScheduledArrivalTime,
          estimatedArrivalTime: flight.odptEstimatedArrivalTime,
          actualArrivalTime: flight.odptActualArrivalTime,
          arrivalAirport: {
            id: flight.odptArrivalAirport,
            title: (await Airport.findByPk(flight.odptArrivalAirport))!
              .odptAirportTitle,
          },
          arrivalAirportTerminal,
          arrivalGate: flight.odptArrivalGate,
          baggageClaim: flight.odptBaggageClaim,
          originAirport,
          viaAirport: flight.odptViaAirport ? viaAirport : undefined,
          aircraftType: flight.odptAircraftType,
        });
      }
      res.send(response);
    } catch (error) {
      res.sendStatus(500);
    }
  }
});

flightRouter.get(
  '/departure-flight-information/:flightId',
  async (req, res) => {
    const { flightId } = req.params;
    if (flightId) {
      const { status, data } = await axios.get<any[]>(
        'https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightInformationDeparture',
        {
          params: {
            'owl:sameAs': flightId,
            'acl:consumerKey': process.env.API_KEY,
          },
        }
      );
      if (status === 200 && data.length === 1) {
        const flight = odptAdapter.toFlightInformationDeparture(data[0]);
        const airlineObj = await Operator.findByPk(flight.odptAirline);
        const airline =
          flight.odptAirline && airlineObj
            ? {
                id: flight.odptAirline,
                title: airlineObj.odptOperatorTitle,
              }
            : undefined;
        const flightStatusObj = await FlightStatus.findByPk(
          flight.odptFlightStatus
        );
        const flightStatus =
          flight.odptFlightStatus && flightStatusObj
            ? {
                id: flight.odptFlightStatus,
                title: flightStatusObj.odptFlightStatusTitle,
              }
            : undefined;
        const departureAirportTerminalObj = await AirportTerminal.findByPk(
          flight.odptDepartureAirportTerminal
        );
        const departureAirportTerminal =
          flight.odptDepartureAirportTerminal && departureAirportTerminalObj
            ? {
                id: flight.odptDepartureAirportTerminal,
                title: departureAirportTerminalObj.odptAirportTerminalTitle,
              }
            : undefined;
        const destinationAirportObj = await Airport.findByPk(
          flight.odptDestinationAirport
        );
        const destinationAirport =
          flight.odptDestinationAirport && destinationAirportObj
            ? {
                id: flight.odptDestinationAirport,
                title: destinationAirportObj.odptAirportTitle,
              }
            : undefined;

        const viaAirport: Info[] = [];
        if (flight.odptViaAirport) {
          for (const viaAirportId of flight.odptViaAirport) {
            const airportObj = await Airport.findByPk(viaAirportId);
            if (airportObj && airportObj.odptAirportTitle) {
              viaAirport.push({
                id: viaAirportId,
                title: airportObj.odptAirportTitle,
              });
            } else {
              viaAirport.push({
                id: viaAirportId,
                title: null,
              });
            }
          }
        }

        const response: DepartureInformationItem = {
          dcDate: flight.dcDate,
          dctValid: flight.dctValid,
          id: flight.owlSameAs,
          operator: {
            id: flight.odptOperator,
            title: (await Operator.findByPk(flight.odptOperator))!
              .odptOperatorTitle,
          },
          airline,
          flightNumber: flight.odptFlightNumber,
          flightStatus,
          flightInformationSummary: flight.odptFlightInformationSummary,
          flightInformationText: flight.odptFlightInformationText,
          scheduledDepartureTime: flight.odptScheduledDepartureTime,
          estimatedDepartureTime: flight.odptEstimatedDepartureTime,
          actualDepartureTime: flight.odptActualDepartureTime,
          departureAirport: {
            id: flight.odptDepartureAirport,
            title: (await Airport.findByPk(flight.odptDepartureAirport))!
              .odptAirportTitle,
          },
          departureAirportTerminal,
          departureGate: flight.odptDepartureGate,
          checkInCounter: flight.odptCheckInCounter,
          destinationAirport,
          viaAirport: flight.odptViaAirport ? viaAirport : undefined,
          aircraftType: flight.odptAircraftType,
        };

        res.send(response);
      } else {
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(404);
    }
  }
);

flightRouter.get('/arrival-flight-information/:flightId', async (req, res) => {
  const { flightId } = req.params;
  if (flightId) {
    const { status, data } = await axios.get<any[]>(
      'https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightInformationArrival',
      {
        params: {
          'owl:sameAs': flightId,
          'acl:consumerKey': process.env.API_KEY,
        },
      }
    );
    if (status === 200 && data.length === 1) {
      const flight = odptAdapter.toFlightInformationArrival(data[0]);
      const airlineObj = await Operator.findByPk(flight.odptAirline);
      const airline =
        flight.odptAirline && airlineObj
          ? {
              id: flight.odptAirline,
              title: airlineObj.odptOperatorTitle,
            }
          : undefined;
      const flightStatusObj = await FlightStatus.findByPk(
        flight.odptFlightStatus
      );
      const flightStatus =
        flight.odptFlightStatus && flightStatusObj
          ? {
              id: flight.odptFlightStatus,
              title: flightStatusObj.odptFlightStatusTitle,
            }
          : undefined;
      const arrivalAirportTerminalObj = await AirportTerminal.findByPk(
        flight.odptArrivalAirportTerminal
      );
      const arrivalAirportTerminal =
        flight.odptArrivalAirportTerminal && arrivalAirportTerminalObj
          ? {
              id: flight.odptArrivalAirportTerminal,
              title: arrivalAirportTerminalObj.odptAirportTerminalTitle,
            }
          : undefined;
      const originAirportObj = await Airport.findByPk(flight.odptOriginAirport);
      const originAirport =
        flight.odptOriginAirport && originAirportObj
          ? {
              id: flight.odptOriginAirport,
              title: originAirportObj.odptAirportTitle,
            }
          : undefined;

      const viaAirport: Info[] = [];
      if (flight.odptViaAirport) {
        for (const viaAirportId of flight.odptViaAirport) {
          const airportObj = await Airport.findByPk(viaAirportId);
          if (airportObj && airportObj.odptAirportTitle) {
            viaAirport.push({
              id: viaAirportId,
              title: airportObj.odptAirportTitle,
            });
          } else {
            viaAirport.push({
              id: viaAirportId,
              title: null,
            });
          }
        }
      }

      const response = {
        dcDate: flight.dcDate,
        dctValid: flight.dctValid,
        id: flight.owlSameAs,
        operator: {
          id: flight.odptOperator,
          title: (await Operator.findByPk(flight.odptOperator))!
            .odptOperatorTitle,
        },
        airline,
        flightNumber: flight.odptFlightNumber,
        flightStatus,
        flightInformationSummary: flight.odptFlightInformationSummary,
        flightInformationText: flight.odptFlightInformationText,
        scheduledArrivalTime: flight.odptScheduledArrivalTime,
        estimatedArrivalTime: flight.odptEstimatedArrivalTime,
        actualArrivalTime: flight.odptActualArrivalTime,
        arrivalAirport: {
          id: flight.odptArrivalAirport,
          title: (await Airport.findByPk(flight.odptArrivalAirport))!
            .odptAirportTitle,
        },
        arrivalAirportTerminal,
        arrivalGate: flight.odptArrivalGate,
        baggageClaim: flight.odptBaggageClaim,
        originAirport,
        viaAirport: flight.odptViaAirport ? viaAirport : undefined,
        aircraftType: flight.odptAircraftType,
      };

      res.send(response);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
});

export default flightRouter;
