# Hello World MCP Server

A minimal [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server written in TypeScript. This project demonstrates how to create MCP-compliant resources and tools for use with LLMs and MCP-enabled clients like [Claude Desktop](https://claude.ai/download).

## Features

- **MCP Resources:**  
  Provides simple resources at `hello://greeting`, `hello://info`, and a resource list at `hello://list`.

- **MCP Tool:**  
  A `helloTool` that echoes messages or returns a default greeting.

- **Stdio Transport:**  
  Communicates via standard input/output, making it easy to integrate with MCP clients.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

### Install Dependencies

```sh
npm install
```

---

### Build the Project

Compile TypeScript source files to JavaScript in the `dist/` directory:

```sh
npm run build
```

---

### Run the Server (Standalone)

```sh
npm start
```

This will start the MCP server via Node.js using the built output.

---

### Run Tests

Integration tests are provided to verify the MCP server works end-to-end:

```sh
npm test
```

This runs the tests in `src/integration.test.ts` using [Jest](https://jestjs.io/).

---

## Using with Claude Desktop

You can configure Claude Desktop or any MCP client to use this server as a plugin/tool by specifying the command to launch the MCP server.

### Example Configuration Snippet

Add the following to your Claude Desktop settings (replace the path with your actual project path):

```json
"hello-world-mcp": {
  "command": "node",
  "args": [
    "/path/to/mcp-hello-world-ts/dist/index.js"
  ]
}
```

- Replace `/path/to/mcp-hello-world-ts/` with the full path to where you cloned this repo.
- Make sure you have built the project (`npm run build`) before starting Claude Desktop.

---

## Project Structure

```
.
├── src/
│   ├── index.ts                # Main MCP server entry point
│   ├── resources/helloResource.ts  # MCP resource definitions
│   └── tools/helloTool.ts      # MCP tool definition
├── dist/                       # Compiled JS output
├── package.json
├── tsconfig.json
├── README.md
└── ...
```

---

## Customization

- To add new tools or resources, create new files in `src/resources/` or `src/tools/` and register them in `src/index.ts`.
- Modify `helloResource.ts` or `helloTool.ts` to change the greeting or add additional functionality.

---

## License

MIT License

---

## Author

- [@snoopdave](https://github.com/snoopdave)

---
