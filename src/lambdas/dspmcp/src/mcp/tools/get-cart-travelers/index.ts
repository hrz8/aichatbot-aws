import type { McpOpenAPIToolDefinition } from '../types.js';

import { serializeGetCartTravelersResponse } from './serializer.js';
import { GetCartTravelersSchema } from './schema.js';

export const getCartTravelersTool: McpOpenAPIToolDefinition = {
  type: 'openapi',
  enabled: true,
  name: 'get_cart_travelers',
  description: `Retrieve all travelers from a shopping cart with complete information. Returns array of travelers with: traveler IDs (needed for updates), passenger types (ADT/CHD/INF), names, personal info (DOB, gender, nationality), passport details (document number, expiry, issuing country), frequent flyer cards (airline, number, tier), and infant-adult associations. Use this to: view travelers after cart creation, get traveler IDs before updates, verify traveler data before payment, or troubleshoot traveler issues. PREREQUISITES: Requires valid cartId from create_cart and session-token from initialize_booking_session. WORKFLOW: Call after create_cart to see travelers, before update_cart_traveler to get IDs, or before payment to verify data. RESPONSE: Returns travelers array with complete information including IDs for use in update_cart_traveler.`,
  inputSchema: GetCartTravelersSchema,
  method: 'get',
  pathTemplate: '/carts/{cartId}/travelers',
  executionParameters: [
    {
      name: 'cartId',
      in: 'path',
    },
    {
      name: 'session-token',
      in: 'header',
    },
  ],
  securityRequirements: [
    {
      HeaderApiToken: [],
      HeaderApimSubscriptionKey: [],
      HeaderApiVersion: [],
    },
  ],
  serializer: serializeGetCartTravelersResponse,
};
