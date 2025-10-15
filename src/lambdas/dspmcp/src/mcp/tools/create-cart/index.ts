import type { McpOpenAPIToolDefinition } from '../types.js';

import { serializeCreateCartResponse } from './serializer.js';
import { CreateCartSchema } from './schema.js';

export const createCartTool: McpOpenAPIToolDefinition = {
  type: 'openapi',
  enabled: true,
  name: 'create_cart',
  description: `Create a shopping cart with selected flight options. PREREQUISITES: Must call 'initialize_booking_session' first, then 'search_flights' to get available flight options. This endpoint adds the customer's selected flights (identified by airBoundIds from search results) to a cart for booking. The cart validates selections, checks availability, and calculates final pricing. WORKFLOW POSITION: Step 3 of the booking flow (after initialization and search, before passenger details and payment). RESPONSE: Returns a cartId which is required for subsequent booking operations. IMPORTANT: All airBoundIds must come from the most recent search_flights response within the same session.`,
  inputSchema: CreateCartSchema,
  method: 'post',
  pathTemplate: '/carts',
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
  serializer: serializeCreateCartResponse,
};
