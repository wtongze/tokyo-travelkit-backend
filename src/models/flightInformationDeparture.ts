interface FlightInformationDepartureInterface {
  dcDate: string;
  dctValid?: string;
  owlSameAs: string;
  odptOperator: string;
  odptAirline?: string;
  odptFlightNumber: string[];
  odptFlightStatus?: string;
  odptFlightInformationSummary?: object;
  odptFlightInformationText?: object;
  odptScheduledDepartureTime?: string;
  odptEstimatedDepartureTime?: string;
  odptActualDepartureTime?: string;
  odptDepartureAirport: string;
  odptDepartureAirportTerminal?: string;
  odptDepartureGate?: string;
  odptCheckInCounter?: string[];
  odptDestinationAirport?: string;
  odptViaAirport?: string[];
  odptAircraftType?: string;
}

export class FlightInformationDeparture {
  dcDate!: string;

  dctValid?: string;

  owlSameAs: string;

  odptOperator: string;

  odptAirline?: string;

  odptFlightNumber: string[];

  odptFlightStatus?: string;

  odptFlightInformationSummary?: object;

  odptFlightInformationText?: object;

  odptScheduledDepartureTime?: string;

  odptEstimatedDepartureTime?: string;

  odptActualDepartureTime?: string;

  odptDepartureAirport: string;

  odptDepartureAirportTerminal?: string;

  odptDepartureGate?: string;

  odptCheckInCounter?: string[];

  odptDestinationAirport?: string;

  odptViaAirport?: string[];

  odptAircraftType?: string;

  constructor(arg: FlightInformationDepartureInterface) {
    this.dcDate = arg.dcDate;
    this.dctValid = arg.dctValid;
    this.owlSameAs = arg.owlSameAs;
    this.odptOperator = arg.odptOperator;
    this.odptAirline = arg.odptAirline;
    this.odptFlightNumber = arg.odptFlightNumber;
    this.odptFlightStatus = arg.odptFlightStatus;
    this.odptFlightInformationSummary = arg.odptFlightInformationSummary;
    this.odptFlightInformationText = arg.odptFlightInformationText;
    this.odptScheduledDepartureTime = arg.odptScheduledDepartureTime;
    this.odptEstimatedDepartureTime = arg.odptEstimatedDepartureTime;
    this.odptActualDepartureTime = arg.odptActualDepartureTime;
    this.odptDepartureAirport = arg.odptDepartureAirport;
    this.odptDepartureAirportTerminal = arg.odptDepartureAirportTerminal;
    this.odptDepartureGate = arg.odptDepartureGate;
    this.odptCheckInCounter = arg.odptCheckInCounter;
    this.odptDestinationAirport = arg.odptDestinationAirport;
    this.odptViaAirport = arg.odptViaAirport;
    this.odptAircraftType = arg.odptAircraftType;
  }
}
