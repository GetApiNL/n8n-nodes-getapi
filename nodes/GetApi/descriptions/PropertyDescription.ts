import type { INodeProperties } from 'n8n-workflow';
import { handleResponse, houseExtras, request } from '../shared';

export const propertyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['property'] } },
		options: [
			{
				name: 'Get Energy Label',
				value: 'energyLabel',
				description: 'Get the registered energy label (EP-Online) for an address',
				action: 'Get an energy label',
				routing: {
					request: request('GET', '/v1/property/energy-label'),
					output: { postReceive: [handleResponse()] },
				},
			},
			{
				name: 'Get Property Data',
				value: 'propertyData',
				description: 'Get combined property data: BAG, energy label, WOZ value and more',
				action: 'Get property data',
				routing: {
					request: request('GET', '/v1/property/pandgegevens'),
					output: { postReceive: [handleResponse()] },
				},
			},
			{
				name: 'Get WOZ Value',
				value: 'wozValue',
				description: 'Get the WOZ value of a property, including the last three years (10 credits)',
				action: 'Get a WOZ value',
				routing: {
					request: request('GET', '/v1/property/woz-waarde'),
					output: { postReceive: [handleResponse()] },
				},
			},
		],
		default: 'wozValue',
	},
];

export const propertyFields: INodeProperties[] = [
	{
		displayName: 'Postcode',
		name: 'postcode',
		type: 'string',
		required: true,
		default: '',
		placeholder: '3023KN',
		description: 'Dutch postcode, with or without a space',
		displayOptions: {
			show: { resource: ['property'], operation: ['wozValue', 'propertyData'] },
		},
		routing: { send: { type: 'query', property: 'postcode' } },
	},
	{
		displayName: 'Postcode',
		name: 'energyLabelPostcode',
		type: 'string',
		required: true,
		default: '',
		placeholder: '3023KN',
		description: 'Dutch postcode, with or without a space',
		displayOptions: { show: { resource: ['property'], operation: ['energyLabel'] } },
		routing: { send: { type: 'query', property: 'zipcode' } },
	},
	{
		displayName: 'House Number',
		name: 'houseNumber',
		type: 'number',
		required: true,
		typeOptions: { minValue: 1, maxValue: 99999 },
		default: 1,
		description: 'The numeric part of the house number only',
		displayOptions: {
			show: {
				resource: ['property'],
				operation: ['wozValue', 'propertyData', 'energyLabel'],
			},
		},
		routing: { send: { type: 'query', property: 'house_number' } },
	},
	houseExtras('property', ['wozValue', 'propertyData', 'energyLabel']),
];
