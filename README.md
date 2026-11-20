# n8n-nodes-getapi

This is an n8n community node for [GetAPI.nl](https://getapi.nl/?utm_source=n8n&utm_medium=integration&utm_campaign=n8n-node). It gives your n8n workflows access to Dutch company, address, property and validation data with a single API key.

GetAPI collects, normalizes and publishes this data itself, under its own domain, API and account. You do not need separate accounts or keys for the KVK, BAG or VIES registers: one GetAPI key covers everything in this node.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Credits](#credits)
- [Example workflow](#example-workflow)
- [Compatibility](#compatibility)
- [Resources](#resources)

## Installation

Follow the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) and install the package `n8n-nodes-getapi`.

## Operations

### Company (KVK)

- **Search**: find Dutch companies by name or KVK number, with paging.
- **Get**: get the details of a company by KVK number.
- **Validate**: check whether a KVK number exists and is active.

### Address (BAG)

- **Lookup**: look up an address by postcode and house number.
- **Autocomplete**: get address suggestions while typing.
- **Get by BAG ID**: look up an address by its BAG nummeraanduiding ID.
- **Postcode Lookup**: get street, city, municipality and coordinates for a postcode.

### Property

- **Get WOZ Value**: the WOZ value of a property, including the last three years.
- **Get Energy Label**: the registered energy label (EP-Online) for an address.
- **Get Property Data**: combined property data (BAG, energy label, WOZ value and more).

### Validation

- **Validate VAT Number**: validate an EU VAT number through VIES.
- **Validate IBAN**: validate an IBAN and look up the bank and BIC.
- **Validate Email**: check format, domain and mail server of an email address.

A search that finds nothing returns no items. A lookup that finds nothing returns an item with `found: false`. An invalid input to a validation operation (for example an invalid VAT number) returns `valid: false` instead of failing the workflow. Problems with your account (invalid key, no credits left, rate limit) stop the node with a clear error message.

## Credentials

1. [Create a free GetAPI account](https://getapi.nl/register?utm_source=n8n&utm_medium=integration&utm_campaign=n8n-node&utm_content=readme) (250 free credits once, no credit card needed).
2. Copy your API key (it starts with `ga_live_`).
3. In n8n, create a **GetAPI API** credential and paste the key.

The credential test uses a free endpoint, so testing your key never costs a credit.

## Credits

Every successful call that returns data costs credits. Empty results and errors are free. Examples: KVK search, EU VAT validation and energy label cost 1 credit, a WOZ value costs 10 credits. See the [GetAPI documentation](https://getapi.nl/tarieven) for the current price of each endpoint.

## Example workflow

Validate a new customer in your CRM:

1. **Trigger**: a new company is added to your CRM.
2. **GetAPI** → Company → Search, with the company name.
3. **GetAPI** → Company → Get, with the KVK number from the first result.
4. **GetAPI** → Validation → Validate VAT Number, with the VAT number from the form.
5. Update the CRM record with the official name, address and validation status.

## Compatibility

Tested with n8n 2.x. The node uses `toPathSegment`, which needs n8n 2.46.1 or later.

## Resources

- [GetAPI documentation](http://getapi.nl/docs/api)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## Version history

See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE)
