import type { McpOpenAPIToolDefinition } from '../types.js';

import { serializeGetOrderDetailsResponse } from './serializer.js';
import { GetOrderDetailsSchema } from './schema.js';

export const getOrderDetailsTool: McpOpenAPIToolDefinition = {
  type: 'openapi',
  enabled: true,
  name: 'get_order_details',
  description: `Retrieve comprehensive details about a confirmed booking/order using the booking reference and traveler's last name. Returns complete information including: flight itinerary with times/terminals/aircraft, all travelers with passport and frequent flyer details, complete pricing breakdown with taxes and fees, contact information, ancillary services (baggage/meals/seats), travel insurance, payment records, e-ticket numbers, booking options, and status information. PREREQUISITES: Requires orderId (6-character booking reference from create_order) and lastName of one traveler for security verification. No session-token needed - can be called anytime. PARAMETERS: orderId (required, 6 chars), lastName (required, exact match, case-sensitive), currencyCode (optional, for price conversion). USE CASES: Review booking after creation, verify details before payment, check booking status, retrieve e-tickets, confirm passenger info, review services, check payment status. SECURITY: lastName verification ensures only authorized users access booking. WORKFLOW: Can be called after create_order or anytime later with saved orderId and lastName. Useful before payment to verify everything is correct. RESPONSE: Full order data with flight dictionaries (airlines, aircraft, airports), traveler details, pricing, services, and more.`,
  inputSchema: GetOrderDetailsSchema,
  method: 'get',
  pathTemplate: '/orders/{orderId}',
  executionParameters: [
    {
      name: 'orderId',
      in: 'path',
    },
    {
      name: 'lastName',
      in: 'query',
    },
    {
      name: 'currencyCode',
      in: 'query',
    },
  ],
  securityRequirements: [
    {
      HeaderApiToken: [],
      HeaderApimSubscriptionKey: [],
      HeaderApiVersion: [],
    },
  ],
  serializer: serializeGetOrderDetailsResponse,
};
