# zpl-sdk-js

A ZPL (zeus-program-library) SDK for Node.js and browser environments, built with rolldown.

## Features

- ESM/CJS dual output
- Full TypeScript support

## Usage

```sh
pnpm add zpl-sdk-js
```

### Client Example

```ts
import { TwoWayPegClient } from "zpl-sdk-js";

// Initialize client
const client = new TwoWayPegClient(connection, programId);
```

#### Account

```ts
// Fetch the two-way-peg configuration account
const twoWayPegConfig = await client.accounts.getConfiguration();
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

### Flow Example

#### Create Hot Reserve Bucket

```ts
import { TwoWayPegClient } from "zpl-sdk-js";
import { deriveHotReserveAddress } from "zpl-sdk-js/bitcoin";

const client = new TwoWayPegClient(connection, programId);

const { pubkey: hotReserveBitcoinXOnlyPublicKey } = deriveHotReserveAddress(
  guardianXOnlyPublicKey,
  userBitcoinXOnlyPublicKey,
  UNLOCK_BLOCK_HEIGHT,
  bitcoinNetwork
);

const twoWayPegConfiguration = await client.accounts.getConfiguration();

const ix = client.instructions.buildCreateHotReserveBucketIx(
  UNLOCK_BLOCK_HEIGHT,
  HOT_RESERVE_BUCKET_VALIDITY_PERIOD,
  solanaPubkey,
  userBitcoinXOnlyPublicKey,
  hotReserveBitcoinXOnlyPublicKey,
  new PublicKey(selectedGuardian.address),
  new PublicKey(selectedGuardian.guardian_certificate),
  coldReserveBucket.publicKey,
  twoWayPegConfiguration.layerFeeCollector
);

const tx = new Transaction().add(ix);
```

#### Deposit

```ts
import { TwoWayPegClient } from "zpl-sdk-js";
import { buildDepositToHotReserveTx } from "zpl-sdk-js/bitcoin";

const client = new TwoWayPegClient(connection, programId);

const hotReserveBuckets =
  await client.getHotReserveBucketsByBitcoinXOnlyPubkey(userXOnlyPublicKey);

// NOTE: selection logic depends on your DApp logic
const targetHotReserveBucket = hotReserveBuckets[0];

const { address: targetHotReserveAddress } = bitcoin.payments.p2tr({
  pubkey: Buffer.from(targetHotReserveBucket.taprootXOnlyPublicKey),
  network: bitcoinNetwork,
});

const { psbt, usedUTXOs } = buildDepositToHotReserveTx(
  bitcoinUTXOs,
  targetHotReserveAddress,
  depositAmount,
  userXOnlyPublicKey,
  feeRate,
  bitcoinNetwork
);
```

##### Signing and Broadcasting

After constructing the deposit PSBT as shown above, complete the deposit flow with the following steps:

1. **Sign the PSBT:**
   Use your Bitcoin wallet (such as Ledger, Sparrow, or any compatible wallet software) to sign the generated PSBT. The signing process proves ownership of the inputs and authorizes the spend.

2. **Broadcast the Transaction:**
   Once the PSBT is fully signed, broadcast the finalized transaction to the Bitcoin network. You can use your wallet, a Bitcoin node, or a third-party API/service to submit the raw transaction hex.

> Note: The SDK does not handle signing or broadcasting. You must use your own wallet infrastructure or integrate with external services for these steps.
