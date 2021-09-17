import 'dotenv/config';
import axios from 'axios';
import database from './database';
import odptAdapter from './models/odptAdapter';

(async () => {
  database.sync({ force: true });
  const { data: rawCalendars } = await axios.get(
    'https://api-tokyochallenge.odpt.org/api/v4/odpt:Calendar.json',
    {
      params: {
        'acl:consumerKey': process.env.API_KEY,
      },
    }
  );

  rawCalendars.forEach((rawCalendar: any) => {
    const calendar = odptAdapter.toCalendar(rawCalendar);
    calendar.save();
  });
})();
