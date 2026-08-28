# Security Policy

## Reporting

Report security or privacy concerns privately to RK Logistics through the contact information on https://rklogisticsgroup.com/contact/.

Do not open a public GitHub issue containing credentials, personal information, customer data, internal property documents or operational records.

## Supported version

The current `main` branch is supported.

## Repository boundaries

This repository must not contain:

- API keys or webhook secrets
- raw contracts or pricing
- customer, employee, inventory, order or claims data
- confidential Drive exports
- unapproved property documents

Runtime secrets belong in Vercel environment variables. See `.env.example` for allowed variable names.
