import { Calendar } from './calendar';

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

export default {
  toCalendar,
};
