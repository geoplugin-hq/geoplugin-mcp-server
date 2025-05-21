#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Geoplugin } from "./geoplugin.js";
import { GeopluginIPResponseSchema } from "./types.js";

const server = new Server(
  {
    name: "GeoPlugin",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const nodeVersion = process.version;
const majorVersion =
  nodeVersion.indexOf(".") > -1
    ? parseInt(nodeVersion.slice(1).split(".")[0], 10)
    : 0;

if (majorVersion < 18) {
  const nodeExecutablePath = process.execPath;

  console.error(
    `[GeoPlugin] - Node Version ${nodeVersion} is not supported. Requires version 18 or higher.\n Executable Path: ${nodeExecutablePath}`
  );
  process.exit(1);
}

let apiKey = process.env.GEOPLUGIN_API_KEY;

if (!apiKey) {
  console.error("GEOPLUGIN_API_KEY not provided in environment variables.");
  process.exit(1);
}

const geoplugin = new Geoplugin(apiKey);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_ip_location",
        description: "Get the location of a given IP address",
        inputSchema: {
          type: "object",
          properties: {
            ipAddress: {
              type: "string",
              description: "The IP address to get the location of.",
            },
          },
          outputSchema: GeopluginIPResponseSchema,
        },
      },
      {
        name: "get_my_location",
        description: "Get the location and IP Address of the current user",
        inputSchema: {
          type: "object",
          properties: {},
        },
        outputSchema: GeopluginIPResponseSchema,
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (request.params.name === "get_ip_location") {
      const input = request.params.arguments as { ipAddress: string };
      const output = await geoplugin.apiRequest.getIPLocation(input.ipAddress);

      if (!output) {
        throw new Error("Failed to fetch IP location.");
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(output, null, 2),
          },
        ],
      };
    }

    if (request.params.name === "get_my_location") {
      const output = await geoplugin.apiRequest.getMyLocation();

      if (!output) {
        throw new Error("Failed to fetch my location.");
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(output, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${request.params.name}`);
  } catch (err: unknown) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: String(err),
        },
      ],
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
