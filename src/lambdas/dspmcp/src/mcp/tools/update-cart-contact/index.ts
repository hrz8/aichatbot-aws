import type { McpOpenAPIToolDefinition } from '../types.js';

import { serializeUpdateCartContactResponse } from './serializer.js';
import { UpdateCartContactSchema } from './schema.js';

export const updateCartContactTool: McpOpenAPIToolDefinition = {
  type: 'openapi',
  enabled: true,
  name: 'update_cart_contact',
  description: `Update existing contact information in a shopping cart. Uses PATCH semantics - only include fields you want to change. You can update specific contacts by including contactId (get it from get_cart_contacts first), or replace all contacts by providing complete new information. Update main contact email/phone, alternate email, emergency contact, or traveler association. PREREQUISITES: Requires valid cartId from create_cart and session-token from initialize_booking_session. Cart must have existing contacts. BEST PRACTICE: Call get_cart_contacts first to retrieve contact IDs. WORKFLOW: Use to correct errors, update customer details, or change emergency contacts. RESPONSE: Returns updated contact information showing all current values.`,
  inputSchema: UpdateCartContactSchema,
  method: 'patch',
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
  requestBodyContentType: 'application/json',
  securityRequirements: [
    {
      HeaderApiToken: [],
      HeaderApimSubscriptionKey: [],
      HeaderApiVersion: [],
    },
  ],
  serializer: serializeUpdateCartContactResponse,
};
