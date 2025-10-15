import type { McpOpenAPIToolDefinition } from '../types.js';

import { serializeFlightSearchResponse } from './serializer.js';
import { FlightSearchSchema } from './schema.js';

export const searchFlightsTool: McpOpenAPIToolDefinition = {
  type: 'openapi',
  enabled: true,
  name: 'search_flights',
  description: `Search for available flights based on origin, destination, travel dates, and passenger counts. PREREQUISITES: Must call initialize_booking_session first to obtain session-token. REQUIRED PARAMETERS: originLocationCode (3-letter airport code), destinationLocationCode (3-letter airport code), departureDate (yyyy-mm-dd format), passengerCounts (adults, children, infants). OPTIONAL: returnDate for round-trips, cabinPreference (economy/business). RESPONSE: Returns flight options grouped by itinerary with airBoundIds needed for cart creation. Each option shows flight details (airline, flight number, departure/arrival times, duration), pricing by cabin class (economy, premium, business), and seat availability. IMPORTANT FOR USER PRESENTATION: When showing flight options to the user, format the list of airBounds as a markdown table with columns: AirBoundID, Cabin Class, Fare Family, Price, Booking Class, Seats Available. This makes it much easier for users to compare options. Use the airBoundId values when calling create_cart to select flights. WORKFLOW: After getting results, select desired airBoundIds and use create_cart to add them to a shopping cart.`,
  inputSchema: FlightSearchSchema,
  method: 'post',
  pathTemplate: '/flight-search/flights',
  executionParameters: [
    {
      name: 'session-token',
      in: 'header',
    },
  ],
  requestBodyContentType: 'application/json',
  securityRequirements: [
    {
      HeaderApiToken: [],
      HeaderApimSubscriptionKey: [],
      HeaderApiVersion: [],
    },
  ],
  serializer: serializeFlightSearchResponse,
};
