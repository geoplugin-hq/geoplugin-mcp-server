# GeoPlugin MCP Server

A Model Context Protocol server that enables AI assistants to use GeoPlugin.

## How It Works

The MCP server:

- Connects to your GeoPlugin API and allows AI Assistants to get locations of IP Addresses.

## Usage with Claude Desktop

### Prerequisites

- NodeJS
- MCP Client (like Claude Desktop App)
- GeoPlugin API Key

### Installation

To use this server with the Claude Desktop app, add the following configuration to the "mcpServers" section of your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "geoplugin": {
      "command": "npx",
      "args": ["-y", "@geoplugin/geoplugin-mcp-server"],
      "env": {
        "GEOPLUGIN_API_KEY": "<API KEY GOES HERE>"
      }
    }
  }
}
```

- `GEOPLUGIN_API_KEY` - You can generate an API key at https://www.geoplugin.com/.
