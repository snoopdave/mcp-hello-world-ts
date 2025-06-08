import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Register the Hello World tool
 */
export function registerHelloTool(server: McpServer): void {
  console.error('Registering Hello World tool...');
  
  // Tool to echo a message or respond with "Hello, World!"
  server.tool(
    "helloTool",
    {
      message: z.string().optional().describe("Message to echo back. If not provided, returns a default greeting.")
    },
    async ({ message }) => {
      try {
        const responseMessage = message ? `You said: ${message}` : "Hello, World!";
        
        return {
          content: [
            {
              type: "text",
              text: responseMessage
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error in hello tool: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );
  
  console.error('Hello World tool registered successfully');
}
