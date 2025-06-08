import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {registerHelloResources} from "./resources/helloResource.js";
import {registerHelloTool} from "./tools/helloTool.js";


/**
 * Main entry point for the Hello World MCP Server
 */
async function main(): Promise<void> {
  // Create the MCP Server
  const server = new McpServer({
    name: "HelloWorldServer",
    version: "1.0.0",
    description: "A minimal MCP server for Hello World!"
  });

  console.error('Registering Hello World modules...');

  registerHelloResources(server);
  registerHelloTool(server);

  // Create the stdio transport
  const transport = new StdioServerTransport();

  // Connect the server to the transport
  console.error('Hello World MCP Server starting...');
  try {
    await server.connect(transport);
    console.error('Hello World MCP Server connected');
  } catch (error) {
    console.error('Error connecting MCP server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch((error: unknown) => {
  console.error('Fatal error:', error);
  process.exit(1);
});