import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from 'path';
import { beforeAll, expect, test } from "@jest/globals";

const projectRoot = process.cwd();

interface ToolDescription {
  name: string;
  description?: string;
}

interface ToolListResponse {
  tools: ToolDescription[];
}

// Setup and teardown
let client: Client;
let transport: StdioClientTransport;

beforeAll(async () => {

  // Calculate the correct path to the compiled server
  const serverPath = path.join(projectRoot, "dist", "index.js");
  console.log(`Looking for server at: ${serverPath}`);

  // Create the client with the stdio transport to spawn the server
  transport = new StdioClientTransport({
    command: "node",
    args: [serverPath],
  });

  client = new Client({
    name: "CodexBridgeTestClient",
    version: "1.0.0"
  });

  try {
    await client.connect(transport);
    console.log("Client connected to Codex MCP server!");
  } catch (err) {
    console.error("Error connecting client to server:", err);
    throw err;
  }
});

test("Lists the Codex tool", async () => {
  const listResponse = (await client.listTools()) as ToolListResponse;
  const toolNames = listResponse.tools.map((tool) => tool.name);

  expect(toolNames).toContain("run_codex");
});
