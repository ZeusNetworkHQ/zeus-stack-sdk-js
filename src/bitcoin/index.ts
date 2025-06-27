import ecc from "@bitcoinerlab/secp256k1";
import { PublicKey } from "@solana/web3.js";
import {
  initEccLib,
  Network,
  networks,
  payments,
  Psbt,
  script,
} from "bitcoinjs-lib";
import { toXOnly } from "bitcoinjs-lib/src/psbt/bip371";
import { toHex } from "uint8array-tools";

import { UTXO } from "./types";

export * from "./types";

initEccLib(ecc);

const TX_INPUT_VBYTE = 58;
const TX_BASIC_VBYTE = 10;
const TX_OUTPUT_VBYTE = 44;
const DUST_AMOUNT = 546;

/**
 * Calculate the hot reserve bucket address based on the cold reserve address's internal key and the user's unlocking script.
 * * the key_path_spend_public_key and script_path_spend_public_key must be tweaked public keys.
 * @param {Buffer} keyPathSpendPublic_key - cold reserve address's internal key (must be tweaked public key)
 * @param {Buffer} scriptPathSpendPublic_key - user's unlocking script (must be tweaked public key)
 * @param {number} lockTime - the lock time of the hot reserve address
 * @param {bitcoin.Network} network - the network to use
 * @return - the hot reserve address and the script
 */
export function deriveHotReserveAddress(
  // tweaked pubkey that could directly spend the UTXO, usually the address of zeus node operator
  keyPathSpendPublic_key: Buffer,
  // user's unlocking script
  scriptPathSpendPublic_key: Buffer,
  lockTime: number,
  network: Network
): {
  address: string;
  script: Buffer;
  hash: Buffer | undefined;
  output: Buffer | undefined;
  pubkey: Buffer | undefined;
} {
  // bitcoin csv encoding sample
  // * ref: https://github.com/bitcoinjs/bitcoinjs-lib/blob/151173f05e26a9af7c98d8d1e3f90e97185955f1/test/integration/csv.spec.ts#L61
  const targetScript = `${toHex(script.number.encode(lockTime))} OP_CHECKSEQUENCEVERIFY OP_DROP ${toXOnly(scriptPathSpendPublic_key).toString("hex")} OP_CHECKSIG`;

  const tap = script.fromASM(targetScript);

  const script_p2tr = payments.p2tr({
    internalPubkey: toXOnly(keyPathSpendPublic_key),
    scriptTree: {
      output: tap,
    },
    network,
  });

  if (!script_p2tr.address) {
    throw new Error("Failed to calculate the address");
  }

  return {
    address: script_p2tr.address,
    script: tap,
    hash: script_p2tr.hash,
    output: script_p2tr.output,
    pubkey: script_p2tr.pubkey,
  };
}

const isSpendable = (utxo: UTXO, satoshisPerVBytes: number): boolean => {
  return (
    BigInt(Math.round(utxo.satoshis)) >
    BigInt(Math.ceil(satoshisPerVBytes * TX_INPUT_VBYTE))
  );
};

export function deriveEntityDerivedReserveAddress(
  assetOwner: PublicKey,
  // tweaked pubkey that could directly spend the UTXO, usually the address of zeus node operator
  keyPathSpendPublicKey: Buffer,
  scriptPathSpendPublicKey: Buffer,
  lockTime: number,
  network: Network
): {
  address: string;
  hash: Buffer | undefined;
  output: Buffer | undefined;
  pubkey: Buffer | undefined;
} {
  const opRetAsm = `OP_RETURN ${assetOwner.toBuffer().toString("hex")}`;
  const opRetLeaf = script.fromASM(opRetAsm);

  // bitcoin csv encoding sample
  // * ref: https://github.com/bitcoinjs/bitcoinjs-lib/blob/151173f05e26a9af7c98d8d1e3f90e97185955f1/test/integration/csv.spec.ts#L61
  const csvAsm = `${toHex(script.number.encode(lockTime))} OP_CHECKSEQUENCEVERIFY OP_DROP ${toXOnly(scriptPathSpendPublicKey).toString("hex")} OP_CHECKSIG`;
  const csvLeaf = script.fromASM(csvAsm);

  const script_p2tr = payments.p2tr({
    internalPubkey: toXOnly(keyPathSpendPublicKey),
    scriptTree: [
      {
        output: opRetLeaf,
      },
      {
        output: csvLeaf,
      },
    ],
    network,
  });

  if (script_p2tr.address === undefined) {
    throw new Error("Failed to calculate the address");
  }

  return {
    address: script_p2tr.address,
    hash: script_p2tr.hash,
    output: script_p2tr.output,
    pubkey: script_p2tr.pubkey,
  };
}

/**
 *
 * @param utxos available utxos
 * @param reserveAddress reserve address in p2tr format
 * @param amount amount to deposit (satoshis)
 * @param userXOnlyPubKey userXOnlyPubKey
 * @param feeRate fee rate in satoshis per vbyte
 * @param network network
 * @returns
 */
export const buildDepositTransaction = (
  utxos: UTXO[],
  reserveAddress: string,
  amount: number,
  userXOnlyPubKey: Buffer,
  feeRate: number,
  network: networks.Network
): {
  psbt: Psbt;
  returnAmount: number;
  usedUTXOs: UTXO[];
} => {
  if (utxos.length === 0) {
    throw new Error("No UTXOs available");
  }

  if (feeRate < 1) {
    throw new Error("Invalid satoshisPerVBytes");
  }

  const sortedUTXOs = utxos.toSorted((a, b) => a.satoshis - b.satoshis);

  const spendableUTXOs = sortedUTXOs.filter((utxo) =>
    isSpendable(utxo, feeRate)
  );

  if (spendableUTXOs.length === 0) {
    throw new Error("No spendable UTXOs available");
  }

  const maxSpendableAmount = estimateMaxSpendableAmount(utxos, feeRate);

  if (maxSpendableAmount < amount) {
    throw new Error("Insufficient balance");
  }

  const isDepositAll = amount === maxSpendableAmount;

  const { output, address } = payments.p2tr({
    internalPubkey: userXOnlyPubKey,
    network: network,
  });

  if (!output) {
    throw new Error("Invalid output");
  }

  if (!address) {
    throw new Error("Invalid address");
  }

  const psbt = new Psbt({ network }).setVersion(2);

  // Spend all means only 1 output
  let totalVbyte = TX_BASIC_VBYTE + TX_OUTPUT_VBYTE * (isDepositAll ? 1 : 2);
  let preparedAmount = BigInt(0);

  const usedUTXOs: UTXO[] = [];
  for (const utxo of spendableUTXOs) {
    psbt.addInput({
      hash: utxo.transaction_id,
      index: utxo.transaction_index,
      witnessUtxo: {
        script: output,
        value: utxo.satoshis,
      },
      tapInternalKey: userXOnlyPubKey,
    });
    preparedAmount += BigInt(utxo.satoshis);
    totalVbyte += TX_INPUT_VBYTE;
    usedUTXOs.push(utxo);
    if (
      preparedAmount >=
      BigInt(amount) + BigInt(feeRate) * BigInt(Math.ceil(totalVbyte))
    ) {
      break;
    }
  }

  const returnAmount = Number(
    preparedAmount -
      BigInt(amount) -
      BigInt(feeRate) * BigInt(Math.ceil(totalVbyte))
  );

  if (returnAmount < 0) {
    throw new Error("Insufficient balance for fee");
  }

  psbt.addOutput({
    address: reserveAddress,
    value: amount,
  });

  if (returnAmount != 0 && returnAmount > DUST_AMOUNT) {
    psbt.addOutput({
      address: address,
      value: returnAmount,
    });
  }

  psbt.setMaximumFeeRate(feeRate + 1);

  return {
    psbt,
    returnAmount: Number(returnAmount),
    usedUTXOs,
  };
};

/**
 *
 * @param utxos available utxos
 * @param feeRate fee rate in satoshis per vbyte
 * @returns spendable amount in satoshis
 */
export const estimateMaxSpendableAmount = (
  utxos: UTXO[],
  feeRate: number
): number => {
  if (utxos.length === 0) {
    return 0;
  }

  const spendableUTXOs = utxos.filter((utxo) => isSpendable(utxo, feeRate));

  if (spendableUTXOs.length === 0) {
    return 0;
  }

  const { totalSpendableAmount, totalVbyte } = spendableUTXOs.reduce(
    (acc, utxo) => ({
      totalSpendableAmount: acc.totalSpendableAmount + BigInt(utxo.satoshis),
      totalVbyte: acc.totalVbyte + TX_INPUT_VBYTE,
    }),
    {
      totalSpendableAmount: BigInt(0),
      // Spend all means only 1 output
      totalVbyte: TX_BASIC_VBYTE + TX_OUTPUT_VBYTE,
    }
  );

  const maxSpendableAmount =
    totalSpendableAmount - BigInt(feeRate) * BigInt(Math.ceil(totalVbyte));

  return Number(maxSpendableAmount);
};
