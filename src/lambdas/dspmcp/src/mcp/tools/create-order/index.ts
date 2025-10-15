import type { McpOpenAPIToolDefinition } from '../types.js';

import { serializeCreateOrderResponse } from './serializer.js';
import { CreateOrderSchema } from './schema.js';

export const createOrderTool: McpOpenAPIToolDefinition = {
  type: 'openapi',
  enabled: true,
  name: 'create_order',
  description: `Convert a shopping cart into a confirmed order/booking. This is the critical step that finalizes the booking and generates a booking reference (PNR). PREREQUISITES: Must have valid cartId from create_cart, all travelers must have complete details (names, DOB, passport for international flights) added via update_cart_traveler, contact information (email, phone) added via add_cart_contact, and active session-token from initialize_booking_session. The cart must be complete and valid - missing traveler details or contacts will cause errors. OPTIONAL PARAMETERS: newsletterSubscription (subscribe to offers), checkInFlow2faConsent (enable 2FA for check-in), quickSignupOptIn (join frequent flyer program), previousOrderId (for rebookings), lastName (one traveler's last name for retrieval). WORKFLOW POSITION: This is step 4 in the booking flow, after: (1) initialize_booking_session, (2) search_flights, (3) create_cart and complete cart setup. RESPONSE: Returns orderId (6-character PNR/booking reference), lastName, creation timestamp, expiration timestamp, and paymentTimeLimit. CRITICAL: The orderId is required for all subsequent operations including payment, retrieval, modifications, and cancellations. The order will automatically cancel if payment is not completed before paymentTimeLimit. IMPORTANT: After creating order, you typically proceed to payment immediately. Use get_order_details to verify the order before payment.`,
  inputSchema: CreateOrderSchema,
  method: 'post',
  pathTemplate: '/orders',
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
  serializer: serializeCreateOrderResponse,
};
