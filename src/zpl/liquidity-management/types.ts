import * as borsh from "@coral-xyz/borsh";
import { Structure } from "@solana/buffer-layout";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

/* ==========================================
 * Accounts Schema for Deserialization
 * ========================================== */
export interface Position {
  publicKey: PublicKey;
  owner: PublicKey;
  vaultSetting: PublicKey;
  storedAmount: BN;
  frozenAmount: BN;
  createdAt: BN;
  updatedAt: BN;
}

export const PositionSchema: Structure<Position> = borsh.struct([
  borsh.publicKey("owner"),
  borsh.publicKey("vaultSetting"),
  borsh.u64("storedAmount"),
  borsh.u64("frozenAmount"),
  borsh.i64("createdAt"),
  borsh.i64("updatedAt"),
]);
/* ========================================== */

/* ==========================================
 * Instruction Schema for Serialization
 * ========================================== */
export interface Retrieve {
  discriminator: number;
  amount: BN;
}

export const RetrieveSchema: Structure<Retrieve> = borsh.struct([
  borsh.u8("discriminator"),
  borsh.u64("amount"),
]);

export interface Store {
  discriminator: number;
  amount: BN;
}

export const StoreSchema: Structure<Store> = borsh.struct([
  borsh.u8("discriminator"),
  borsh.u64("amount"),
]);

/* ========================================== */
