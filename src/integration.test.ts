import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from 'path';
import { beforeAll, expect, test } from '@jest/globals';

const projectRoot = process.cwd();

// Define response types
interface ContentItem {
  type: string;
  text: string;
}

interface ResourceItem {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

interface ToolResponse {
  content: ContentItem[];
  isError?: boolean;
}

interface ResourceResponse {
  contents: {
    uri: string;
    text: string;
    mimeType: string;
  }[];
  resources?: ResourceItem[];
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
    name: "HelloWorldTestClient",
    version: "1.0.0"
  });

  try {
    await client.connect(transport);
    console.log("Client connected to Hello World MCP server!");
  } catch (err) {
    console.error("Error connecting client to server:", err);
    throw err;
  }
});

// In your test, make sure you use the right method names
test('Call hello tool with no arguments', async () => {
  const response = await client.callTool({
    name: "helloTool",
    arguments: {}
  }) as unknown as ToolResponse;

  expect(response.content[0].text).toBe('Hello, World!');
});

test('Call hello tool with a message', async () => {
  const response = await client.callTool({
    name: "helloTool",
    arguments: {
      message: "Hello from the test suite!"
    }
  }) as unknown as ToolResponse;

  expect(response.content[0].text).toBe('You said: Hello from the test suite!');
});

test('Navigate to available resources', async () => {
  // First list available resources
  const listResponse = await client.readResource({
    uri: 'hello://list'
  }) as unknown as ResourceResponse;

  // Check if resources exist
  expect(listResponse.resources).toBeDefined();

  // Extract resource URIs from the response
  const resources = listResponse.resources?.map(r => r.uri) || [];
  console.log("Available resources:", resources);

  // Verify resources count
  expect(resources.length).toBeGreaterThan(0);

  // Verify expected resources are present
  expect(resources).toContain('hello://greeting');
  expect(resources).toContain('hello://info');
  expect(resources).toContain('hello://list');

  // Verify contents exist
  expect(listResponse.contents).toBeDefined();
  expect(listResponse.contents.length).toBeGreaterThan(0);

  // Check that the text contains information about available resources
  expect(listResponse.contents[0].text).toContain('Available resources');
});
