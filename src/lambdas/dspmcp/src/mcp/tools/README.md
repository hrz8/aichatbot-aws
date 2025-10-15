# MCP Tools Architecture

## Overview

This directory contains a **file-based, type-safe tool architecture** that supports both OpenAPI-based tools (declarative HTTP calls) and custom tools (imperative handlers).

## Directory Structure

```
tools/
├── types.d.ts                          # Base type definitions & discriminated unions
├── registry.ts                         # Tool registration & execution dispatcher
├── index.ts                            # MCP server integration
│
├── openapi/                            # OpenAPI-specific infrastructure
│   ├── executor.ts                     # HTTP/axios execution engine
│   └── security-schemes.ts             # OAuth/API key configurations
│
├── initialize-booking-session/         # OpenAPI tool example
│   ├── index.ts                        # Tool definition export
│   ├── schema.ts                       # Zod input schema
│   ├── serializer.ts                   # Response formatter
│   └── types.d.ts                      # Tool-specific types
│
├── search-flights/                     # OpenAPI tool example
│   ├── index.ts
│   ├── schema.ts
│   ├── serializer.ts
│   └── types.d.ts
│
├── create-cart/                        # OpenAPI tool example
│   ├── index.ts
│   ├── schema.ts
│   ├── serializer.ts
│   └── types.d.ts
│
└── calculate-loyalty-points/           # Custom tool example (DISABLED)
    ├── index.ts
    ├── schema.ts
    ├── handler.ts                      # Custom implementation
    └── types.d.ts
```

## Tool Types

### 1. OpenAPI Tools

**Purpose**: Declarative tools that execute HTTP API calls via axios

**Structure**:
```typescript
export const myToolName: McpOpenAPIToolDefinition = {
  type: 'openapi',
  enabled: true,
  name: 'my_tool_name',
  description: 'What this tool does...',
  inputSchema: MyToolSchema,
  method: 'post',
  pathTemplate: '/api/endpoint',
  executionParameters: [{ name: 'param', in: 'header' }],
  requestBodyContentType: 'application/json',
  securityRequirements: [{ HeaderApiToken: [] }],
  serializer: serializeMyToolResponse,
};
```

**Files Required**:
- `index.ts` - Tool definition
- `schema.ts` - Zod input validation schema
- `serializer.ts` - Response formatting function
- `types.d.ts` - Tool-specific response types

### 2. Custom Tools

**Purpose**: Imperative tools for local calculations, file operations, aggregations, etc.

**Structure**:
```typescript
export const myCustomTool: McpCustomToolDefinition = {
  type: 'custom',
  enabled: true,
  name: 'my_custom_tool',
  description: 'What this tool does...',
  inputSchema: MyCustomSchema,
  handler: handleMyCustomTool,
};
```

**Files Required**:
- `index.ts` - Tool definition
- `schema.ts` - Zod input validation schema
- `handler.ts` - Implementation function
- `types.d.ts` - Tool-specific types

## Adding a New Tool

### Option 1: OpenAPI Tool

1. **Create directory**:
   ```bash
   mkdir src/mcp/tools/my-new-tool
   ```

2. **Create `schema.ts`**:
   ```typescript
   import { z } from 'zod';

   export const MyNewToolSchema = z.object({
     param1: z.string().describe('Description'),
     param2: z.number().optional(),
   }).describe('Tool description');
   ```

3. **Create `types.d.ts`** (if needed):
   ```typescript
   export interface MyToolResponse {
     data: {
       result: string;
     };
   }
   ```

4. **Create `serializer.ts`**:
   ```typescript
   import type { AxiosResponse } from 'axios';
   import type { MyToolResponse } from './types.js';

   export function serializeMyToolResponse(
     response: AxiosResponse<MyToolResponse>
   ): string {
     return `Result: ${response.data.data.result}`;
   }
   ```

5. **Create `index.ts`**:
   ```typescript
   import type { McpOpenAPIToolDefinition } from '../types.js';
   import { MyNewToolSchema } from './schema.js';
   import { serializeMyToolResponse } from './serializer.js';

   export const myNewTool: McpOpenAPIToolDefinition = {
     type: 'openapi',
     enabled: true,  // Set to false to disable
     name: 'my_new_tool',
     description: 'Description shown to LLM',
     inputSchema: MyNewToolSchema,
     method: 'post',
     pathTemplate: '/api/path',
     executionParameters: [],
     requestBodyContentType: 'application/json',
     securityRequirements: [
       {
         HeaderApiToken: [],
         HeaderApimSubscriptionKey: [],
         HeaderApiVersion: [],
       },
     ],
     serializer: serializeMyToolResponse,
   };
   ```

6. **Register in `registry.ts`**:
   ```typescript
   import { myNewTool } from './my-new-tool/index.js';

   const allTools: McpToolDefinition[] = [
     // ... existing tools
     myNewTool,
   ];
   ```

### Option 2: Custom Tool

1. **Create directory**:
   ```bash
   mkdir src/mcp/tools/my-custom-tool
   ```

2. **Create `schema.ts`** (same as OpenAPI)

3. **Create `types.d.ts`** (define input/output types)

4. **Create `handler.ts`**:
   ```typescript
   import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
   import { MyCustomToolSchema } from './schema.js';

   export async function handleMyCustomTool(
     args: Record<string, unknown>
   ): Promise<CallToolResult> {
     // Validate input
     const validated = MyCustomToolSchema.parse(args);

     // Perform custom logic
     const result = doSomething(validated);

     // Return formatted result
     return {
       content: [
         {
           type: 'text',
           text: `Result: ${result}`,
         },
       ],
     };
   }
   ```

5. **Create `index.ts`**:
   ```typescript
   import type { McpCustomToolDefinition } from '../types.js';
   import { MyCustomToolSchema } from './schema.js';
   import { handleMyCustomTool } from './handler.js';

   export const myCustomTool: McpCustomToolDefinition = {
     type: 'custom',
     enabled: true,  // Set to false to disable
     name: 'my_custom_tool',
     description: 'Description shown to LLM',
     inputSchema: MyCustomToolSchema,
     handler: handleMyCustomTool,
   };
   ```

6. **Register in `registry.ts`** (same as OpenAPI)

## Enabling/Disabling Tools

Tools can be enabled or disabled at runtime by changing the `enabled` field:

```typescript
// Enable a tool
export const myTool: McpToolDefinition = {
  // ...
  enabled: true,  // ✅ Tool will be registered
};

// Disable a tool
export const myTool: McpToolDefinition = {
  // ...
  enabled: false, // ❌ Tool will be hidden
};
```

**Use cases for disabling tools**:
- 🚧 Feature under development
- 🐛 Known bug in production, temporarily disable
- 🔧 Maintenance mode for specific API endpoint
- 🧪 A/B testing different tool implementations
- 📝 Template/example tools (like `calculate-loyalty-points`)

## Architecture Benefits

### ✅ Scalability
- **Linear Growth**: Adding tools doesn't increase complexity of existing files
- **Parallel Development**: Multiple developers can work on different tools without conflicts
- **Code Splitting**: Bundlers can tree-shake unused tools

### ✅ Maintainability
- **Single Responsibility**: Each file has one clear purpose
- **Locality**: Everything for one tool is in one directory
- **Discoverability**: `ls tools/` shows all available tools

### ✅ Type Safety
- **Discriminated Unions**: TypeScript enforces correct tool structure
- **Scoped Types**: Tool-specific types don't pollute global namespace
- **Exhaustiveness Checking**: Compiler ensures all tool types are handled

### ✅ Testability
- **Isolated Testing**: Test schemas, serializers, handlers independently
- **Clear Boundaries**: Each component has defined inputs/outputs
- **Easy Mocking**: Import only what you need for tests

### ✅ Developer Experience
- **Predictable Structure**: Every tool follows same pattern
- **Low Friction**: Adding tool = create directory + 4 files
- **Runtime Control**: Enable/disable tools without code changes (via config)

## Tool Execution Flow

```
1. MCP Client calls tool
        ↓
2. tools/index.ts receives CallTool request
        ↓
3. registry.ts looks up tool definition
        ↓
4. Check if tool is enabled
        ↓
5. Route to appropriate executor:
        ├─→ OpenAPI: openapi/executor.ts
        │     ├─ Validate input with Zod
        │     ├─ Build HTTP request
        │     ├─ Apply security (OAuth/API keys)
        │     ├─ Execute axios call
        │     └─ Format with serializer
        │
        └─→ Custom: tool's handler function
              ├─ Validate input with Zod
              ├─ Execute custom logic
              └─ Format result
        ↓
6. Return CallToolResult to client
```

## Registry Statistics

The registry tracks tool statistics for monitoring:

```typescript
import { getToolStats } from './registry.js';

const stats = getToolStats();
// {
//   total: 4,
//   enabled: 3,
//   disabled: 1,
//   byType: { openapi: 3, custom: 1 }
// }
```

## Migration Notes

### From Old Structure

**Before** (centralized):
- `tools.ts` - All tool definitions in single Map (284 lines)
- `input-schema.ts` - All Zod schemas (82 lines)
- `executor.ts` - Generic OpenAPI executor
- `types.d.ts` - All types mixed together

**After** (file-based):
- Each tool has its own directory
- Shared infrastructure in `openapi/`
- Type-safe discriminated unions
- Runtime enable/disable control

**Benefits**:
- **No breaking changes** - MCP protocol unchanged
- **Incremental migration** - Can coexist during transition
- **Better DX** - Easier to find and modify tool code

## Examples

### OpenAPI Tool: `search-flights`
**Purpose**: Search for available flights via HTTP API

**Key files**:
- `schema.ts` - Validates session token + search params
- `serializer.ts` - Formats 200+ lines of flight data into readable text
- `types.d.ts` - FlightSearchResponse with nested dictionaries

### Custom Tool: `calculate-loyalty-points`
**Purpose**: Local calculation of Enrich loyalty points

**Key files**:
- `schema.ts` - Validates cart ID, fare class, price, route
- `handler.ts` - Implements points calculation logic (base + bonuses)
- `types.d.ts` - LoyaltyCalculationResult interface

**Note**: This tool is **disabled** (`enabled: false`) and serves as a reference implementation.

## Best Practices

1. **Always use `*.d.ts` for types** - Follows TypeScript declaration file conventions

2. **Keep serializers focused** - One serializer per tool, extract common formatters to `helpers/`

3. **Document schemas thoroughly** - Use Zod `.describe()` for LLM context

4. **Handle errors gracefully** - Return user-friendly messages, log technical details

5. **Test in isolation** - Each tool should have unit tests for schema, serializer, handler

6. **Use enabled flag wisely** - Default `true` for production tools, `false` for templates/WIP

7. **Validate early** - Let Zod handle validation before business logic

8. **Type safety over flexibility** - Prefer discriminated unions over `any`

## Troubleshooting

### Tool not appearing in MCP client
- ✅ Check `enabled: true` in tool definition
- ✅ Verify tool is imported in `registry.ts`
- ✅ Check console logs for registration errors
- ✅ Run `pnpm run typecheck` to catch type errors

### Tool execution fails
- ✅ Validate input schema matches what client sends
- ✅ For OpenAPI tools: check security requirements are met
- ✅ For custom tools: check handler error handling
- ✅ Review console logs for detailed error messages

### Type errors after adding tool
- ✅ Ensure tool definition matches `McpOpenAPIToolDefinition` or `McpCustomToolDefinition`
- ✅ Check `type` discriminator is `'openapi'` or `'custom'`
- ✅ Verify all required fields are present
- ✅ Run `pnpm run typecheck` for detailed errors

## Future Extensions

Possible future tool types:

- **GraphQL Tools**: Query GraphQL APIs
- **gRPC Tools**: Call gRPC services
- **Lambda Tools**: Invoke AWS Lambda functions directly
- **Composite Tools**: Orchestrate multiple tools in sequence
- **Stream Tools**: Handle streaming responses

All can be added by extending the `McpToolDefinition` discriminated union.

## Contributing

When adding a new tool:

1. Follow the directory structure outlined above
2. Add comprehensive type definitions
3. Include `.describe()` on all schema fields
4. Write clear, LLM-friendly descriptions
5. Test with `pnpm run typecheck`
6. Consider adding tests in `__tests__/` subdirectory
7. Update this README if introducing new patterns

---

**Architecture Version**: 1.0
**Last Updated**: 2025-10-06
**Maintainer**: DSP Team
