import type { INodeProperties } from 'n8n-workflow';
import { handleResponse, request } from '../shared';

export const companyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['company'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get the details of a company by its KVK number',
				action: 'Get a company',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search Dutch companies by name or KVK number',
				action: 'Search companies',
				routing: {
					request: request('GET', '/v1/kvk/search'),
					output: { postReceive: [handleResponse('results')] },
				},
			},
			{
				name: 'Validate',
				value: 'validate',
				description: 'Check if a KVK number exists and is active',
				action: 'Validate a KVK number',
				routing: {
					request: request('POST', '/v1/kvk/validate'),
					output: { postReceive: [handleResponse()] },
				},
			},
		],
		default: 'search',
	},
];

export const companyFields: INodeProperties[] = [
	// ----- Get -----
	{
		displayName: 'KVK Number',
		name: 'kvkNumber',
		type: 'string',
		required: true,
		default: '',
		placeholder: '53743792',
		description: 'The 8-digit KVK (Chamber of Commerce) number',
		displayOptions: { show: { resource: ['company'], operation: ['get'] } },
		routing: {
			request: {
				method: 'GET',
				url: '=/v1/kvk/{{ toPathSegment($value) }}',
				ignoreHttpStatusErrors: true,
			},
			output: { postReceive: [handleResponse()] },
		},
	},

	// ----- Validate -----
	{
		displayName: 'KVK Number',
		name: 'kvkNumberToValidate',
		type: 'string',
		required: true,
		default: '',
		placeholder: '53743792',
		description: 'The 8-digit KVK (Chamber of Commerce) number to check',
		displayOptions: { show: { resource: ['company'], operation: ['validate'] } },
		routing: { send: { type: 'body', property: 'kvkNummer' } },
	},

	// ----- Search -----
	{
		displayName: 'Company Name',
		name: 'companyName',
		type: 'string',
		default: '',
		description: 'Trade name to search for. Fill in this field, the KVK number, or both.',
		displayOptions: { show: { resource: ['company'], operation: ['search'] } },
		routing: { send: { type: 'query', property: 'naam' } },
	},
	{
		displayName: 'KVK Number',
		name: 'searchKvkNumber',
		type: 'string',
		default: '',
		description: 'The 8-digit KVK number to search for',
		displayOptions: { show: { resource: ['company'], operation: ['search'] } },
		routing: { send: { type: 'query', property: 'kvkNummer' } },
	},
	{
		displayName: 'Options',
		name: 'searchOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['company'], operation: ['search'] } },
		options: [
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1,
				description: 'Page number of the results',
				routing: { send: { type: 'query', property: 'page' } },
			},
			{
				displayName: 'Results per Page',
				name: 'size',
				type: 'options',
				options: [
					{ name: '5', value: 5 },
					{ name: '10', value: 10 },
					{ name: '25', value: 25 },
					{ name: '50', value: 50 },
					{ name: '75', value: 75 },
				],
				default: 25,
				description: 'How many results to return per page (KVK returns at most 50 per request)',
				routing: { send: { type: 'query', property: 'size' } },
			},
		],
	},
];
