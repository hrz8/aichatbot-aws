import type { TravelerContactResponse } from './types.js';
import type { AxiosResponse } from 'axios';

import {
  formatWarnings,
  formatContact,
  formatHeader,
  formatErrors,
} from '../shared-serializers.js';

/**
 * Serialize add cart contact response into human-readable format
 */
export function serializeAddCartContactResponse(
  response: AxiosResponse<TravelerContactResponse>,
): string {
  const { data } = response;
  const timestamp = new Date();

  let output = formatHeader('CONTACT ADDED TO CART');

  // Handle errors
  if (data.errors && data.errors.length > 0) {
    return output + formatErrors(data.errors, 'add_cart_contact', timestamp);
  }

  output += '✅ Contact information successfully added to cart!\n\n';

  // Display added contact
  output += formatContact(data.data);

  // Warnings
  output += formatWarnings(data.warnings);

  // Next steps
  output += '\n📋 NEXT STEPS:\n';
  output += '  1. Add additional contacts if needed (call this tool again)\n';
  output += '  2. Verify all contact information (use get_cart_contacts)\n';
  output += '  3. Update contact details if necessary (use update_cart_contact)\n';
  output += '  4. Proceed to select ancillary services or payment\n';

  return output;
}
