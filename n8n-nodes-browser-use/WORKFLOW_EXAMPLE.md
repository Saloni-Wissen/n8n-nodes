# Example Workflow

Here's an example n8n workflow that demonstrates how to use the Browser Use node:

## Workflow: Create Session → Execute Task → Get Screenshots → Terminate Session

### 1. Create Session
```json
{
  "nodes": [
    {
      "parameters": {
        "resource": "session",
        "operation": "create"
      },
      "type": "n8n-nodes-browser-use.browserUse",
      "typeVersion": 1,
      "position": [250, 300],
      "id": "create-session",
      "name": "Create Browser Session"
    }
  ]
}
```

### 2. Execute Task
```json
{
  "parameters": {
    "resource": "task",
    "operation": "execute",
    "sessionId": "={{ $json.session_id }}",
    "task": "Navigate to google.com and search for 'n8n automation'"
  },
  "type": "n8n-nodes-browser-use.browserUse",
  "typeVersion": 1,
  "position": [450, 300],
  "id": "execute-task",
  "name": "Execute Task"
}
```

### 3. Get Screenshots
```json
{
  "parameters": {
    "resource": "screenshot",
    "operation": "get",
    "sessionId": "={{ $('Create Browser Session').item.json.session_id }}"
  },
  "type": "n8n-nodes-browser-use.browserUse",
  "typeVersion": 1,
  "position": [650, 300],
  "id": "get-screenshots",
  "name": "Get Screenshots"
}
```

### 4. Terminate Session
```json
{
  "parameters": {
    "resource": "session",
    "operation": "terminate",
    "sessionId": "={{ $('Create Browser Session').item.json.session_id }}"
  },
  "type": "n8n-nodes-browser-use.browserUse",
  "typeVersion": 1,
  "position": [850, 300],
  "id": "terminate-session",
  "name": "Terminate Session"
}
```

## Usage Notes

1. **Session ID**: The session ID from the "Create Session" step is passed through the workflow using n8n expressions
2. **Task Execution**: You can customize the task prompt to perform different browser automation tasks
3. **Screenshots**: The screenshot step returns binary PNG files that can be downloaded or processed further
4. **Error Handling**: Each node includes error handling and can be configured to continue on failure

## API Server Requirements

Make sure your Browser Use API server is running on `http://localhost:8000` before executing this workflow.

## Expected Output

- **Create Session**: Returns `session_id` and `vnc_url`
- **Execute Task**: Returns task execution status and results
- **Get Screenshots**: Returns array of items with JSON metadata and binary PNG files
- **Terminate Session**: Returns termination confirmation
