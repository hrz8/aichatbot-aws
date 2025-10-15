import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { AxiosResponse } from 'axios';
import type { ZodSchema } from 'zod';

/**
 * Discriminated union of all supported MCP tool types
 */
export type McpToolDefinition = McpOpenAPIToolDefinition | McpCustomToolDefinition;

/**
 * Base properties shared by all tool types
 */
type McpToolBase = {
  /**
   * Unique tool identifier (used in MCP protocol)
   */
  name: string;

  /**
   * Human-readable description shown to LLM
   */
  description: string;

  /**
   * Zod schema for input validation
   */
  inputSchema: ZodSchema;

  /**
   * Enable/disable tool at runtime
   * - true: Tool is registered and available
   * - false: Tool is hidden from ListTools and CallTool requests
   */
  enabled: boolean;
};

/**
 * OpenAPI-based tool definition
 * Declarative configuration executed via HTTP/axios
 */
export type McpOpenAPIToolDefinition = McpToolBase & {
  /**
   * Discriminator for type-safe execution routing
   */
  type: 'openapi';

  /**
   * HTTP method for API request
   */
  method: 'post' | 'get' | 'put' | 'delete' | 'patch';

  /**
   * URL path template (supports {param} placeholders)
   * Example: '/flights/{flightId}/bookings'
   */
  pathTemplate: string;

  /**
   * Parameter mappings for path/query/header extraction
   */
  executionParameters: Array<{
    name: string;
    in: 'path' | 'query' | 'header';
  }>;

  /**
   * Content-Type for request body (if applicable)
   */
  requestBodyContentType?: string;

  /**
   * Security scheme requirements (must match openapi/security-schemes.ts)
   */
  securityRequirements: Array<Record<string, []>>;

  /**
   * Optional response formatter
   * Transforms raw HTTP response into user-friendly text
   */
  serializer?: ResponseSerializer;
};

/**
 * Custom handler-based tool definition
 * Imperative implementation for non-HTTP operations
 */
export type McpCustomToolDefinition = McpToolBase & {
  /**
   * Discriminator for type-safe execution routing
   */
  type: 'custom';

  /**
   * Custom execution handler
   * Receives validated arguments, returns formatted result
   */
  handler: CustomToolHandler;
};

/**
 * Response serializer function signature
 */
export type ResponseSerializer = (response: AxiosResponse) => string;

/**
 * Custom tool handler function signature
 */
export type CustomToolHandler = (args: Record<string, unknown>) => Promise<CallToolResult>;

/**
 * Security scheme definition for OpenAPI authentication
 */
export type SecurityScheme = {
  description: string;
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  in: 'query' | 'header' | 'cookie';
  name: string;
  flows?: Record<string, { tokenUrl: string }>;
};
