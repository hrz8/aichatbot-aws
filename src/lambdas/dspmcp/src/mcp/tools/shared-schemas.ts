import { z } from 'zod';

/**
 * Shared Zod schemas for MCP tools
 * These schemas are reused across multiple tools to ensure consistent validation
 */

// ============================================================================
// Common ID Schemas
// ============================================================================

export const CartIdSchema = z.string()
  .regex(/^[a-zA-Z0-9]{16}$/)
  .describe('Cart ID - 16 alphanumeric characters. Obtained from create_cart response.');

export const CartTravelerIdSchema = z.string()
  .regex(/^[a-zA-Z0-9-]{1,20}$/)
  .describe('Traveler ID in the cart. Format: alphanumeric with hyphens, 1-20 characters.');

export const CartContactIdSchema = z.string()
  .regex(/^[a-zA-Z0-9-]{1,20}$/)
  .describe('Contact ID in the cart. Format: alphanumeric with hyphens, 1-20 characters.');

// ============================================================================
// Session Token Schema (Used by ALL tools)
// ============================================================================

export const SessionTokenSchema = z.string()
  .min(1)
  .describe('Required authentication token obtained from the initialize_booking_session step. This token maintains the booking session context and must be included in all cart operations. The token is returned in the response headers of the initialization call (look for "Session-Token" header).');

// ============================================================================
// Contact Schemas (Used in: add_cart_contact, update_cart_contact)
// ============================================================================

export const PhoneSchema = z.object({
  countryPhoneExtension: z.string()
    .regex(/^([+]?)([0-9]{1,7})$/)
    .describe('Country code phone extension (e.g. "60" for Malaysia, "1" for USA)')
    .optional(),
  number: z.string()
    .regex(/^[0-9]{1,15}(x[0-9]{1,8})?$/)
    .describe('Phone number including work extension (when applicable). Format: digits only, optional extension with "x".')
    .optional(),
  addresseeName: z.string()
    .regex(/^[a-zA-Z -]{1,70}$/)
    .describe('Recipient name if different from traveler (e.g., emergency contact person name)')
    .optional(),
  purpose: z.string()
    .describe('Purpose of the phone number (e.g., "standard", "emergency")')
    .optional(),
}).describe('Phone contact information');

export const EmailSchema = z.object({
  address: z.string()
    .email()
    .describe('Email address in valid format (e.g., user@example.com)')
    .optional(),
  purpose: z.string()
    .describe('Purpose of the email address (e.g., "standard", "notification")')
    .optional(),
}).describe('Email contact information');

export const ContactsSchema = z.object({
  mainContact: z.object({
    phone: PhoneSchema.optional(),
    email: EmailSchema.optional(),
  }).describe('Primary contact information for the traveler').optional(),
  alternateContact: z.object({
    email: EmailSchema.optional(),
  }).describe('Alternative email for notifications').optional(),
  emergencyContact: PhoneSchema.extend({
    countryCode: z.string()
      .regex(/^[a-zA-Z0-9]{2}$/)
      .describe('ISO 3166-1 country code for emergency contact (e.g., "MY", "US")')
      .optional(),
  }).describe('Emergency contact person information').optional(),
}).describe('Contact information structure');

export const TravelerContactsSchema = ContactsSchema.extend({
  travelerId: CartTravelerIdSchema.optional().describe('Optional traveler ID to associate the contact with a specific traveler in the cart'),
}).describe('Traveler contact information with optional traveler association');

// ============================================================================
// Traveler Schemas (Used in: update_cart_traveler)
// ============================================================================

export const NameSchema = z.object({
  firstName: z.string()
    .regex(
      /^ {0}[A-Za-z\u00C0-\u1FFF\u3040-\uD7AF][A-Za-z\u00C0-\u1FFF\u3040-\uD7AF\u2019 \-.]{0,69}$/,
    )
    .describe('First name (can include middle name). Max 70 characters. When using universal name type, only ASCII [a-zA-Z ] characters are accepted.')
    .optional(),
  middleName: z.string()
    .regex(/^[A-Za-z \-.]{0,30}$/)
    .describe('Middle name (for regulatory details). Max 30 characters.')
    .optional(),
  lastName: z.string()
    .regex(
      /^ {0}[A-Za-z\u00C0-\u1FFF\u3040-\uD7AF][A-Za-z\u00C0-\u1FFF\u3040-\uD7AF\u2019 \-.]{0,69}$/,
    )
    .describe('Last name. Max 70 characters. When using universal name type, only ASCII [a-zA-Z ] characters are accepted.')
    .optional(),
  title: z.string()
    .regex(/^[a-zA-Z -]{1,20}$/)
    .describe('Title (e.g., "MR", "MRS", "DR"). Max 20 characters.')
    .optional(),
}).describe('Traveler name information');

export const PassportSchema = z.object({
  documentNumber: z.string()
    .regex(/^[a-zA-Z0-9-]{1,40}$/)
    .describe('Passport/document number. Alphanumeric with hyphens, max 40 characters.')
    .optional(),
  expiryDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .describe('Document expiry date. Format: yyyy-mm-dd')
    .optional(),
  issuanceCountryCode: z.string()
    .regex(/^[A-Z]{2}$/)
    .describe('Document issuing country code. 2-letter ISO code (e.g., "MY", "US")')
    .optional(),
  nationalityCode: z.string()
    .regex(/^[A-Z]{2}$/)
    .describe('Traveler nationality code. 2-letter ISO code')
    .optional(),
  dateOfBirth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .describe('Date of birth in passport. Format: yyyy-mm-dd')
    .optional(),
  documentType: z.enum([
    'passport', 'identityCard', 'airAttendanceLicense', 'birthCertificate',
    'borderCrossingCard', 'drivingLicense', 'flightMechanicalLicense',
    'foreignNationalRegistration', 'loyalAttorneyIdentification', 'militaryIdentityCard',
    'operationalDispatcherLicense', 'pilotLicense', 'reEntryPermit',
    'naturalisationCardUS', 'workPermit', 'visa', 'residentAlienCard',
    'permanentResidentCard', 'redressNumber', 'knownTravelerNumber',
    'homeReentryPermit', 'chinaTravelPermit', 'chinaTravelPermitHongKongMacao',
    'chinaExitAndEntryPermit', 'residentTravelPermit',
    'residentTravelPermitToFromTaiwanAndChina', 'residentTravelPermitToFromHongKongMacao',
    'residentTravelPermitToHongKongMacao', 'taiwanExitAndEntryPermit', 'nexusCard',
  ]).describe('Type of travel document').optional(),
}).describe('Passport/regulatory document information');

export const FrequentFlyerCardSchema = z.object({
  companyCode: z.string()
    .regex(/^[A-Z0-9]{2,3}$/)
    .describe('Airline code of the frequent flyer program (e.g., "MH" for Malaysia Airlines)')
    .optional(),
  cardNumber: z.string()
    .regex(/^[a-zA-Z0-9]{2,20}$/)
    .describe('Frequent flyer card number. Alphanumeric, 2-20 characters.')
    .optional(),
}).describe('Frequent flyer card information');

export const GenderSchema = z.enum(['male', 'female', 'unspecified', 'unknown'])
  .describe('Traveler gender. Pre-selected based on title if applicable.');

export const PassengerTypeCodeSchema = z.string()
  .regex(/^[A-Z0-9]{3}$/)
  .describe('Passenger type code (e.g., "ADT" for adult, "CHD" for child, "INF" for infant)');

export const DateOfBirthSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .describe('Date of birth. Format: yyyy-mm-dd. Not required for adults, mandatory for children and infants.');

export const NationalityCodeSchema = z.string()
  .regex(/^[A-Z]{2}$/)
  .describe('Nationality code. 2-letter ISO country code.');

// ============================================================================
// Update Traveler Request Schema (Used in: update_cart_traveler)
// ============================================================================

export const UpdateCartTravelerRequestSchema = z.object({
  passengerTypeCode: PassengerTypeCodeSchema.optional(),
  name: NameSchema.optional(),
  dateOfBirth: DateOfBirthSchema.optional(),
  gender: GenderSchema.optional(),
  nationalityCode: NationalityCodeSchema.optional(),
  passport: PassportSchema.optional(),
  frequentFlyerCard: FrequentFlyerCardSchema.optional(),
}).describe('Traveler update request. All fields are optional (PATCH semantics) - only include fields you want to update.');

// ============================================================================
// Order Schemas (Used in: create_order, get_order_details)
// ============================================================================

export const OrderIdSchema = z.string()
  .regex(/^[a-zA-Z0-9]{6}$/)
  .describe('Order ID - 6 alphanumeric characters. This is the booking reference number (PNR) returned after creating an order.');

export const CreateOrderRequestSchema = z.object({
  cartId: CartIdSchema
    .describe('Cart ID to convert into an order. This is the 16-character ID from create_cart.'),
  newsletterSubscription: z.boolean()
    .optional()
    .describe('Set true to subscribe to newsletters and special offers via email. Default: false.'),
  checkInFlow2faConsent: z.boolean()
    .optional()
    .describe('Set true to enable 2FA verification when starting check-in flow. Default: false.'),
  previousOrderId: OrderIdSchema
    .optional()
    .describe('Previous order ID if this is a rebooking or modification of an existing order.'),
  quickSignupOptIn: z.boolean()
    .optional()
    .describe('Set true if user opted for Enrich Quick Signup (frequent flyer program). Default: false.'),
  lastName: z.string()
    .optional()
    .describe('One of the traveler\'s last name. Used for order retrieval and verification.'),
}).describe('Order creation request from an existing cart. Converts a shopping cart into a confirmed order/booking.');

export const LastNameQuerySchema = z.string()
  .min(1)
  .describe('Last name of one of the travelers in the order. Required for order retrieval and security verification. Must match exactly with the name provided during booking.');

export const CurrencyCodeQuerySchema = z.string()
  .regex(/^[A-Z]{3}$/)
  .optional()
  .describe('Optional currency code for pricing display (e.g., "MYR", "USD", "SGD"). If not specified, uses the original booking currency.');
