# zpl-sdk-js

A ZPL (zeus-program-library) SDK for Node.js and browser environments, built with rolldown.

## Features

- ESM/CJS dual output
- Full TypeScript support

## Usage

```sh
pnpm add zpl-sdk-js
```

```ts
import { TwoWayPegClient } from "zpl-sdk-js";

// Initialize client
const client = new TwoWayPegClient(connection, programId);
```

### Two-Way-Peg Examples

#### Account

```ts
// Fetch the two-way-peg configuration account
const twoWayPegConfig = await client.accounts.getTwoWayPegConfiguration();
console.log(twoWayPegConfig.layerFeeCollector.toString());
```

#### Instruction

```ts
// Build a withdrawal request instruction
const withdrawalIx = client.instructions.buildAddWithdrawalRequestIx(
  new BN(amountToWithdraw),
  new BN(currentSlot),
  receiverBitcoinAddress,
  wallet.publicKey,
  layerFeeCollectorPda,
  reserveSettingPda,
  liquidityManagementProgramId,
  liquidityManagementConfigurationPda,
  vaultSettingPda,
  positionPda
);

// Add to transaction
const tx = new Transaction().add(withdrawalIx);
```

#### Program Derived Address (PDA)

```ts
// Derive an interaction PDA address
// For deposits: seed1 = transaction_id, seed2 = v_out
// For withdrawals: seed1 = receiver_address, seed2 = slot
const interactionPda = client.pdas.deriveInteraction(
  receiverBitcoinAddress,
  new BN(currentSlot)
);
console.log(`Interaction PDA: ${interactionPda.toString()}`);
```

## Build

```sh
pnpm build
```

---

Built with [rolldown](https://github.com/rolldown/rolldown).
