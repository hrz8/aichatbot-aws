import { z } from 'zod';

const AirBoundId = z.string()
  .min(1)
  .describe('Unique identifier for a specific flight bound/segment returned from flight search results. Format: BC{number}-{number}-OFR-{digits}-{number}-{number}-{number}. Each airBoundId represents a distinct flight option (outbound or return) that the customer has selected. For one-way trips, provide one airBoundId. For round-trips, provide two airBoundIds (one for outbound, one for return).');

export const CreateCartSchema = z.object({
  'session-token': z.string()
    .min(1)
    .describe('Required authentication token obtained from the initialize_booking_session step. This token maintains the booking session context and must be included to create a cart. The token is returned in the response headers of the initialization call (look for "Session-Token" header).'),
  requestBody: z.object({
    airBoundIds: z.array(AirBoundId)
      .min(1)
      .max(10)
      .describe('List of selected flight bound identifiers to add to the shopping cart. These IDs come from the flight search results returned by search_flights. Each ID represents a flight segment the customer wants to book. For a one-way trip, include 1 airBoundId. For a round-trip, include 2 airBoundIds (outbound + return). For multi-city trips, include multiple airBoundIds in the order of travel. IMPORTANT: Only use airBoundIds that were returned in the most recent search_flights response for this session.'),
  }).describe('Cart creation request containing the selected flight options the customer wants to purchase.'),
}).describe('STEP 3: Create a shopping cart with selected flights. After searching for flights using search_flights, use this endpoint to add the customer\'s chosen flight options to a cart. The cart creation validates the selections and prepares them for booking. This step is required before proceeding to passenger details and payment.');
