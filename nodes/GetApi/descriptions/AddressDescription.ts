import type { INodeProperties } from 'n8n-workflow';
import { handleResponse, houseExtras, request } from '../shared';

export const addressOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['address'] } },
		options: [
			{
				name: 'Autocomplete',
				value: 'autocomplete',
				description: 'Get address suggestions while typing',
				action: 'Autocomplete an address',
				routing: {
					request: request('GET', '/v1/kadaster/bag/address-suggest'),
					output: { postReceive: [handleResponse('suggestions')] },
				},
			},
			{
				name: 'Get by BAG ID',
				value: 'getByBagId',
				description: 'Look up an address by its BAG nummeraanduiding ID',
				action: 'Get an address by BAG ID',
				routing: {
					request: request('GET', '/v1/kadaster/bag/id'),
					output: { postReceive: [handleResponse()] },
				},
			},
			{
				name: 'Lookup',
				value: 'lookup',
				description: 'Look up an address by postcode and house number (BAG)',
				action: 'Look up an address',
				routing: {
					request: request('GET', '/v1/kadaster/bag/address'),
					output: { postReceive: [handleResponse()] },
				},
			},
			{
				name: 'Postcode Lookup',
				value: 'postcodeLookup',
				description: 'Get street, city and coordinates for a postcode',
				action: 'Look up a postcode',
				routing: {
					request: request('GET', '/v1/lookup/postcode'),
					output: { postReceive: [handleResponse()] },
				},
			},
		],
		default: 'lookup',
	},
];

export const addressFields: INodeProperties[] = [
	// ----- Lookup + Postcode Lookup -----
	{
		displayName: 'Postcode',
		name: 'postcode',
		type: 'string',
		required: true,
		default: '',
		placeholder: '3023KN',
		description: 'Dutch postcode, with or without a space',
		displayOptions: { show: { resource: ['address'], operation: ['lookup', 'postcodeLookup'] } },
		routing: { send: { type: 'query', property: 'postcode' } },
	},
	{
		displayName: 'House Number',
		name: 'houseNumber',
		type: 'number',
		required: true,
		typeOptions: { minValue: 1, maxValue: 99999 },
		default: 1,
		description: 'The numeric part of the house number only',
		displayOptions: { show: { resource: ['address'], operation: ['lookup'] } },
		routing: { send: { type: 'query', property: 'house_number' } },
	},
	houseExtras('address', ['lookup']),
	{
		displayName: 'House Number',
		name: 'postcodeHouseNumber',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 99999 },
		default: 0,
		description:
			'Optional house number. Leave at 0 to look up the postcode only. Only filled in values are sent.',
		displayOptions: { show: { resource: ['address'], operation: ['postcodeLookup'] } },
		routing: {
			send: {
				type: 'query',
				property: 'number',
				value: '={{ $value > 0 ? $value : undefined }}',
			},
		},
	},

	// ----- Autocomplete -----
	{
		displayName: 'Search Text',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'Hooidrift 161',
		description: 'The text to get address suggestions for (2 to 100 characters)',
		displayOptions: { show: { resource: ['address'], operation: ['autocomplete'] } },
		routing: { send: { type: 'query', property: 'q' } },
	},
	{
		displayName: 'Max Suggestions',
		name: 'maxSuggestions',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 25 },
		default: 10,
		description: 'Maximum number of suggestions to return (1 to 25)',
		displayOptions: { show: { resource: ['address'], operation: ['autocomplete'] } },
		routing: { send: { type: 'query', property: 'limit' } },
	},

	// ----- Get by BAG ID -----
	{
		displayName: 'BAG ID',
		name: 'bagId',
		type: 'string',
		required: true,
		default: '',
		placeholder: '0599200000200000',
		description: 'The 16-digit BAG nummeraanduiding ID',
		displayOptions: { show: { resource: ['address'], operation: ['getByBagId'] } },
		routing: { send: { type: 'query', property: 'id' } },
	},
];
