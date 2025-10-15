import type { McpOpenAPIToolDefinition } from '../types.js';

import { serializeGetCartDetailsResponse } from './serializer.js';
import { GetCartDetailsSchema } from './schema.js';

export const getCartDetailsTool: McpOpenAPIToolDefinition = {
  type: 'openapi',
  enabled: true,
  name: 'get_cart_details',
  description: `Retrieve comprehensive cart information including travelers, flight offers, pricing, and contact details. Use this tool to view the complete state of a cart after creation or before proceeding to booking. The response includes detailed flight information with dictionaries for airlines, aircraft, locations, and currencies. PREREQUISITES: Requires a valid cartId from create_cart and an active session-token from initialize_booking_session. WORKFLOW: Use after create_cart to inspect cart contents, or before payment to verify all information is correct. RESPONSE: Returns travelers list, flight offers with pricing breakdown, contact information, and reference dictionaries.`,
  inputSchema: GetCartDetailsSchema,
  method: 'get',
  pathTemplate: '/carts/{cartId}',
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
  serializer: serializeGetCartDetailsResponse,
};
