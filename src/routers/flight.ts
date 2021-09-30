import express from 'express';
import 'dotenv/config';
import axios from 'axios';

const flightRouter = express.Router();

// interface Info {
//   id: string;
//   title: string;
// }

// interface DepartureInformationItem {
//   id: string;
//   operator: Info;
//   airline?: Info;
//   flightNumber: string[];
//   flightStatus?: Info;
//   flightInformationSummary?: object;
//   flightInformationText?: object;
//   scheduledDepartureTime?: string;
//   estimatedDepartureTime?: string;
//   actualDepartureTime?: string;
//   departureAirport: Info;
//   departureAirportTerminal?: Info;
//   departureGate?: string;
//   checkInCounter?: string[];
//   destinationAirport?: Info;
//   viaAirport?: Info[];
//   aircraftType?: string;
// }

flightRouter.get('/departureInformation/NRT', async (req, res) => {
  const { status, data } = await axios.get(
    'https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightInformationDeparture',
    {
      params: {
        'odpt:operator': 'odpt.Operator:NAA',
        'acl:consumerKey': process.env.API_KEY,
      },
    }
  );
  if (status === 200) {
    // const informationList = (data as any[]).map((i) =>
    //   odptAdapter.toFlightInformationDeparture(i)
    // );
    // const response: DepartureInformationItem[] = [];
    res.send(data);
  } else {
    res.sendStatus(500);
  }
});

export default flightRouter;
