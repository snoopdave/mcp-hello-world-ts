import { type McpServer, ResourceTemplate, type ListResourcesCallback } from '@modelcontextprotocol/sdk/server/mcp.js';


/**
 * Available resources in the Hello World server
 */
const HELLO_RESOURCES = [
  {
    uri: 'hello://greeting',
    name: 'Hello World Greeting',
    description: 'A simple greeting message',
    mimeType: 'text/plain',
  },
  {
    uri: 'hello://info',
    name: 'Hello World Info',
    description: 'Information about the Hello World server',
    mimeType: 'text/plain',
  },
  {
    uri: 'hello://list',
    name: 'Resource List',
    description: 'List of all available resources',
    mimeType: 'text/plain',
  }
];

/**
 * Register Hello World resources
 */
export function registerHelloResources(server: McpServer): void {
  console.error('Registering Hello World resources...');

  // Define a list function for the list resource
  const listFunction: ListResourcesCallback = () => ({
    resources: HELLO_RESOURCES
  });

  // Create a properly typed undefined for the callback
  const emptyList = undefined as unknown as ListResourcesCallback;

  // Register the list resource separately for clarity
  server.resource(
    'HelloWorldList',
    new ResourceTemplate('hello://list', { list: listFunction }),
    async () => {
      console.error('MCP Server: List resource handler called');
      return {
        resources: HELLO_RESOURCES,
        contents: [{
          uri: 'hello://list',
          text: 'Available resources: hello://greeting, hello://info, hello://list',
          mimeType: 'text/plain',
        }]
      };
    }
  );

  // Register the greeting resource
  server.resource(
    'HelloWorldGreeting',
    new ResourceTemplate('hello://greeting', { list: emptyList }),
    async () => {
      console.error('MCP Server: Greeting resource handler called');
      return {
        contents: [{
          uri: 'hello://greeting',
          text: 'Hello, World!',
          mimeType: 'text/plain',
        }]
      };
    }
  );

  // Register the info resource
  server.resource(
    'HelloWorldInfo',
    new ResourceTemplate('hello://info', { list: emptyList }),
    async () => {
      console.error('MCP Server: Info resource handler called');
      return {
        contents: [{
          uri: 'hello://info',
          text: 'This is a Hello World MCP Server for demonstration purposes.',
          mimeType: 'text/plain',
        }]
      };
    }
  );

  console.error('Hello World resources registered successfully');
}