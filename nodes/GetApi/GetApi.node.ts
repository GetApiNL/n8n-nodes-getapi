import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { addressFields, addressOperations } from './descriptions/AddressDescription';
import { companyFields, companyOperations } from './descriptions/CompanyDescription';
import { propertyFields, propertyOperations } from './descriptions/PropertyDescription';
import { validationFields, validationOperations } from './descriptions/ValidationDescription';

// Keep in sync with the version in package.json.
const CLIENT = 'n8n-nodes-getapi/0.0.1';

export class GetApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GetAPI',
		name: 'getApi',
		icon: { light: 'file:../../icons/getapi.svg', dark: 'file:../../icons/getapi.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Dutch company, address, property and validation data from GetAPI.nl: we collect and publish the data ourselves',
		defaults: { name: 'GetAPI' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'getApiApi', required: true }],
		requestDefaults: {
			baseURL: 'https://api.getapi.nl',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'User-Agent': CLIENT,
				'X-GetAPI-Client': CLIENT,
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Address', value: 'address' },
					{ name: 'Company', value: 'company' },
					{ name: 'Property', value: 'property' },
					{ name: 'Validation', value: 'validation' },
				],
				default: 'company',
			},
			...companyOperations,
			...companyFields,
			...addressOperations,
			...addressFields,
			...propertyOperations,
			...propertyFields,
			...validationOperations,
			...validationFields,
		],
	};
}
