import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

import { BitcoinAddressType } from "./types";

class TwoWayPegPdas {
  constructor(private programId: PublicKey) {}

  deriveConfigurationAddress(): PublicKey {
    const configurationAddress = PublicKey.findProgramAddressSync(
      [Buffer.from("configuration")],
      this.programId
    )[0];
    return configurationAddress;
  }

  deriveCpiIdentityAddress(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("cpi-identity")],
      this.programId
    )[0];
  }

  deriveHotReserveBucketAddress(
    hotReserveBitcoinXOnlyPublicKey: Buffer
  ): PublicKey {
    const bucketPda = PublicKey.findProgramAddressSync(
      [Buffer.from("hot-reserve-bucket"), hotReserveBitcoinXOnlyPublicKey],
      this.programId
    )[0];
    return bucketPda;
  }

  deriveEntityDerivedReserveAddress(
    assetOwner: PublicKey,
    entityDerivedReserve: PublicKey,
    addressType: BitcoinAddressType
  ): PublicKey {
    const pda = PublicKey.findProgramAddressSync(
      [
        Buffer.from("entity-derived-reserve-address"),
        assetOwner.toBuffer(),
        entityDerivedReserve.toBuffer(),
        Buffer.from(Uint8Array.of(addressType)),
      ],
      this.programId
    )[0];
    return pda;
  }

  deriveWithdrawalRequestAddress(
    receiverBitcoinAddress: Buffer,
    currentSlot: BN
  ): PublicKey {
    const withdrawalRequestPda = PublicKey.findProgramAddressSync(
      [
        Buffer.from("withdrawal-request"),
        receiverBitcoinAddress,
        currentSlot.toArrayLike(Buffer, "le", 4),
      ],
      this.programId
    )[0];
    return withdrawalRequestPda;
  }

  /**
   * Derives an interaction PDA address
   * @param seed1 For deposits, this is the transaction_id. For withdrawals, this is the receiver_address
   * @param seed2 For deposits, this is the v_out. For withdrawals, this is the slot (u64 trimmed to u32)
   * @returns The derived interaction PDA
   */
  deriveInteraction(seed1: Buffer, seed2: BN): PublicKey {
    const interactionPda = PublicKey.findProgramAddressSync(
      [Buffer.from("interaction"), seed1, seed2.toArrayLike(Buffer, "le", 4)],
      this.programId
    )[0];
    return interactionPda;
  }

  deriveUserSetting(owner: PublicKey): PublicKey {
    const userSettingPda = PublicKey.findProgramAddressSync(
      [Buffer.from("user-setting"), owner.toBuffer()],
      this.programId
    )[0];
    return userSettingPda;
  }
}

export default TwoWayPegPdas;
