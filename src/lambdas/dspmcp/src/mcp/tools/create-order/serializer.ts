import type { CreateOrderResponse } from './types.js';
import type { AxiosResponse } from 'axios';

import { formatWarnings, formatErrors, formatHeader } from '../shared-serializers.js';

/**
 * Serialize create order response into human-readable format
 */
export function serializeCreateOrderResponse(
  response: AxiosResponse<CreateOrderResponse>,
): string {
  const { data } = response;
  const timestamp = new Date();

  let output = formatHeader('ORDER CREATED SUCCESSFULLY');

  // Handle errors
  if (data.errors && data.errors.length > 0) {
    return output + formatErrors(data.errors, 'create_order', timestamp);
  }

  output += '✅ Your booking has been created!\n\n';

  // Order details
  output += `📋 BOOKING REFERENCE (PNR): ${data.data.orderId}\n`;
  output += `👤 Last Name: ${data.data.lastName}\n\n`;

  if (data.data.creationDateTime) {
    const createdDate = new Date(data.data.creationDateTime);
    output += `⏰ Created: ${createdDate.toLocaleString()}\n`;
  }

  if (data.data.expirationDateTime) {
    const expiryDate = new Date(data.data.expirationDateTime);
    output += `⏳ Expires: ${expiryDate.toLocaleString()}\n`;
  }

  if (data.data.paymentTimeLimit) {
    const paymentDeadline = new Date(data.data.paymentTimeLimit);
    output += `💳 Payment Deadline: ${paymentDeadline.toLocaleString()}\n`;

    const now = new Date();
    const timeLeft = paymentDeadline.getTime() - now.getTime();
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (timeLeft > 0) {
      output += `   ⚠️  Time remaining: ${hoursLeft}h ${minutesLeft}m\n`;
    } else {
      output += `   ⚠️  Payment deadline has passed!\n`;
    }
  }

  output += '\n';

  // Warnings
  output += formatWarnings(data.warnings);

  // Important information
  output += '\n⚠️  IMPORTANT:\n';
  output += `  • Save your booking reference: ${data.data.orderId}\n`;
  output += `  • Save the last name: ${data.data.lastName}\n`;
  output += '  • Both are required to retrieve or modify this booking\n';
  if (data.data.paymentTimeLimit) {
    output += `  • Complete payment before: ${new Date(data.data.paymentTimeLimit).toLocaleString()}\n`;
    output += '  • Order will auto-cancel if not paid by deadline\n';
  }

  // Next steps
  output += '\n📋 NEXT STEPS:\n';
  output += '  1. Proceed to payment (use payment tools with this orderId)\n';
  output += `  2. Retrieve booking details (use get_order_details with orderId: ${data.data.orderId})\n`;
  output += '  3. Add ancillary services if needed (baggage, meals, seats)\n';
  output += '  4. Complete payment before the deadline\n';
  output += '  5. Receive confirmation and e-tickets via email\n';

  return output;
}
