import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { McpToolDefinition } from './types.js';

import { initializeBookingSessionTool } from './initialize-booking-session/index.js';
import { calculateLoyaltyPointsTool } from './calculate-loyalty-points/index.js';
import { updateCartTravelerTool } from './update-cart-traveler/index.js';
import { updateCartContactTool } from './update-cart-contact/index.js';
import { getCartTravelersTool } from './get-cart-travelers/index.js';
import { getCartContactsTool } from './get-cart-contacts/index.js';
import { getOrderDetailsTool } from './get-order-details/index.js';
import { getCartDetailsTool } from './get-cart-details/index.js';
import { addCartContactTool } from './add-cart-contact/index.js';
import { securitySchemes } from './openapi/security-schemes.js';
import { searchFlightsTool } from './search-flights/index.js';
import { executeOpenAPITool } from './openapi/executor.js';
import { createOrderTool } from './create-order/index.js';
import { createCartTool } from './create-cart/index.js';

/**
 * Master registry of all available tools
 * Tools are automatically filtered by their 'enabled' flag
 */
const allTools: McpToolDefinition[] = [
  // Booking flow tools (in order of typical usage)
  initializeBookingSessionTool,
  searchFlightsTool,
  createCartTool,
  getCartDetailsTool,
  getCartTravelersTool,
  updateCartTravelerTool,
  getCartContactsTool,
  addCartContactTool,
  updateCartContactTool,
  createOrderTool,
  getOrderDetailsTool,

  // Optional/utility tools
  calculateLoyaltyPointsTool, // Disabled by default - for reference
];

/**
 * Get all enabled tools as a Map
 * Only tools with enabled: true are included
 */
export function getEnabledTools(): Map<string, McpToolDefinition> {
  const enabledToolsMap = new Map<string, McpToolDefinition>();

  for (const tool of allTools) {
    if (tool.enabled) {
      enabledToolsMap.set(tool.name, tool);
      console.info(`Registered tool: ${tool.name} (type: ${tool.type})`);
    } else {
      console.info(`Skipped disabled tool: ${tool.name} (type: ${tool.type})`);
    }
  }

  return enabledToolsMap;
}

/**
 * Export the enabled tools registry
 * This is used by the MCP server to list available tools
 */
export const tools: Map<string, McpToolDefinition> = getEnabledTools();

/**
 * Execute a tool based on its type
 * Routes to appropriate executor (OpenAPI vs Custom)
 */
export async function executeTool(
  toolName: string,
  definition: McpToolDefinition,
  toolArgs: Record<string, unknown>,
): Promise<CallToolResult> {
  // Check if tool is enabled (defense in depth)
  if (!definition.enabled) {
    console.warn(`Attempted to execute disabled tool: ${toolName}`);
    return {
      content: [
        {
          type: 'text',
          text: `Error: Tool '${toolName}' is currently disabled. Please contact support if you need access to this feature.`,
        },
      ],
    };
  }

  // Route to appropriate executor based on tool type
  if (definition.type === 'openapi') {
    console.info(`Executing OpenAPI tool: ${toolName}`);
    return executeOpenAPITool(toolName, definition, toolArgs, securitySchemes);
  } else if (definition.type === 'custom') {
    console.info(`Executing custom tool: ${toolName}`);

    try {
      // Custom tools handle their own validation and execution
      return await definition.handler(toolArgs);
    } catch (error) {
      console.error(`Error executing custom tool '${toolName}':`, error);

      const errorMessage = error instanceof Error ? error.message : String(error);

      return {
        content: [
          {
            type: 'text',
            text: `Error executing tool '${toolName}': ${errorMessage}`,
          },
        ],
      };
    }
  } else {
    // TypeScript exhaustiveness check
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _exhaustive: never = definition;
    throw new Error(`Unknown tool type: ${(definition as any).type}`);
  }
}

/**
 * Get statistics about registered tools
 */
export function getToolStats(): {
  total: number;
  enabled: number;
  disabled: number;
  byType: Record<string, number>;
} {
  const stats = {
    total: allTools.length,
    enabled: 0,
    disabled: 0,
    byType: {} as Record<string, number>,
  };

  for (const tool of allTools) {
    if (tool.enabled) {
      stats.enabled++;
    } else {
      stats.disabled++;
    }

    stats.byType[tool.type] = (stats.byType[tool.type] || 0) + 1;
  }

  return stats;
}
