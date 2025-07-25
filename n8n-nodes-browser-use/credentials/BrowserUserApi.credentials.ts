import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BrowserUserApi implements ICredentialType {
	name = 'browserUserApi';
	displayName = 'Browser User API';
	documentationUrl = 'http://localhost:8000/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://10.0.2.6:8000/api',
			description: 'The base URL of the Browser User API server',
		},

	];
}
