import type { McpOpenAPIToolDefinition } from '../types.js';

import { serializeUpdateCartTravelerResponse } from './serializer.js';
import { UpdateCartTravelerSchema } from './schema.js';

export const updateCartTravelerTool: McpOpenAPIToolDefinition = {
  type: 'openapi',
  enabled: true,
  name: 'update_cart_traveler',
  description: `Update one or more attributes of a traveler in a cart. Uses PATCH semantics - only provide fields to change. Can update: basic info (passengerTypeCode, gender, nationality, DOB), name (firstName, middleName, lastName, title), passport (documentNumber, expiryDate, issuanceCountryCode, documentType), frequent flyer (companyCode, cardNumber), or infant associations (accompanyingTravelerId). Common uses: add passport info, add frequent flyer number, correct name spelling, add missing DOB, update nationality. PREREQUISITES: Requires valid cartId from create_cart, travelerId from get_cart_travelers, and session-token from initialize_booking_session. BEST PRACTICE: Call get_cart_travelers first to get travelerId and see current values. VALIDATION: Adult/child/infant ages validated, passport expiry must be future, DOB must be past, infants need accompanying adult. RESPONSE: Returns updated traveler with all current information.`,
  inputSchema: UpdateCartTravelerSchema,
  method: 'patch',
  pathTemplate: '/carts/{cartId}/travelers/{travelerId}',
  executionParameters: [
    {
      name: 'cartId',
      in: 'path',
    },
    {
      name: 'travelerId',
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
  serializer: serializeUpdateCartTravelerResponse,
};
