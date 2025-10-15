/**
 * Shared type definitions for MCP tools
 * These types are reused across multiple tools to maintain consistency
 */

// ============================================================================
// Common ID Types
// ============================================================================

export type CartId = string; // Pattern: [a-zA-Z0-9]{16}
export type CartTravelerId = string; // Pattern: [a-zA-Z0-9-]{1,20}
export type CartContactId = string; // Pattern: [a-zA-Z0-9-]{1,20}
export type CurrencyCode = string; // Pattern: [A-Z]{3}
export type LocationCode = string; // Pattern: [A-Z]{3}

// ============================================================================
// Common Response Types
// ============================================================================

export interface ErrorDetail {
  code: number;
  message: string;
  details?: {
    fields?: Array<string | Record<string, string>>;
  };
}

export interface Warning {
  code: number;
  message: string;
  details?: any;
}

export interface CommonResponse {
  errors?: ErrorDetail[];
  warnings?: Warning[];
}

// ============================================================================
// Contact Types (Used in tools: add_cart_contact, get_cart_contacts, update_cart_contact)
// ============================================================================

export interface Phone {
  contactId?: CartContactId;
  countryPhoneExtension?: string;
  number?: string;
  addresseeName?: string;
  purpose?: string;
}

export interface Email {
  contactId?: CartContactId;
  address?: string;
  purpose?: string;
}

export interface Contacts {
  mainContact?: {
    phone?: Phone;
    email?: Email;
  };
  alternateContact?: {
    email?: Email;
  };
  emergencyContact?: Phone & {
    countryCode?: string;
  };
}

export interface TravelerContacts extends Contacts {
  travelerId?: CartTravelerId;
}

export interface TravelerContactResponse extends CommonResponse {
  data: TravelerContacts;
}

// ============================================================================
// Traveler Types (Used in tools: update_cart_traveler, get_cart_travelers)
// ============================================================================

export interface Name {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  title?: string;
}

export interface RegulatoryDetailPassport {
  id?: string;
  documentNumber?: string;
  expiryDate?: string;
  issuanceCountryCode?: string;
  nationalityCode?: string;
  dateOfBirth?: string;
  documentType?: string;
}

export interface FrequentFlyerCard {
  id?: string;
  companyCode?: string;
  cardNumber?: string;
  tierLevel?: string;
  tierLevelName?: string;
}

export interface CartTraveler {
  id?: CartTravelerId;
  accompanyingTravelerId?: CartTravelerId;
  passengerTypeCode: string;
  name?: Name;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'unspecified' | 'unknown';
  nationalityCode?: string;
  passport?: RegulatoryDetailPassport;
  frequentFlyerCard?: FrequentFlyerCard;
}

export interface GetCartTravelersResponse extends CommonResponse {
  data: {
    travelers: CartTraveler[];
  };
}

export interface UpdateCartTravelerResponse extends CommonResponse {
  data: CartTraveler;
}

// ============================================================================
// Cart Details Types (Used in tool: get_cart_details)
// ============================================================================

export interface FlightEndPoint {
  locationCode?: string;
  dateTime?: string;
  terminal?: string;
}

export interface FlightDesignatorDetails {
  airlineCode?: string;
  airlineName?: string;
  flightNumber?: string;
}

export interface FlightDesignator {
  marketing?: FlightDesignatorDetails;
  operating?: FlightDesignatorDetails;
}

export interface FlightBase {
  departure?: FlightEndPoint;
  arrival?: FlightEndPoint;
  aircraftCode?: string;
  aircraftName?: string;
  duration?: number;
  flightStatus?: string;
  suffix?: string;
}

export interface FlightStop {
  locationCode?: string;
  duration?: number;
  isChangeOfGauge?: boolean;
  arrivalDateTime?: string;
  departureDateTime?: string;
}

export interface Flight extends FlightBase {
  flightDesignator?: FlightDesignator;
  stops?: FlightStop[];
}

export interface Amount {
  value: number;
  currencyCode: CurrencyCode;
}

export interface Tax extends Amount {
  code?: string;
}

export interface Surcharge extends Amount {
  code?: string;
}

export interface Fee {
  value?: number;
  currencyCode: CurrencyCode;
  nature?: 'ticketing' | 'paymentCard' | 'requestedService';
}

export interface Discount {
  originalTotal?: number;
  originalBase?: number;
  originalTotalTaxes?: number;
  discountCode?: string;
}

export interface PriceWithDiscount {
  base?: number;
  total?: number;
  currencyCode?: CurrencyCode;
  taxes?: Tax[];
  totalTaxes?: number;
  surcharges?: Surcharge[];
  totalSurcharges?: number;
  fees?: Fee[];
  totalFees?: number;
  discount?: Discount;
}

export interface AirPricingRecords {
  unitPrices?: Array<{
    travelerIds?: CartTravelerId[];
    prices?: PriceWithDiscount[];
  }>;
  totalPrices?: PriceWithDiscount[];
}

export interface FlightItem {
  id?: string;
  cabin?: string;
  bookingClass?: string;
  fareFamilyCode?: string;
  statusCode?: string;
  departureDaysDifference?: number;
  arrivalDaysDifference?: number;
  connectionTime?: number;
}

export interface AirOfferAirBound {
  airBoundId?: string;
  originLocationCode?: string;
  destinationLocationCode?: string;
  flights?: FlightItem[];
  duration?: number;
}

export interface AirOfferItem {
  air?: {
    bounds?: AirOfferAirBound[];
  };
  prices?: AirPricingRecords;
}

export interface AirOffer {
  id?: string;
  offerItems?: AirOfferItem[];
}

export interface CartDetailsResponseData {
  id: CartId;
  travelers?: CartTraveler[];
  airOffers?: AirOffer[];
  contacts?: TravelerContacts;
}

export interface CartDetailsDictionary {
  aircraft?: Record<string, string>;
  flight?: Record<string, Flight>;
  currency?: Record<string, { name: string; decimalPlaces: number }>;
  location?: Record<string, any>;
  country?: Record<string, string>;
  airline?: Record<string, string>;
}

export interface CartDetailsResponse extends CommonResponse {
  data: CartDetailsResponseData;
  dictionaries?: CartDetailsDictionary;
}

// ============================================================================
// Create Cart Response (Already exists but including for completeness)
// ============================================================================

export interface CreateCartResponse extends CommonResponse {
  data: {
    cartId: CartId;
  };
}

// ============================================================================
// Order Types (Used in tools: create_order, get_order_details)
// ============================================================================

export type OrderId = string; // Pattern: [a-zA-Z0-9]{6}

export interface CreateOrderRequest {
  cartId: CartId;
  newsletterSubscription?: boolean;
  checkInFlow2faConsent?: boolean;
  previousOrderId?: OrderId;
  quickSignupOptIn?: boolean;
  lastName?: string;
}

export interface CreateOrderResponse extends CommonResponse {
  data: {
    orderId: OrderId;
    lastName: string;
    creationDateTime?: string;
    expirationDateTime?: string;
    paymentTimeLimit?: string;
  };
}

export interface OrderTraveler extends CartTraveler {
  id?: string; // OrderTravelerId
}

export interface RetrieveOrderDetails extends CommonResponse {
  data: {
    id: OrderId;
    lastName: string;
    creationDateTime?: string;
    lastModificationDateTime?: string;
    expirationDateTime?: string;
    paymentTimeLimit?: string;
    issuanceTimeLimit?: string;
    airBounds?: Array<{
      airBoundId?: string;
      originLocationCode?: string;
      destinationLocationCode?: string;
      departureDate?: string;
      flights?: FlightItem[];
      duration?: number;
    }>;
    travelers?: OrderTraveler[];
    prices?: {
      unitPrice?: any[];
      totalPrice?: any[];
    };
    services?: any[];
    seats?: any[];
    insurances?: any[];
    contacts?: TravelerContacts;
    remarks?: any[];
    specialKeywords?: any[];
    specialServiceRequests?: any[];
    bookingOptions?: {
      newsletterSubscription?: boolean;
      checkInFlow2faConsent?: boolean;
      quickSignupOptIn?: boolean;
    };
    travelDocuments?: any[];
    paymentRecords?: any[];
  };
}

export interface RetrieveOrderDetailsDictionary {
  dictionaries?: {
    flight?: Record<string, Flight>;
    currency?: Record<string, { name: string; decimalPlaces: number }>;
    location?: Record<string, any>;
    country?: Record<string, string>;
    airline?: Record<string, string>;
    aircraft?: Record<string, string>;
    discount?: Record<string, any>;
  };
}

export interface GetOrderDetailsResponse extends RetrieveOrderDetails {
  dictionaries?: RetrieveOrderDetailsDictionary['dictionaries'];
}
