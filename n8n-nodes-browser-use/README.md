# n8n Browser Use Node

This is a clean and simple custom n8n node for interacting with the Browser Use API for browser automation.

## Features

This node provides four main operations:

### 1. Session Management
- **Create Session**: Creates a new browser automation session
- **Terminate Session**: Terminates an existing session

### 2. Task Execution
- **Execute Task**: Executes automation tasks in a browser session

### 3. Screenshot Capture
- **Get Screenshots**: Retrieves screenshots from a session and converts them to binary PNG files

## Installation

1. Build the node:
   ```bash
   npm run build
   ```

2. Install in your n8n instance (see n8n documentation for installing community nodes)

## Usage

### Configuration
- **Base URL**: Set to your Browser Use API server (default: `http://localhost:8000/api`)

### Creating a Session

1. Select "Session" as the resource
2. Select "Create" as the operation
3. Execute the node

The response will include:
- `session_id`: The unique session identifier

### Executing a Task

1. Select "Task" as the resource
2. Select "Execute" as the operation
3. Enter the session ID from a previously created session
4. Enter your task prompt (e.g., "Navigate to google.com and search for n8n")
5. Execute the node

### Getting Screenshots

1. Select "Screenshot" as the resource
2. Select "Get" as the operation
3. Enter the session ID
4. Execute the node

The node will return an array of items, each containing:
- JSON data with screenshot metadata
- Binary PNG file of the screenshot

### Terminating a Session

1. Select "Session" as the resource
2. Select "Terminate" as the operation
3. Enter the session ID to terminate
4. Execute the node

## API Endpoints

The node communicates with your Browser Use API server at `http://localhost:8000/api`:

- `GET /session` - Create new session
- `POST /task/execute` - Execute task  
- `GET /screenshots/:session_id` - Get screenshots
- `GET /sessions/:session_id/agent/stop` - Terminate session

## Error Handling

The node includes proper error handling and will:
- Continue on fail if configured to do so
- Provide detailed error messages
- Handle network timeouts and API errors gracefully

## Binary Data

Screenshots are automatically converted from base64 to binary PNG files for easy use in workflows.

Screenshots are automatically converted from base64 to binary PNG files, making them ready for use with other n8n nodes or for download.
