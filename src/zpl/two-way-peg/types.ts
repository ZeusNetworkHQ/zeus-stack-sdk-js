import * as borsh from "@coral-xyz/borsh";
import { Structure } from "@solana/buffer-layout";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

/* ==========================================
 * Accounts Schema for Deserialization
 * ========================================== */
export interface TwoWayPegConfiguration {
  publicKey: PublicKey;
  superOperatorCertificate: PublicKey;
  zeusColdReserveRecoveryPublicKey: Uint8Array;
  zeusColdReserveRecoveryLockTime: number;
  layerFeeCollector: PublicKey;
  chadbufferAuthority: PublicKey;
  cpiIdentity: PublicKey;
  layerCaProgramId: PublicKey;
  bitcoinSpvProgramId: PublicKey;
  liquidityManagementProgramId: PublicKey;
  bucketOpenFeeAmount: BN;
  bucketReactivationFeeAmount: BN;
  withdrawalFeeAmount: BN;
  minerFeeRate: number;
}

export const TwoWayPegConfigurationSchema: Structure<TwoWayPegConfiguration> =
  borsh.struct([
    borsh.publicKey("superOperatorCertificate"),
    borsh.array(borsh.u8(), 32, "zeusColdReserveRecoveryPublicKey"),
    borsh.u16("zeusColdReserveRecoveryLockTime"),
    borsh.publicKey("layerFeeCollector"),
    borsh.publicKey("chadbufferAuthority"),
    borsh.publicKey("cpiIdentity"),
    borsh.publicKey("layerCaProgramId"),
    borsh.publicKey("bitcoinSpvProgramId"),
    borsh.publicKey("liquidityManagementProgramId"),
    borsh.u64("bucketOpenFeeAmount"),
    borsh.u64("bucketReactivationFeeAmount"),
    borsh.u64("withdrawalFeeAmount"),
    borsh.u32("minerFeeRate"),
  ]);

export interface ColdReserveBucket {
  publicKey: PublicKey;
  reserveSetting: PublicKey;
  owner: PublicKey;
  // Bitcoin Cold Reserve X-Only Public Key
  taprootXOnlyPublicKey: Uint8Array;
  tapTweakHash: Uint8Array;
  createdAt: BN;
  // Guardian X-Only PublicKey
  keyPathSpendPublicKey: Uint8Array;
  recoveryParameters: ColdReserveRecoveryParameter[];
}

export interface ColdReserveRecoveryParameter {
  scriptPathSpendPublicKey: Uint8Array;
  lockTime: BN;
}

export const ColdReserveBucketSchema: Structure<ColdReserveBucket> =
  borsh.struct([
    borsh.publicKey("reserveSetting"),
    borsh.publicKey("owner"),
    borsh.array(borsh.u8(), 32, "taprootXOnlyPublicKey"),
    borsh.array(borsh.u8(), 32, "tapTweakHash"),
    borsh.i64("createdAt"),
    borsh.array(borsh.u8(), 32, "keyPathSpendPublicKey"),
    borsh.vec(
      borsh.struct([
        borsh.array(borsh.u8(), 32, "scriptPathSpendPublicKey"),
        borsh.i64("lockTime"),
      ]),
      "recoveryParameters"
    ),
  ]);

export interface HotReserveBucket {
  publicKey: PublicKey;
  owner: PublicKey;
  reserveSetting: PublicKey;
  status: number;
  // Hot Reserve Bucket X-Only Public Keys
  taprootXOnlyPublicKey: Uint8Array;
  tapTweakHash: Uint8Array;
  // Guardian X-Only PublicKey
  keyPathSpendPublicKey: Uint8Array;
  // User X-Only PublicKey
  scriptPathSpendPublicKey: Uint8Array;
  lockTime: BN;
  createdAt: BN;
  expiredAt: BN;
}

export enum HotReserveBucketStatus {
  Activated = 0,
  Deactivated = 1,
}

export const HotReserveBucketSchema: Structure<HotReserveBucket> = borsh.struct(
  [
    borsh.publicKey("owner"),
    borsh.publicKey("reserveSetting"),
    borsh.u8("status"),
    borsh.array(borsh.u8(), 32, "taprootXOnlyPublicKey"),
    borsh.array(borsh.u8(), 32, "tapTweakHash"),
    borsh.array(borsh.u8(), 32, "keyPathSpendPublicKey"),
    borsh.array(borsh.u8(), 32, "scriptPathSpendPublicKey"),
    borsh.u64("lockTime"),
    borsh.i64("createdAt"),
    borsh.i64("expiredAt"),
  ]
);
/* ========================================== */

/* ==========================================
 * Instruction Schema for Serialization
 * ========================================== */
export interface CreateHotReserveBucket {
  discriminator: number;
  scriptPathSpendPublicKey: Uint8Array;
  lockTime: BN;
  validityPeriod: number;
}

export const CreateHotReserveBucketSchema: Structure<CreateHotReserveBucket> =
  borsh.struct([
    borsh.u8("discriminator"),
    borsh.array(borsh.u8(), 32, "scriptPathSpendPublicKey"),
    borsh.u64("lockTime"),
    borsh.u32("validityPeriod"),
  ]);

export interface ReactivateHotReserveBucket {
  discriminator: number;
  validityPeriod: number;
}

export const ReactivateHotReserveBucketSchema: Structure<ReactivateHotReserveBucket> =
  borsh.struct([borsh.u8("discriminator"), borsh.u32("validityPeriod")]);

export interface AddWithdrawalRequest {
  discriminator: number;
  receiverAddress: Uint8Array;
  currentSlot: BN;
  withdrawalAmount: BN;
}

export const AddWithdrawalRequestSchema: Structure<AddWithdrawalRequest> =
  borsh.struct([
    borsh.u8("discriminator"),
    borsh.array(borsh.u8(), 32, "receiverAddress"),
    borsh.u64("currentSlot"),
    borsh.u64("withdrawalAmount"),
  ]);

/* ========================================== */
