interface FlightInformationArrivalInterface {
  dcDate: string;
  dctValid?: string;
  owlSameAs: string;
  odptOperator: string;
  odptAirline?: string;
  odptFlightNumber: string[];
  odptFlightStatus?: string;
  odptFlightInformationSummary?: object;
  odptFlightInformationText?: object;
  odptScheduledArrivalTime?: string;
  odptEstimatedArrivalTime?: string;
  odptActualArrivalTime?: string;
  odptArrivalAirport: string;
  odptArrivalAirportTerminal?: string;
  odptArrivalGate?: string;
  odptBaggageClaim?: string[];
  odptOriginAirport?: string;
  odptViaAirport?: string[];
  odptAircraftType?: string;
}

export class FlightInformationArrival {
  dcDate!: string;

  dctValid?: string;

  owlSameAs: string;

  odptOperator: string;

  odptAirline?: string;

  odptFlightNumber: string[];

  odptFlightStatus?: string;

  odptFlightInformationSummary?: object;

  odptFlightInformationText?: object;

  odptScheduledArrivalTime?: string;

  odptEstimatedArrivalTime?: string;

  odptActualArrivalTime?: string;

  odptArrivalAirport: string;

  odptArrivalAirportTerminal?: string;

  odptArrivalGate?: string;

  odptBaggageClaim?: string[];

  odptOriginAirport?: string;

  odptViaAirport?: string[];

  odptAircraftType?: string;

  constructor(arg: FlightInformationArrivalInterface) {
    this.dcDate = arg.dcDate;
    this.dctValid = arg.dctValid;
    this.owlSameAs = arg.owlSameAs;
    this.odptOperator = arg.odptOperator;
    this.odptAirline = arg.odptAirline;
    this.odptFlightNumber = arg.odptFlightNumber;
    this.odptFlightStatus = arg.odptFlightStatus;
    this.odptFlightInformationSummary = arg.odptFlightInformationSummary;
    this.odptFlightInformationText = arg.odptFlightInformationText;
    this.odptScheduledArrivalTime = arg.odptScheduledArrivalTime;
    this.odptEstimatedArrivalTime = arg.odptEstimatedArrivalTime;
    this.odptActualArrivalTime = arg.odptActualArrivalTime;
    this.odptArrivalAirport = arg.odptArrivalAirport;
    this.odptArrivalAirportTerminal = arg.odptArrivalAirportTerminal;
    this.odptArrivalGate = arg.odptArrivalGate;
    this.odptBaggageClaim = arg.odptBaggageClaim;
    this.odptOriginAirport = arg.odptOriginAirport;
    this.odptViaAirport = arg.odptViaAirport;
    this.odptAircraftType = arg.odptAircraftType;
  }
}
