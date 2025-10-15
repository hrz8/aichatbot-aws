import { z } from 'zod';

import {
  CurrencyCodeQuerySchema,
  LastNameQuerySchema,
  OrderIdSchema,
} from '../shared-schemas.js';

/**
 * Schema for get_order_details tool
 * Retrieves comprehensive order/booking information
 */
export const GetOrderDetailsSchema = z.object({
  orderId: OrderIdSchema
    .describe('Order ID (booking reference/PNR) to retrieve. This is the 6-character alphanumeric code returned from create_order (e.g., "EBA7DZ", "6B3U49").'),

  lastName: LastNameQuerySchema
    .describe('Last name of one of the travelers in the booking. Required for security verification. Must match exactly with the name used during booking. Case-sensitive.'),

  currencyCode: CurrencyCodeQuerySchema
    .describe('Optional currency code for price display. If provided, prices will be shown in this currency (e.g., "USD", "EUR", "SGD"). If omitted, prices shown in original booking currency.'),
}).describe('RETRIEVE ORDER DETAILS: Fetch comprehensive information about a confirmed booking/order. Returns complete booking details including flights (with times, terminals, aircraft), travelers (names, passport info, frequent flyer numbers), pricing breakdown (base fare, taxes, fees, total), contact information, ancillary services (baggage, meals, seats), insurances, payment records, travel documents (e-tickets), booking options, and more. PREREQUISITES: Requires orderId from create_order and the lastName of one traveler for security verification. No session-token required - this endpoint can be called anytime with just orderId and lastName. USE CASES: View booking after creation, check booking status before payment, review details before flight, retrieve e-ticket numbers, verify passenger information, check payment status, review ancillary services. SECURITY: lastName verification ensures only authorized users can access booking details. RESPONSE: Includes full order data, flight dictionaries (airlines, aircraft, locations), and pricing information.');
