import type { McpOpenAPIToolDefinition } from '../types.js';

import { serializeAddCartContactResponse } from './serializer.js';
import { AddCartContactSchema } from './schema.js';

export const addCartContactTool: McpOpenAPIToolDefinition = {
  type: 'openapi',
  enabled: true,
  name: 'add_cart_contact',
  description: `Add contact information (email, phone, emergency contact) to a shopping cart. This is required before proceeding to payment. Provide at least one contact method: main contact email or phone number. Optionally include alternate email and emergency contact phone. You can associate the contact with a specific traveler using travelerId, or add it as cart-level contact by omitting travelerId. PREREQUISITES: Requires valid cartId from create_cart and session-token from initialize_booking_session. WORKFLOW: Use after create_cart, typically before payment. Can be called multiple times to add contacts for different travelers. RESPONSE: Returns the added contact information with generated contact IDs that can be used for updates.`,
  inputSchema: AddCartContactSchema,
  method: 'post',
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
  serializer: serializeAddCartContactResponse,
};
