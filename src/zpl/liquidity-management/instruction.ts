import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";

import LiquidityManagementPdas from "./pda";
import { RetrieveSchema, StoreSchema } from "./types";

class LiquidityManagementInstructions {
  constructor(
    private programId: PublicKey,
    private pdas: LiquidityManagementPdas
  ) {}

  buildRetrieveIx(
    amount: BN,
    solanaPubkey: PublicKey,
    assetMint: PublicKey,
    reserveSettingPda: PublicKey,
    receiverAta: PublicKey
  ) {
    const vaultSettingPda =
      this.pdas.deriveVaultSettingAddress(reserveSettingPda);

    const splTokenVaultAuthorityPda =
      this.pdas.deriveSplTokenVaultAuthorityAddress(reserveSettingPda);

    const vaultAta = getAssociatedTokenAddressSync(
      assetMint,
      splTokenVaultAuthorityPda,
      true
    );

    const positionPda = this.pdas.derivePositionAddress(
      vaultSettingPda,
      solanaPubkey
    );

    const instructionData = Buffer.alloc(RetrieveSchema.span);
    RetrieveSchema.encode(
      {
        discriminator: 21,
        amount,
      },
      instructionData
    );

    const ix = new TransactionInstruction({
      keys: [
        {
          pubkey: solanaPubkey,
          isSigner: true,
          isWritable: true,
        },
        { pubkey: receiverAta, isSigner: false, isWritable: true },
        { pubkey: positionPda, isSigner: false, isWritable: true },
        { pubkey: vaultSettingPda, isSigner: false, isWritable: false },
        {
          pubkey: splTokenVaultAuthorityPda,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: vaultAta, isSigner: false, isWritable: true },
        { pubkey: assetMint, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
          pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: this.programId,
      data: instructionData,
    });

    return ix;
  }

  buildStoreIx(
    amount: BN,
    solanaPubkey: PublicKey,
    assetMint: PublicKey,
    reserveSettingPda: PublicKey
  ) {
    const userAta = getAssociatedTokenAddressSync(
      assetMint,
      solanaPubkey,
      true
    );

    const vaultSettingPda =
      this.pdas.deriveVaultSettingAddress(reserveSettingPda);

    const splTokenVaultAuthorityPda =
      this.pdas.deriveSplTokenVaultAuthorityAddress(reserveSettingPda);

    const vaultAta = getAssociatedTokenAddressSync(
      assetMint,
      splTokenVaultAuthorityPda,
      true
    );

    const positionPda = this.pdas.derivePositionAddress(
      vaultSettingPda,
      solanaPubkey
    );

    const configurationPda = this.pdas.deriveConfigurationAddress();

    const instructionData = Buffer.alloc(StoreSchema.span);
    StoreSchema.encode(
      {
        discriminator: 22,
        amount,
      },
      instructionData
    );

    const ix = new TransactionInstruction({
      keys: [
        {
          pubkey: solanaPubkey,
          isSigner: true,
          isWritable: true,
        },
        { pubkey: userAta, isSigner: false, isWritable: true },
        { pubkey: positionPda, isSigner: false, isWritable: true },
        {
          pubkey: configurationPda,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: vaultSettingPda, isSigner: false, isWritable: false },
        { pubkey: reserveSettingPda, isSigner: false, isWritable: false },
        {
          pubkey: splTokenVaultAuthorityPda,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: vaultAta, isSigner: false, isWritable: true },
        { pubkey: assetMint, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: instructionData,
    });

    return ix;
  }
}

export default LiquidityManagementInstructions;
