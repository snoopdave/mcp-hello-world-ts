import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCodexTool } from "./tools/codexTool.js";


/**
 * Main entry point for the Hello World MCP Server
 */
async function main(): Promise<void> {
  // Create the MCP Server
  const server = new McpServer({
    name: "CodexBridgeServer",
    version: "1.0.0",
    description: "An MCP server that bridges to the Codex CLI."
  });

  console.error("Registering Codex tool...");

  registerCodexTool(server);

  // Create the stdio transport
  const transport = new StdioServerTransport();

  // Connect the server to the transport
  console.error("Codex MCP Server starting...");
  try {
    await server.connect(transport);
    console.error("Codex MCP Server connected");
  } catch (error) {
    console.error("Error connecting MCP server:", error);
    process.exit(1);
  }
}

// Start the server
main().catch((error: unknown) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
