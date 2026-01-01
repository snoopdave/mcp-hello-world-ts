import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { createInterface } from "node:readline";
import { z } from "zod";

type CodexEvent = Record<string, unknown> | { type: "unparsed"; line: string };

type CodexResult = {
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
  events: CodexEvent[];
};

const codexSchema = z.object({
  prompt: z.string().describe("Task or instruction to pass to codex exec."),
  repoPath: z
    .string()
    .optional()
    .describe("Path to the repository where codex should run. Defaults to the MCP server working directory."),
  mode: z
    .enum(["safe", "full-auto"])
    .default("safe")
    .describe("Execution mode: safe (default) or full-auto for file edits."),
  json: z.boolean().default(true).describe("Emit codex JSONL and return parsed events."),
  sandbox: z
    .enum(["danger-full-access"])
    .optional()
    .describe("Optional sandbox setting. Use danger-full-access only in a controlled sandbox.")
});

async function runCodexExec({
  args,
  cwd,
  json
}: {
  args: string[];
  cwd: string;
  json: boolean;
}): Promise<CodexResult> {
  return new Promise((resolve, reject) => {
    const child = spawn("codex", args, {
      cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    });

    const stdoutLines: string[] = [];
    const stderrLines: string[] = [];
    const events: CodexEvent[] = [];

    if (child.stdout) {
      if (json) {
        const readline = createInterface({ input: child.stdout });
        readline.on("line", (line) => {
          stdoutLines.push(line);
          const trimmed = line.trim();
          if (!trimmed) {
            return;
          }
          try {
            events.push(JSON.parse(trimmed) as CodexEvent);
          } catch (error) {
            events.push({
              type: "unparsed",
              line: trimmed
            });
          }
        });
      } else {
        child.stdout.on("data", (chunk: Buffer) => {
          stdoutLines.push(chunk.toString());
        });
      }
    }

    if (child.stderr) {
      child.stderr.on("data", (chunk: Buffer) => {
        stderrLines.push(chunk.toString());
      });
    }

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (exitCode, signal) => {
      resolve({
        exitCode,
        signal,
        stdout: stdoutLines.join("\n"),
        stderr: stderrLines.join(""),
        events
      });
    });
  });
}

function formatCodexOutput(result: CodexResult, json: boolean): string {
  if (json) {
    return JSON.stringify(
      {
        exitCode: result.exitCode,
        signal: result.signal,
        events: result.events,
        stdout: result.stdout,
        stderr: result.stderr
      },
      null,
      2
    );
  }

  const lines = [
    `exitCode: ${result.exitCode ?? "unknown"}`,
    result.signal ? `signal: ${result.signal}` : undefined,
    result.stdout ? `stdout:\n${result.stdout}` : undefined,
    result.stderr ? `stderr:\n${result.stderr}` : undefined
  ].filter((line): line is string => Boolean(line));

  return lines.join("\n\n");
}

/**
 * Register the Codex tool bridge for MCP clients.
 */
export function registerCodexTool(server: McpServer): void {
  console.error("Registering Codex tool...");

  server.tool("run_codex", codexSchema.shape, async ({ prompt, repoPath, mode, json, sandbox }) => {
    try {
      const workingDirectory = repoPath ?? process.cwd();
      await access(workingDirectory);

      const args = ["exec", prompt];
      if (json) {
        args.push("--json");
      }
      if (mode === "full-auto") {
        args.push("--full-auto");
      }
      if (sandbox) {
        args.push("--sandbox", sandbox);
      }

      const result = await runCodexExec({ args, cwd: workingDirectory, json });
      const text = formatCodexOutput(result, json);

      if (result.exitCode && result.exitCode !== 0) {
        return {
          content: [{ type: "text", text }],
          isError: true
        };
      }

      return {
        content: [{ type: "text", text }]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error running codex exec: ${error instanceof Error ? error.message : String(error)}`
          }
        ],
        isError: true
      };
    }
  });

  console.error("Codex tool registered successfully");
}
