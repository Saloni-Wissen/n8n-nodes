# Troubleshooting Guide

## Fixed: Invalid URL Error

The "Invalid URL" error has been resolved by:

1. **Simplified approach**: Removed dependency on credentials for base URL
2. **Direct parameter**: Base URL is now a direct node parameter
3. **Better validation**: Added URL cleaning and validation
4. **Clear error messages**: Improved error reporting

## Required Setup Steps

### 1. Configure Base URL in Node
When adding the Browser Use node to your workflow:
1. In the node settings, set the **Base URL** field
2. Use one of these URLs depending on your setup:
   - For local API: `http://localhost:8000/api`
   - For Docker host: `http://host.docker.internal:8000/api`
   - For custom host: `http://YOUR_HOST_IP:8000/api`

### 2. No Credentials Required
The node no longer requires credentials to be set up. The Base URL is configured directly in each node instance.

### 3. Test API Connectivity
Before using the node, ensure your API is accessible:

```bash
# Test if your API is running
curl http://localhost:8000/api/session

# If using Docker, the URL might be different:
curl http://host.docker.internal:8000/api/session
```

## Docker Environment Notes

If n8n is running in Docker and your API is on the host machine:
- Use Base URL: `http://host.docker.internal:8000/api`
- Or use your host machine's IP address: `http://YOUR_HOST_IP:8000/api`

## Common Issues

### 1. Connection Refused
- Ensure your Browser Use API server is running on port 8000
- Check firewall settings
- Verify the API is binding to the correct interface (0.0.0.0:8000 for Docker access)

### 2. Wrong Base URL Format
- Make sure the Base URL does NOT end with a trailing slash
- Example: `http://localhost:8000/api` ✅
- Not: `http://localhost:8000/api/` ❌

### 3. URL Construction Issues
The node will now:
- Automatically remove trailing slashes from the base URL
- Construct proper full URLs like `http://localhost:8000/api/session`
- Provide clear error messages if the URL is malformed

### 4. CORS Issues
If you encounter CORS errors, add these headers to your API server:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
```

## Testing the Fix

1. **Reinstall the updated node** in n8n
2. **Add the Browser Use node** to a workflow
3. **Set the Base URL** directly in the node (e.g., `http://localhost:8000/api`)
4. **Test "Create Session"** operation

The node should now work without the "Invalid URL" error!

## URL Examples

### Local Development
```
Base URL: http://localhost:8000/api
```

### Docker Setup (n8n in container, API on host)
```
Base URL: http://host.docker.internal:8000/api
```

### Remote Server
```
Base URL: http://192.168.1.100:8000/api
```

The node will automatically construct the correct endpoints:
- Create Session: `{Base URL}/session`
- Execute Task: `{Base URL}/task/execute`
- Get Screenshots: `{Base URL}/screenshots/{sessionId}`
- Terminate Session: `{Base URL}/event/stop?session_id={sessionId}`
