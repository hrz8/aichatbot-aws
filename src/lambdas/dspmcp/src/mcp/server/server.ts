import { Server } from '@modelcontextprotocol/sdk/server/index.js';

import { MCP_SERVER_VERSION, MCP_SERVER_NAME } from '../../utils/config.js';
import { registerResources } from '../resources/index.js';
import { registerPrompts  } from '../prompts/index.js';
import { registerTools } from '../tools/index.js';

export function createMcpServer(): Server {
  const server = new Server({
    name: MCP_SERVER_NAME,
    version: MCP_SERVER_VERSION,
  }, {
    capabilities: {
      resources: {},
      prompts: {},
      tools: {},
    },
  });

  registerResources(server);
  registerPrompts(server);
  registerTools(server);

  return server;
}
