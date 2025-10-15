/**
 * Type definitions for search-flights tool
 */

export interface FlightDetails {
  flightDesignator: {
    marketing: {
      airlineCode: string;
      airlineName: string;
      flightNumber: string;
    };
    operating: {
      airlineCode: string;
      airlineName: string;
    };
  };
  departure: {
    locationCode: string;
    dateTime: string;
    terminal?: string;
  };
  arrival: {
    locationCode: string;
    dateTime: string;
    terminal?: string;
  };
  aircraftCode: string;
  aircraftName: string;
  duration: number;
}

export interface LocationDetails {
  type: string;
  cityCode: string;
  cityName: string;
  airportName: string;
  countryCode: string;
}

export interface FareFamily {
  hierarchy: number;
  commercialFareFamily: string;
  cabin: string;
}

export interface CurrencyDetails {
  decimalPlaces: number;
  name: string;
}

export interface FlightSearchResponse {
  data: {
    airBoundGroups: AirBoundGroup[];
  };
  dictionaries: {
    fareFamilyWithServices: Record<string, FareFamily>;
    airline: Record<string, string>;
    flight: Record<string, FlightDetails>;
    location: Record<string, LocationDetails>;
    currency: Record<string, CurrencyDetails>;
    aircraft: Record<string, string>;
  };
}

export interface CreateCartResponse {
  data: {
    cartId: string;
  };
  warnings?: Warning[];
  errors?: ErrorDetail[];
}

export interface AirBoundGroup {
  boundDetails: BoundDetails;
  airBounds: AirBound[];
}

export interface BoundDetails {
  origin: { airportCode: string };
  destination: { airportCode: string };
  duration: number;
  segments: Segment[];
  extraProperties?: any;
  isFastestBound?: boolean;
}

export interface Segment {
  flightId: string;
  arrivalDaysDifference?: number;
}

export interface AirBound {
  airBoundId: string;
  fareFamilyCode: string;
  prices: PriceDetails;
  availabilityDetails: AvailabilityDetail[];
  isCheapestOffer?: boolean;
  discountCode?: string;
  priceDifference?: number;
  extraProperties?: {
    isRecommended?: boolean;
    isPreSelect?: boolean;
    isSalesTagApplicable?: boolean;
  };
}

export interface PriceDetails {
  unitPrice: PriceBreakdown;
  totalPrice: PriceBreakdown;
}

export interface PriceBreakdown {
  original: MoneyAmount;
  discount?: MoneyAmount;
  base: number;
  total: number;
  taxes: Tax[];
  totalTaxes: number;
}

export interface MoneyAmount {
  currencyCode: string;
  amount: number;
}

export interface Tax {
  value: number;
  currencyCode: string;
  code: string;
}

export interface AvailabilityDetail {
  flightId: string;
  cabin: string;
  bookingClass: string;
  seatLeft?: number;
}

export interface Warning {
  code: number;
  message: string;
  details?: any;
}

export interface ErrorDetail {
  code: number;
  message: string;
  details?: any;
}
