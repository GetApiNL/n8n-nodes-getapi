import type {
	IDataObject,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	INodeProperties,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

type PostReceive = (
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
) => Promise<INodeExecutionData[]>;

const ERROR_MESSAGES: Record<number, { message: string; description: string }> = {
	400: {
		message: 'Invalid request',
		description: 'GetAPI rejected the request. Check that all required fields are filled in.',
	},
	401: {
		message: 'Invalid API key',
		description: 'Check the API key in your GetAPI credentials.',
	},
	402: {
		message: 'No credits left',
		description: 'Your GetAPI credits are used up. Top up or wait for your monthly credits to renew.',
	},
	403: {
		message: 'Access denied',
		description: 'Your API key is not allowed to use this endpoint.',
	},
	429: {
		message: 'Rate limit reached',
		description: 'Too many requests per minute for this API key. Slow down or retry later.',
	},
	503: {
		message: 'Data source temporarily unavailable',
		description: 'The underlying register (for example KVK or VIES) did not respond. Retry later.',
	},
};

/**
 * Builds the post-receive handler for an operation.
 *
 * HTTP status errors are not thrown by n8n for these requests (see `ignoreHttpStatusErrors`),
 * so we decide here: 404 (nothing found) and 422 (invalid input, for example an invalid
 * VAT number) are valid answers and are returned as data. Everything else that is not a
 * success becomes a clear error message.
 */
export function handleResponse(rootProperty?: string): PostReceive {
	return async function (this, _items, response) {
		const status = response.statusCode;
		const body = (response.body ?? {}) as IDataObject;

		if (status < 400) {
			const list = rootProperty ? body[rootProperty] : undefined;
			if (Array.isArray(list)) {
				return list.map((json) => ({ json: json as IDataObject }));
			}
			return [{ json: body }];
		}

		if (status === 404 || status === 422) {
			// "Not found" for a list means an empty result, not an error.
			if (rootProperty) return [];
			return [{ json: body }];
		}

		const known = ERROR_MESSAGES[status];
		const apiMessage = typeof body.message === 'string' ? body.message : undefined;
		throw new NodeApiError(this.getNode(), body as JsonObject, {
			message: known?.message ?? `GetAPI returned HTTP ${status}`,
			description: apiMessage ?? known?.description,
			httpCode: String(status),
		});
	};
}

/** Routing request options shared by all operations. */
export function request(method: 'GET' | 'POST', url: string) {
	return { method, url, ignoreHttpStatusErrors: true } as const;
}

/** Optional house letter and house number addition, shared by the address-based operations. */
export function houseExtras(resource: string, operations: string[]): INodeProperties {
	return {
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: [resource], operation: operations } },
		options: [
			{
				displayName: 'House Letter',
				name: 'houseLetter',
				type: 'string',
				default: '',
				description: 'A single house letter, for example C. Do not put the addition here.',
				routing: { send: { type: 'query', property: 'house_letter' } },
			},
			{
				displayName: 'House Number Addition',
				name: 'houseNumberAddition',
				type: 'string',
				default: '',
				description:
					'The addition without a hyphen, keeping leading zeros, for example 03 (not 3 or C-03)',
				routing: { send: { type: 'query', property: 'house_number_addition' } },
			},
		],
	};
}
