import type {
  CartDetailsDictionary,
  PriceWithDiscount,
  TravelerContacts,
  CartTraveler,
  ErrorDetail,
  AirOffer,
  Warning,
} from './shared-types.js';

/**
 * Shared serializer functions for formatting MCP tool responses
 * These functions ensure consistent output formatting across all tools
 */

// ============================================================================
// Header and Separator Formatting
// ============================================================================

export function formatHeader(title: string): string {
  return `${title}\n${'='.repeat(80)}\n\n`;
}

export function formatSeparator(): string {
  return '-'.repeat(80) + '\n';
}

export function formatSubHeader(title: string): string {
  return `\n${title}\n${'-'.repeat(80)}\n`;
}

// ============================================================================
// Error and Warning Formatting (with tool context)
// ============================================================================

/**
 * Format errors with context about which tool caused the error and when
 * @param errors - Array of error details
 * @param toolName - Name of the tool that was called (e.g., "get_cart_details")
 * @param timestamp - When the error occurred (defaults to current time)
 */
export function formatErrors(
  errors?: ErrorDetail[],
  toolName?: string,
  timestamp: Date = new Date(),
): string {
  if (!errors || errors.length === 0) {return '';}

  let output = '❌ ERRORS OCCURRED\n';
  output += formatSeparator();

  if (toolName) {
    output += `Tool: ${toolName}\n`;
    output += `Time: ${timestamp.toISOString()}\n\n`;
  }

  errors.forEach((error, index) => {
    output += `Error ${index + 1}:\n`;
    output += `  Code: ${error.code}\n`;
    output += `  Message: ${error.message}\n`;

    if (error.details?.fields) {
      output += `  Affected Fields:\n`;
      error.details.fields.forEach((field) => {
        if (typeof field === 'string') {
          output += `    - ${field}\n`;
        } else {
          Object.entries(field).forEach(([key, value]) => {
            output += `    - ${key}: ${value}\n`;
          });
        }
      });
    }
    output += '\n';
  });

  return output;
}

/**
 * Format warnings consistently across all tools
 */
export function formatWarnings(warnings?: Warning[]): string {
  if (!warnings || warnings.length === 0) {return '';}

  let output = '\n⚠️  WARNINGS\n';
  output += formatSeparator();

  warnings.forEach((warning, index) => {
    output += `${index + 1}. [${warning.code}] ${warning.message}\n`;
    if (warning.details) {
      output += `   Details: ${JSON.stringify(warning.details)}\n`;
    }
  });

  return output + '\n';
}

// ============================================================================
// Contact Information Formatting (for tools: add/get/update cart contacts)
// ============================================================================

export function formatContact(contacts: TravelerContacts): string {
  let output = '';

  if (contacts.travelerId) {
    output += `👤 Traveler ID: ${contacts.travelerId}\n\n`;
  }

  // Main Contact
  if (contacts.mainContact) {
    output += '📋 MAIN CONTACT:\n';
    if (contacts.mainContact.email?.address) {
      output += `  📧 Email: ${contacts.mainContact.email.address}`;
      if (contacts.mainContact.email.purpose) {
        output += ` (${contacts.mainContact.email.purpose})`;
      }
      output += '\n';
      if (contacts.mainContact.email.contactId) {
        output += `     Contact ID: ${contacts.mainContact.email.contactId}\n`;
      }
    }
    if (contacts.mainContact.phone) {
      const phone = contacts.mainContact.phone;
      if (phone.number) {
        output += `  📱 Phone: +${phone.countryPhoneExtension || ''} ${phone.number}`;
        if (phone.purpose) {
          output += ` (${phone.purpose})`;
        }
        output += '\n';
        if (phone.addresseeName) {
          output += `     Contact Name: ${phone.addresseeName}\n`;
        }
        if (phone.contactId) {
          output += `     Contact ID: ${phone.contactId}\n`;
        }
      }
    }
    output += '\n';
  }

  // Alternate Contact
  if (contacts.alternateContact?.email?.address) {
    output += '📋 ALTERNATE CONTACT:\n';
    output += `  📧 Email: ${contacts.alternateContact.email.address}\n`;
    if (contacts.alternateContact.email.contactId) {
      output += `     Contact ID: ${contacts.alternateContact.email.contactId}\n`;
    }
    output += '\n';
  }

  // Emergency Contact
  if (contacts.emergencyContact?.number) {
    output += '🚨 EMERGENCY CONTACT:\n';
    const emergency = contacts.emergencyContact;
    output += `  📱 Phone: +${emergency.countryPhoneExtension || ''} ${emergency.number}\n`;
    if (emergency.addresseeName) {
      output += `     Contact Name: ${emergency.addresseeName}\n`;
    }
    if (emergency.countryCode) {
      output += `     Country: ${emergency.countryCode}\n`;
    }
    if (emergency.contactId) {
      output += `     Contact ID: ${emergency.contactId}\n`;
    }
    output += '\n';
  }

  return output || '  No contact information available\n\n';
}

// ============================================================================
// Traveler Information Formatting (for tools: get/update cart travelers)
// ============================================================================

export function formatTraveler(traveler: CartTraveler, index?: number): string {
  let output = '';

  if (index !== undefined) {
    output += `\n👤 TRAVELER ${index + 1}\n`;
    output += formatSeparator();
  }

  if (traveler.id) {
    output += `ID: ${traveler.id}\n`;
  }

  output += `Type: ${traveler.passengerTypeCode}`;
  const typeMap: Record<string, string> = {
    ADT: 'Adult',
    CHD: 'Child',
    INF: 'Infant',
  };
  if (typeMap[traveler.passengerTypeCode]) {
    output += ` (${typeMap[traveler.passengerTypeCode]})`;
  }
  output += '\n';

  if (traveler.name) {
    const nameComponents = [
      traveler.name.title,
      traveler.name.firstName,
      traveler.name.middleName,
      traveler.name.lastName,
    ].filter(Boolean);
    if (nameComponents.length > 0) {
      output += `Name: ${nameComponents.join(' ')}\n`;
    }
  }

  if (traveler.dateOfBirth) {
    output += `Date of Birth: ${traveler.dateOfBirth}\n`;
  }

  if (traveler.gender) {
    output += `Gender: ${traveler.gender}\n`;
  }

  if (traveler.nationalityCode) {
    output += `Nationality: ${traveler.nationalityCode}\n`;
  }

  if (traveler.accompanyingTravelerId) {
    output += `Accompanying Traveler: ${traveler.accompanyingTravelerId}\n`;
  }

  if (traveler.passport) {
    output += '\n📄 Passport Information:\n';
    if (traveler.passport.documentType) {
      output += `  Type: ${traveler.passport.documentType}\n`;
    }
    if (traveler.passport.documentNumber) {
      output += `  Number: ${traveler.passport.documentNumber}\n`;
    }
    if (traveler.passport.expiryDate) {
      output += `  Expiry: ${traveler.passport.expiryDate}\n`;
    }
    if (traveler.passport.issuanceCountryCode) {
      output += `  Issued by: ${traveler.passport.issuanceCountryCode}\n`;
    }
  }

  if (traveler.frequentFlyerCard) {
    output += '\n✈️  Frequent Flyer:\n';
    if (traveler.frequentFlyerCard.companyCode) {
      output += `  Airline: ${traveler.frequentFlyerCard.companyCode}\n`;
    }
    if (traveler.frequentFlyerCard.cardNumber) {
      output += `  Number: ${traveler.frequentFlyerCard.cardNumber}\n`;
    }
    if (traveler.frequentFlyerCard.tierLevel) {
      output += `  Tier: ${traveler.frequentFlyerCard.tierLevel}`;
      if (traveler.frequentFlyerCard.tierLevelName) {
        output += ` (${traveler.frequentFlyerCard.tierLevelName})`;
      }
      output += '\n';
    }
  }

  return output;
}

export function formatTravelersList(travelers: CartTraveler[]): string {
  if (!travelers || travelers.length === 0) {
    return 'No travelers found in cart.\n';
  }

  let output = `Total Travelers: ${travelers.length}\n`;
  travelers.forEach((traveler, index) => {
    output += formatTraveler(traveler, index);
  });

  return output;
}

// ============================================================================
// Price Formatting (for tool: get_cart_details)
// ============================================================================

export function formatPrice(price: PriceWithDiscount, currencyDecimals = 2): string {
  const currency = price.currencyCode || 'MYR';
  const divisor = Math.pow(10, currencyDecimals);

  let output = '';

  if (price.base !== undefined) {
    output += `  Base Fare: ${currency} ${(price.base / divisor).toFixed(currencyDecimals)}\n`;
  }

  if (price.taxes && price.taxes.length > 0) {
    output += `  Taxes:\n`;
    price.taxes.forEach((tax) => {
      output += `    - ${tax.code || 'TAX'}: ${currency} ${(tax.value / divisor).toFixed(currencyDecimals)}\n`;
    });
  }

  if (price.totalTaxes !== undefined) {
    output += `  Total Taxes: ${currency} ${(price.totalTaxes / divisor).toFixed(currencyDecimals)}\n`;
  }

  if (price.surcharges && price.surcharges.length > 0) {
    output += `  Surcharges:\n`;
    price.surcharges.forEach((surcharge) => {
      output += `    - ${surcharge.code || 'SURCHARGE'}: ${currency} ${(surcharge.value / divisor).toFixed(currencyDecimals)}\n`;
    });
  }

  if (price.fees && price.fees.length > 0) {
    output += `  Fees:\n`;
    price.fees.forEach((fee) => {
      if (fee.value !== undefined) {
        output += `    - ${fee.nature || 'FEE'}: ${currency} ${(fee.value / divisor).toFixed(currencyDecimals)}\n`;
      }
    });
  }

  if (price.discount) {
    output += `  Discount Applied:\n`;
    if (price.discount.discountCode) {
      output += `    Code: ${price.discount.discountCode}\n`;
    }
    if (price.discount.originalTotal) {
      output += `    Original Total: ${currency} ${(price.discount.originalTotal / divisor).toFixed(currencyDecimals)}\n`;
    }
  }

  if (price.total !== undefined) {
    output += `  TOTAL: ${currency} ${(price.total / divisor).toFixed(currencyDecimals)}\n`;
  }

  return output;
}

// ============================================================================
// Flight Formatting (for tool: get_cart_details)
// ============================================================================

export function formatFlight(
  flightId: string,
  dictionaries?: CartDetailsDictionary,
): string {
  if (!dictionaries?.flight?.[flightId]) {
    return `  Flight ${flightId}\n`;
  }

  const flight = dictionaries.flight[flightId];
  let output = '';

  if (flight.flightDesignator) {
    const marketing = flight.flightDesignator.marketing;
    if (marketing) {
      output += `  ${marketing.airlineCode || ''}${marketing.flightNumber || ''} `;
      if (flight.suffix) {
        output += `(${flight.suffix}) `;
      }
    }
  }

  if (flight.departure && flight.arrival) {
    output += `${flight.departure.locationCode} → ${flight.arrival.locationCode}\n`;
    if (flight.departure.dateTime) {
      output += `  Departs: ${new Date(flight.departure.dateTime).toLocaleString()}`;
      if (flight.departure.terminal) {
        output += ` (Terminal ${flight.departure.terminal})`;
      }
      output += '\n';
    }
    if (flight.arrival.dateTime) {
      output += `  Arrives: ${new Date(flight.arrival.dateTime).toLocaleString()}`;
      if (flight.arrival.terminal) {
        output += ` (Terminal ${flight.arrival.terminal})`;
      }
      output += '\n';
    }
  }

  if (flight.aircraftCode && dictionaries.aircraft) {
    const aircraftName = dictionaries.aircraft[flight.aircraftCode] || flight.aircraftCode;
    output += `  Aircraft: ${aircraftName}\n`;
  }

  if (flight.duration) {
    const hours = Math.floor(flight.duration / 3600);
    const minutes = Math.floor((flight.duration % 3600) / 60);
    output += `  Duration: ${hours}h ${minutes}m\n`;
  }

  if (flight.flightStatus) {
    output += `  Status: ${flight.flightStatus}\n`;
  }

  return output;
}

export function formatAirOffer(
  offer: AirOffer,
  dictionaries?: CartDetailsDictionary,
): string {
  let output = '';

  if (offer.id) {
    output += `Offer ID: ${offer.id}\n\n`;
  }

  offer.offerItems?.forEach((item, itemIndex) => {
    output += `Offer Item ${itemIndex + 1}:\n`;

    // Flight bounds
    item.air?.bounds?.forEach((bound, boundIndex) => {
      output += `  Bound ${boundIndex + 1}: ${bound.originLocationCode} → ${bound.destinationLocationCode}\n`;

      bound.flights?.forEach((flightItem) => {
        if (flightItem.id) {
          output += formatFlight(flightItem.id, dictionaries);
          if (flightItem.cabin) {
            output += `  Cabin: ${flightItem.cabin}`;
            if (flightItem.bookingClass) {
              output += ` (Class ${flightItem.bookingClass})`;
            }
            output += '\n';
          }
        }
      });
    });

    // Pricing
    if (item.prices?.totalPrices && item.prices.totalPrices.length > 0) {
      output += '\n💰 Pricing:\n';
      const currencyDecimals = dictionaries?.currency?.[item.prices.totalPrices[0]!.currencyCode || 'MYR']?.decimalPlaces || 2;
      output += formatPrice(item.prices.totalPrices[0]!, currencyDecimals);
    }

    output += '\n';
  });

  return output;
}
