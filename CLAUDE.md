# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the ZPL (Zeus Program Library) SDK for Node.js and browser environments. The SDK provides TypeScript/JavaScript clients for interacting with Zeus Network's blockchain programs, specifically the Two-Way Peg and Liquidity Management systems on Solana, along with Bitcoin functionality.

## Common Development Commands

- `pnpm build` - Build the entire project (JavaScript + TypeScript declarations)
- `pnpm build:js` - Build JavaScript files only using rolldown
- `pnpm build:types` - Generate TypeScript declaration files only
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier
- `pnpm spell-check` - Check spelling in code and documentation files

## Project Architecture

### Core Client Structure

The SDK follows a modular client architecture with three main client classes:

1. **TwoWayPegClient** (`src/zpl/two-way-peg/`) - Handles Bitcoin↔Solana bridging operations
2. **LiquidityManagementClient** (`src/zpl/liquidity-management/`) - Manages liquidity pools and reserves
3. **Bitcoin utilities** (`src/bitcoin/`) - Bitcoin-specific operations and PSBT construction

Each client follows the same pattern:

- `account.ts` - Account fetching and deserialization
- `instruction.ts` - Instruction building methods
- `pda.ts` - Program Derived Address derivation
- `types.ts` - TypeScript type definitions
- `error.ts` - Error handling utilities

### Module Structure

```
src/
├── index.ts                    # Main exports
├── zpl/
│   ├── index.ts               # ZPL module exports
│   ├── utils.ts               # Shared utilities
│   ├── two-way-peg/           # Bitcoin-Solana bridge client
│   └── liquidity-management/  # Liquidity pool management client
└── bitcoin/
    ├── index.ts               # Bitcoin utilities
    └── types.ts               # Bitcoin-specific types
```

### Key Bitcoin Functionality

The Bitcoin module provides:

- `deriveHotReserveAddress()` - Derives hot reserve addresses using CSV timelock scripts
- `deriveEntityDerivedReserveAddress()` - Derives entity-derived reserve addresses with multiple recovery parameters
- `buildDepositTransaction()` - Constructs Bitcoin deposit PSBTs
- `estimateMaxSpendableAmount()` - Calculates maximum spendable amount accounting for fees

### Client Usage Pattern

All clients follow this initialization pattern:

```typescript
const client = new TwoWayPegClient(connection, programId);
// Access methods through:
// - client.accounts.*    (account fetching)
// - client.instructions.* (instruction building)
// - client.pdas.*        (PDA derivation)
```

## Build System

- Uses **rolldown** for JavaScript bundling (configured in `rolldown.config.ts`)
- Uses **TypeScript** for type declarations
- Outputs both ESM and CJS formats to `dist/`
- Supports multiple entry points via package.json exports

## Package Manager

Uses **pnpm** as the package manager (locked to version 10.8.1).

## Code Quality Tools

- **ESLint** with TypeScript support and Prettier integration
- **Prettier** for code formatting
- **Husky** for git hooks with lint-staged
- **CSpell** for spell checking
- **Commitlint** for conventional commit messages

## Dependencies

### Runtime Dependencies

- `@solana/web3.js` and `@solana/spl-token` (peer dependencies)
- `bitcoinjs-lib` and `@bitcoinerlab/secp256k1` for Bitcoin operations
- `@coral-xyz/borsh` for Solana program serialization
- Various Bitcoin and crypto utilities

### Development Dependencies

- TypeScript toolchain
- ESLint and Prettier configurations
- Rolldown for bundling
- Husky and lint-staged for git hooks

## CI/CD Pipeline

The project has automated workflows:

- **Style Check** (`style.yml`) - Runs on all pushes, checks linting, formatting, and spelling
- **Publish** (`publish.yml`) - Triggers on version tags (`v*`), automatically publishes to NPM
- **Release Webhook** (`release-webhook.yaml`) - Notifies Slack when releases are published

### Publishing Process

1. Create a version tag (e.g., `git tag v1.0.0`)
2. Push the tag (`git push origin v1.0.0`)
3. GitHub Actions will automatically build and publish to NPM

**Required Secrets:**

- `NPM_TOKEN` - NPM authentication token for publishing
- `SLACK_WEBHOOK_URL` - Slack webhook for release notifications

## Important Notes

- The project uses ES2023 target with ESNext modules
- All Bitcoin operations use the secp256k1 curve with proper ECC initialization
- The SDK supports both testnet and mainnet Bitcoin networks
- PDAs are derived deterministically using program-specific seeds
- All monetary amounts are handled as BN (BigNumber) instances for precision
