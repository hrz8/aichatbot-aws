import type { GetOrderDetailsResponse } from './types.js';
import type { AxiosResponse } from 'axios';

import {
  formatTravelersList,
  formatWarnings,
  formatContact,
  formatHeader,
  formatErrors,
  formatFlight,
} from '../shared-serializers.js';

/**
 * Serialize get order details response into human-readable format
 */
export function serializeGetOrderDetailsResponse(
  response: AxiosResponse<GetOrderDetailsResponse>,
): string {
  const { data } = response;
  const timestamp = new Date();

  let output = formatHeader('ORDER DETAILS');

  // Handle errors
  if (data.errors && data.errors.length > 0) {
    return output + formatErrors(data.errors, 'get_order_details', timestamp);
  }

  // Order header
  output += `📋 BOOKING REFERENCE: ${data.data.id}\n`;
  output += `👤 Last Name: ${data.data.lastName}\n\n`;

  // Timestamps
  if (data.data.creationDateTime) {
    output += `⏰ Created: ${new Date(data.data.creationDateTime).toLocaleString()}\n`;
  }
  if (data.data.lastModificationDateTime) {
    output += `🔄 Last Modified: ${new Date(data.data.lastModificationDateTime).toLocaleString()}\n`;
  }
  if (data.data.paymentTimeLimit) {
    const deadline = new Date(data.data.paymentTimeLimit);
    output += `💳 Payment Deadline: ${deadline.toLocaleString()}\n`;

    const now = new Date();
    const isPast = deadline.getTime() < now.getTime();
    if (isPast) {
      output += `   ⚠️  Deadline has passed!\n`;
    } else {
      const timeLeft = deadline.getTime() - now.getTime();
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      output += `   ⏳ Time remaining: ${hours}h ${minutes}m\n`;
    }
  }
  if (data.data.issuanceTimeLimit) {
    output += `🎫 Ticket Issuance Deadline: ${new Date(data.data.issuanceTimeLimit).toLocaleString()}\n`;
  }

  output += '\n';

  // Flight itinerary
  if (data.data.airBounds && data.data.airBounds.length > 0) {
    output += '✈️  FLIGHT ITINERARY\n';
    output += '='.repeat(80) + '\n\n';

    data.data.airBounds.forEach((bound, index) => {
      output += `Flight ${index + 1}: ${bound.originLocationCode} → ${bound.destinationLocationCode}\n`;

      if (bound.departureDate) {
        output += `Departure Date: ${new Date(bound.departureDate).toLocaleDateString()}\n`;
      }

      if (bound.flights && bound.flights.length > 0) {
        bound.flights.forEach((flight) => {
          if (flight.id && data.dictionaries?.flight) {
            output += formatFlight(flight.id, { flight: data.dictionaries.flight });
            if (flight.cabin) {
              output += `  Cabin: ${flight.cabin}`;
              if (flight.bookingClass) {
                output += ` (Class ${flight.bookingClass})`;
              }
              output += '\n';
            }
            if (flight.statusCode) {
              output += `  Status: ${flight.statusCode}\n`;
            }
          }
        });
      }

      if (bound.duration) {
        const hours = Math.floor(bound.duration / 3600);
        const mins = Math.floor((bound.duration % 3600) / 60);
        output += `Total Duration: ${hours}h ${mins}m\n`;
      }

      output += '\n';
    });
  }

  // Travelers
  if (data.data.travelers && data.data.travelers.length > 0) {
    output += '👥 TRAVELERS\n';
    output += '='.repeat(80) + '\n';
    output += formatTravelersList(data.data.travelers);
  }

  // Pricing
  if (data.data.prices?.totalPrice && data.data.prices.totalPrice.length > 0) {
    output += '\n💰 PRICING\n';
    output += '='.repeat(80) + '\n';

    const totalPriceData = data.data.prices.totalPrice[0];
    if (totalPriceData) {
      Object.entries(totalPriceData).forEach(([currency, priceInfo]: [string, any]) => {
        if (priceInfo) {
          const decimalPlaces = data.dictionaries?.currency?.[currency]?.decimalPlaces || 2;
          const divisor = Math.pow(10, decimalPlaces);

          if (priceInfo.base?.amount) {
            output += `Base Fare: ${currency} ${(priceInfo.base.amount / divisor).toFixed(decimalPlaces)}\n`;
          }
          if (priceInfo.base?.taxes) {
            output += `Taxes: ${currency} ${(priceInfo.base.taxes / divisor).toFixed(decimalPlaces)}\n`;
          }
          if (priceInfo.base?.amount && priceInfo.base?.taxes) {
            const total = priceInfo.base.amount + priceInfo.base.taxes;
            output += `TOTAL: ${currency} ${(total / divisor).toFixed(decimalPlaces)}\n`;
          }

          if (priceInfo.discount) {
            output += '\nDiscount Applied:\n';
            if (priceInfo.discount.amount) {
              output += `  Original: ${currency} ${(priceInfo.discount.amount / divisor).toFixed(decimalPlaces)}\n`;
            }
          }
        }
      });
    }
    output += '\n';
  }

  // Contact information
  if (data.data.contacts) {
    output += '📞 CONTACT INFORMATION\n';
    output += '='.repeat(80) + '\n';
    output += formatContact(data.data.contacts);
  }

  // Services
  if (data.data.services && data.data.services.length > 0) {
    output += '\n🎒 ANCILLARY SERVICES\n';
    output += '='.repeat(80) + '\n';
    output += `  ${data.data.services.length} service(s) booked\n`;
    output += '  (Details available in full response data)\n\n';
  }

  // Seats
  if (data.data.seats && data.data.seats.length > 0) {
    output += '💺 SEAT SELECTIONS\n';
    output += '='.repeat(80) + '\n';
    output += `  ${data.data.seats.length} seat(s) selected\n`;
    output += '  (Details available in full response data)\n\n';
  }

  // Insurance
  if (data.data.insurances && data.data.insurances.length > 0) {
    output += '🛡️  TRAVEL INSURANCE\n';
    output += '='.repeat(80) + '\n';
    output += `  ${data.data.insurances.length} insurance(s) added\n\n`;
  }

  // Booking options
  if (data.data.bookingOptions) {
    output += '⚙️  BOOKING OPTIONS\n';
    output += '='.repeat(80) + '\n';
    if (data.data.bookingOptions.newsletterSubscription !== undefined) {
      output += `  Newsletter: ${data.data.bookingOptions.newsletterSubscription ? 'Yes' : 'No'}\n`;
    }
    if (data.data.bookingOptions.checkInFlow2faConsent !== undefined) {
      output += `  2FA Check-in: ${data.data.bookingOptions.checkInFlow2faConsent ? 'Enabled' : 'Disabled'}\n`;
    }
    if (data.data.bookingOptions.quickSignupOptIn !== undefined) {
      output += `  Enrich Quick Signup: ${data.data.bookingOptions.quickSignupOptIn ? 'Yes' : 'No'}\n`;
    }
    output += '\n';
  }

  // Payment records
  if (data.data.paymentRecords && data.data.paymentRecords.length > 0) {
    output += '💳 PAYMENT RECORDS\n';
    output += '='.repeat(80) + '\n';
    output += `  ${data.data.paymentRecords.length} payment record(s)\n`;
    output += '  (Details available in full response data)\n\n';
  }

  // Travel documents
  if (data.data.travelDocuments && data.data.travelDocuments.length > 0) {
    output += '🎫 TRAVEL DOCUMENTS\n';
    output += '='.repeat(80) + '\n';
    output += `  ${data.data.travelDocuments.length} document(s) issued\n`;
    output += '  (E-ticket numbers and details available in full response data)\n\n';
  }

  // Warnings
  output += formatWarnings(data.warnings);

  // Next steps
  output += '\n📋 AVAILABLE ACTIONS:\n';
  output += '  • Complete payment (if not paid yet)\n';
  output += '  • Add ancillary services (baggage, meals, seats)\n';
  output += '  • Purchase travel insurance\n';
  output += '  • Modify booking (subject to airline rules)\n';
  output += '  • Cancel booking (subject to airline rules)\n';
  output += '  • Download e-tickets (after payment)\n';

  return output;
}
