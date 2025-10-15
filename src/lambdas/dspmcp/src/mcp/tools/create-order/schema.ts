import { z } from 'zod';

import { CreateOrderRequestSchema, SessionTokenSchema } from '../shared-schemas.js';

/**
 * Schema for create_order tool
 * Converts a shopping cart into a confirmed order/booking
 */
export const CreateOrderSchema = z.object({
  'session-token': SessionTokenSchema,

  requestBody: CreateOrderRequestSchema,
}).describe('CREATE ORDER: Convert a shopping cart into a confirmed order/booking. This is the final step before payment. The cart must have all required information: travelers with complete details (names, dates of birth, passport info if international), contact information (email and phone), and selected flights. PREREQUISITES: Requires valid cartId from create_cart, all travelers updated via update_cart_traveler, contacts added via add_cart_contact, and active session-token from initialize_booking_session. WORKFLOW: Use after completing cart setup. The order will be created but requires payment within the time limit specified in paymentTimeLimit. RESPONSE: Returns orderId (6-character booking reference/PNR), lastName for retrieval, creation time, expiration time, and payment deadline. IMPORTANT: Save the orderId - it is required for all future operations (payment, retrieval, modifications, cancellations). The order will auto-cancel if not paid before paymentTimeLimit.');
