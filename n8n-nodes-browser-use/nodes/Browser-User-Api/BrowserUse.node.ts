import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { Buffer } from 'buffer';

export class BrowserUse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Browser Use',
		name: 'browserUse',
		icon: 'file:icons/logo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Browser Use API for browser automation',
		defaults: {
			name: 'Browser Use',
		},
		inputs: ['main'] as any,
		outputs: ['main'] as any,

		properties: [

			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Session',
						value: 'session',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Screenshot',
						value: 'screenshot',
					},
				],
				default: 'session',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['session'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new browser session',
						action: 'Create a session',
					},
					{
						name: 'Terminate',
						value: 'terminate',
						description: 'Terminate an existing browser session',
						action: 'Terminate a session',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['task'],
					},
				},
				options: [
					{
						name: 'Execute',
						value: 'execute',
						description: 'Execute a task in the browser session',
						action: 'Execute a task',
					},
				],
				default: 'execute',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['screenshot'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get screenshots from a session',
						action: 'Get screenshots',
					},
				],
				default: 'get',
			},
			// Session ID field for terminate session and other operations
			{
				displayName: 'Session ID',
				name: 'sessionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['terminate'],
					},
				},
				default: '',
				description: 'The session ID to terminate',
			},
			// Task execution fields
			{
				displayName: 'Session ID',
				name: 'sessionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['execute'],
					},
				},
				default: '',
				description: 'The session ID to execute the task in',
			},
			{
				displayName: 'Task Prompt',
				name: 'task',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['execute'],
					},
				},
				default: '',
				description: 'The task prompt to execute',
				typeOptions: {
					rows: 3,
				},
			},
			// Screenshot fields
			{
				displayName: 'Session ID',
				name: 'sessionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['screenshot'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The session ID to get screenshots from',
			},
		],
	};
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
        const host = 'host.docker.internal';
		for (let i = 0; i < items.length; i++) {
			try {
				// Get base URL from node parameters



				const resource = this.getNodeParameter('resource', i);
				const operation = this.getNodeParameter('operation', i);

				let responseData;

				if (resource === 'session') {
					if (operation === 'create') {
						// Create session
						responseData = await this.helpers.httpRequest({
							method: 'POST',
							url: `http://${host}:8000/api/sessions`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
						});
						returnData.push({ json: responseData });
					} else if (operation === 'terminate') {
						const sessionId = this.getNodeParameter('sessionId', i) as string;
						responseData = await this.helpers.httpRequest({
							method: 'GET',
							url: `http://${host}:8000/api/sessions/${sessionId}/agent/stop`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
						});
						returnData.push({ json: responseData });
					}
				} else if (resource === 'task' && operation === 'execute') {
					const sessionId = this.getNodeParameter('sessionId', i) as string;
					const task = this.getNodeParameter('task', i) as string;

					responseData = await this.helpers.httpRequest({
						method: 'POST',
						url: `http://${host}:8000/api/task/execute`,
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body: {
							task,
							session_id: sessionId,
						},
					});
					returnData.push({ json: responseData });
				} else if (resource === 'screenshot' && operation === 'get') {
					const sessionId = this.getNodeParameter('sessionId', i) as string;

					const screenshotResponse = await this.helpers.httpRequest({
						method: 'GET',
						url: `http://${host}:8000/api/screenshots/${sessionId}`,
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
					});

					// Process screenshots and convert base64 to binary
					if (Array.isArray(screenshotResponse)) {
						for (const screenshot of screenshotResponse) {
							if (screenshot.screenshot_base64) {
								// Remove data:image/png;base64, prefix if present
								const base64Data = screenshot.screenshot_base64.replace(/^data:image\/png;base64,/, '');

								// Convert base64 to binary using Node.js Buffer
								const binaryBuffer = Buffer.from(base64Data, 'base64');

								// Create binary data
								const binaryPropertyName = `screenshot_${screenshot.step_number}`;

								returnData.push({
									json: {
										session_id: screenshot.session_id,
										step_number: screenshot.step_number,
										url: screenshot.url,
										title: screenshot.title,
										created_at: screenshot.created_at,
										agent_id: screenshot.agent_id,
										tabs: screenshot.tabs || [],
										interacted_element: screenshot.interacted_element,
									},
									binary: {
										[binaryPropertyName]: await this.helpers.prepareBinaryData(
											binaryBuffer,
											`screenshot_${screenshot.step_number}.png`,
											'image/png'
										),
									},
								});
							}
						}
					} else {
						returnData.push({ json: screenshotResponse });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), (error as Error).message, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
