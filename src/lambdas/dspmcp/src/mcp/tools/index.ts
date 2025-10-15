import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  type CallToolRequest,
  type CallToolResult,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js';

import type { Server } from '@modelcontextprotocol/sdk/server/index.js';

import { zodToMcpJsonSchema } from '../../helpers/json-schema.js';
import { getToolStats, executeTool, tools } from './registry.js';

export function registerTools(server: Server): void {
  // Log tool registration statistics
  const stats = getToolStats();
  console.info(`Tool Registry Stats: ${stats.enabled} enabled, ${stats.disabled} disabled (${stats.total} total)`);
  console.info(`Tools by type: ${JSON.stringify(stats.byType)}`);

  // Handle ListTools request
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const toolsForClient: Tool[] = [];

    for (const def of Array.from(tools.values())) {
      // Only return enabled tools
      if (def.enabled) {
        toolsForClient.push({
          name: def.name,
          description: def.description,
          inputSchema: zodToMcpJsonSchema(def.inputSchema),
        });
      }
    }

    console.info(`Returning ${toolsForClient.length} enabled tools to client`);
    return {
      tools: toolsForClient,
    };
  });

  // Handle CallTool request
  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest): Promise<CallToolResult> => {
      const { name: toolName, arguments: toolArgs } = request.params;
      console.info(`CallTool request received: ${toolName}`);

      const toolDefinition = tools.get(toolName);

      if (!toolDefinition) {
        console.warn(`Unknown tool requested: ${toolName}`);
        return {
          content: [
            {
              type: 'text',
              text: `Error: Unknown tool requested: ${toolName}`,
            },
          ],
        };
      }

      // Additional safety check for enabled status
      if (!toolDefinition.enabled) {
        console.warn(`Disabled tool requested: ${toolName}`);
        return {
          content: [
            {
              type: 'text',
              text: `Error: Tool '${toolName}' is currently disabled.`,
            },
          ],
        };
      }

      // Dispatch to appropriate executor based on tool type
      return executeTool(toolName, toolDefinition, toolArgs ?? {});
    },
  );
}
