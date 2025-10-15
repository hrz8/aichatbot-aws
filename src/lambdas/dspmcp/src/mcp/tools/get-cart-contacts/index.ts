import type { McpOpenAPIToolDefinition } from '../types.js';

import { serializeGetCartContactsResponse } from './serializer.js';
import { GetCartContactsSchema } from './schema.js';

export const getCartContactsTool: McpOpenAPIToolDefinition = {
  type: 'openapi',
  enabled: true,
  name: 'get_cart_contacts',
  description: `Retrieve all contact information from a shopping cart. Returns main contact (email and phone), alternate contact (email), emergency contact (phone with country code), contact IDs, and traveler associations. Use this to verify contacts after adding them with add_cart_contact, or before payment to confirm all contact details are correct. PREREQUISITES: Requires valid cartId from create_cart and session-token from initialize_booking_session. WORKFLOW: Use after add_cart_contact to verify, or before payment to review. RESPONSE: Returns complete contact information with contact IDs that can be used for updates via update_cart_contact.`,
  inputSchema: GetCartContactsSchema,
  method: 'get',
  pathTemplate: '/carts/{cartId}/contacts',
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
  serializer: serializeGetCartContactsResponse,
};
