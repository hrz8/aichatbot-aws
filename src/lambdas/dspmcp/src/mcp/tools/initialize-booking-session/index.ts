import type { McpOpenAPIToolDefinition } from '../types.js';

import { serializeInitializeBookingResponse } from './serializer.js';
import { InitializeBookingSchema } from './schema.js';

export const initializeBookingSessionTool: McpOpenAPIToolDefinition = {
  type: 'openapi',
  enabled: true,
  name: 'initialize_booking_session',
  description: 'Initialize a new booking session.',
  inputSchema: InitializeBookingSchema,
  method: 'post',
  pathTemplate: '/initialisation',
  executionParameters: [],
  requestBodyContentType: 'application/json',
  securityRequirements: [
    {
      HeaderApiToken: [],
      HeaderApimSubscriptionKey: [],
      HeaderApiVersion: [],
    },
  ],
  serializer: serializeInitializeBookingResponse,
};
