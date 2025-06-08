import { type McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

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

  // Simple Hello World resource
  server.resource(
    'HelloWorld',
    // Use a simple wildcard template to match all hello:// URIs
    new ResourceTemplate('hello://{*}', {
      list: () => {
        console.error('MCP Server: list() called for Hello World resource');
        return {
          resources: HELLO_RESOURCES,
          contents: [
            {
              uri: 'hello://list',
              text: 'Available resources: hello://greeting, hello://info, hello://list',
              mimeType: 'text/plain',
            }
          ],
        };
      }
    }),
    async (uri, params) => {
      console.error(`MCP Server: Resource handler called with URI: ${uri}`);
      
      try {
        // Use a consistent approach to handle the URI: if we can't determine it, use a default
        const uriStr = uri ? String(uri) : 'hello://greeting';
        
        // Simple resource type extraction - default to greeting if we can't determine
        const resourceType = uriStr.startsWith('hello://') 
          ? uriStr.substring(8).split('?')[0] || 'greeting'
          : 'greeting';
          
        console.error(`MCP Server: Resource type: ${resourceType}`);
        
        // Extract name parameter if present
        let name = 'World';
        try {
          const urlObj = new URL(uriStr);
          name = urlObj.searchParams.get('name') || 'World';
        } catch (e) {
          // URL parsing failed, use default name
          console.error(`MCP Server: Error parsing URL: ${e instanceof Error ? e.message : String(e)}`);
        }
        
        // Handle each resource type with a simplified approach
        switch (resourceType) {
          case 'greeting':
          case '':
            return {
              contents: [{
                uri: 'hello://greeting',
                text: `Hello, ${name}!`,
                mimeType: 'text/plain',
              }]
            };
            
          case 'info':
            return {
              contents: [{
                uri: 'hello://info',
                text: 'This is a Hello World MCP Server for demonstration purposes.',
                mimeType: 'text/plain',
              }]
            };
            
          case 'list':
            return {
              resources: HELLO_RESOURCES,
              contents: [{
                uri: 'hello://list',
                text: 'Available resources: hello://greeting, hello://info, hello://list',
                mimeType: 'text/plain',
              }]
            };
            
          default:
            return {
              contents: [{
                uri: uriStr,
                text: `Unknown resource: ${resourceType}. Available resources: greeting, info, list`,
                mimeType: 'text/plain',
              }]
            };
        }
      } catch (error) {
        console.error('MCP Server: Error in hello resource:', error);
        return {
          contents: [{
            uri: 'hello://error',
            text: `Error processing request: ${error instanceof Error ? error.message : String(error)}`,
            mimeType: 'text/plain',
          }]
        };
      }
    }
  );
  
  console.error('Hello World resources registered successfully');
}