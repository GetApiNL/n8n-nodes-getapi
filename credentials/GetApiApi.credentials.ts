import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class GetApiApi implements ICredentialType {
	name = 'getApiApi';

	displayName = 'GetAPI API';

	icon: Icon = {
		light: 'file:../icons/getapi.svg',
		dark: 'file:../icons/getapi.dark.svg',
	};

	documentationUrl = 'https://getapi.nl/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			placeholder: 'ga_live_...',
			description:
				'Your GetAPI API key. <a href="https://getapi.nl/register?utm_source=n8n&utm_medium=integration&utm_campaign=n8n-node&utm_content=credential">Get a free API key</a> (250 free credits at registration).',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Api-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	// Uses the free (0 credits) account endpoint, so testing a key never costs a credit.
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.getapi.nl',
			url: '/v1/account',
			method: 'GET',
		},
	};
}
