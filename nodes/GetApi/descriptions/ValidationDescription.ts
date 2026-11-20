import type { INodeProperties } from 'n8n-workflow';
import { handleResponse, request } from '../shared';

export const validationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['validation'] } },
		options: [
			{
				name: 'Validate Email',
				value: 'email',
				description: 'Check format, domain and mail server of an email address',
				action: 'Validate an email address',
				routing: {
					request: request('POST', '/v1/validate/email'),
					output: { postReceive: [handleResponse()] },
				},
			},
			{
				name: 'Validate IBAN',
				value: 'iban',
				description: 'Validate an IBAN and look up the bank and BIC',
				action: 'Validate an IBAN',
				routing: {
					request: request('POST', '/v1/validate/iban'),
					output: { postReceive: [handleResponse()] },
				},
			},
			{
				name: 'Validate VAT Number',
				value: 'vat',
				description: 'Validate an EU VAT number through VIES (1 credit)',
				action: 'Validate a VAT number',
				routing: {
					request: request('POST', '/v1/validate/vat'),
					output: { postReceive: [handleResponse()] },
				},
			},
		],
		default: 'vat',
	},
];

export const validationFields: INodeProperties[] = [
	{
		displayName: 'VAT Number',
		name: 'vatNumber',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'NL820646660B01',
		description: 'The VAT number, starting with the 2-letter country code',
		displayOptions: { show: { resource: ['validation'], operation: ['vat'] } },
		routing: { send: { type: 'body', property: 'vat_number' } },
	},
	{
		displayName: 'IBAN',
		name: 'iban',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'NL91ABNA0417164300',
		displayOptions: { show: { resource: ['validation'], operation: ['iban'] } },
		routing: { send: { type: 'body', property: 'iban' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'ibanAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['validation'], operation: ['iban'] } },
		options: [
			{
				displayName: 'BIC',
				name: 'bic',
				type: 'string',
				default: '',
				description: 'Optional BIC to check against the IBAN',
				routing: { send: { type: 'body', property: 'bic' } },
			},
		],
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['validation'], operation: ['email'] } },
		routing: { send: { type: 'body', property: 'email' } },
	},
];
