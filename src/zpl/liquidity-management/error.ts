import { SendTransactionError } from "@solana/web3.js";

import { extractErrorCodeFromSendTransactionError } from "../utils";

class LiquidityManagementError extends Error {
  readonly code: LiquidityManagementErrorCode;
  readonly originalError: SendTransactionError;

  constructor(originalError: SendTransactionError) {
    const errorCode = extractErrorCodeFromSendTransactionError(originalError);

    if (errorCode !== null) {
      super(
        ERROR_MESSAGES[errorCode as LiquidityManagementErrorCode] ||
          `Program error: ${errorCode}`
      );
      this.code = errorCode as LiquidityManagementErrorCode;
    } else {
      super(originalError.message || "Unknown error");
      this.code = LiquidityManagementErrorCode.InvalidInstruction;
    }

    this.originalError = originalError;

    this.name = "LiquidityManagementError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LiquidityManagementError);
    }
  }

  get errorName(): string {
    return LiquidityManagementErrorCode[this.code] || "UnknownError";
  }

  toString(): string {
    return `LiquidityManagementError: ${this.errorName} (${this.code}) - ${this.message}`;
  }
}

export enum LiquidityManagementErrorCode {
  InvalidInstruction = 0,
  Initialized = 1,
  UnexpectedProgramDerivedAddress = 2,
  InvalidLayerOperatorCertificate = 3,
  PermissionDenied = 4,
  InvalidSigner = 5,
  InvalidOwner = 6,
  InvalidGuardianCertificate = 7,
  InvalidCertificateStatus = 8,
  InvalidInteractionType = 9,
  InvalidInteractionStatus = 10,
  InvalidWithdrawalRequestStatus = 11,
  InsufficientStoredAmount = 12,
  InsufficientFrozenAmount = 13,
  InvalidAdditionalAccountSize = 14,
  InvalidVaultSetting = 15,
  InvalidVault = 16,
  InvalidTokenMint = 17,
  ReleaseUnreleasableAccount = 18,
  InsufficientVaultCapacity = 19,
  InvalidRetrieveAmount = 20,
  InvalidStoreAmount = 21,
  InvalidAssociatedTokenAccount = 22,
  InvalidReserveSetting = 23,
}

export const ERROR_MESSAGES: Record<LiquidityManagementErrorCode, string> = {
  [LiquidityManagementErrorCode.InvalidInstruction]: "Invalid instruction",
  [LiquidityManagementErrorCode.Initialized]: "Account already initialized",
  [LiquidityManagementErrorCode.UnexpectedProgramDerivedAddress]:
    "Unexpected program derived address",
  [LiquidityManagementErrorCode.InvalidLayerOperatorCertificate]:
    "Invalid layer operator certificate",
  [LiquidityManagementErrorCode.PermissionDenied]: "Permission denied",
  [LiquidityManagementErrorCode.InvalidSigner]: "Invalid signer",
  [LiquidityManagementErrorCode.InvalidOwner]: "Invalid owner",
  [LiquidityManagementErrorCode.InvalidGuardianCertificate]:
    "Invalid guardian certificate",
  [LiquidityManagementErrorCode.InvalidCertificateStatus]:
    "Invalid certificate status",
  [LiquidityManagementErrorCode.InvalidInteractionType]:
    "Invalid interaction type",
  [LiquidityManagementErrorCode.InvalidInteractionStatus]:
    "Invalid interaction status",
  [LiquidityManagementErrorCode.InvalidWithdrawalRequestStatus]:
    "Invalid withdrawal request status",
  [LiquidityManagementErrorCode.InsufficientStoredAmount]:
    "Insufficient stored amount",
  [LiquidityManagementErrorCode.InsufficientFrozenAmount]:
    "Insufficient frozen amount",
  [LiquidityManagementErrorCode.InvalidAdditionalAccountSize]:
    "Invalid additional account size",
  [LiquidityManagementErrorCode.InvalidVaultSetting]: "Invalid vault setting",
  [LiquidityManagementErrorCode.InvalidVault]: "Invalid vault",
  [LiquidityManagementErrorCode.InvalidTokenMint]: "Invalid token mint",
  [LiquidityManagementErrorCode.ReleaseUnreleasableAccount]:
    "Cannot release an account that is not releasable",
  [LiquidityManagementErrorCode.InsufficientVaultCapacity]:
    "Insufficient vault capacity",
  [LiquidityManagementErrorCode.InvalidRetrieveAmount]:
    "Invalid retrieve amount",
  [LiquidityManagementErrorCode.InvalidStoreAmount]: "Invalid store amount",
  [LiquidityManagementErrorCode.InvalidAssociatedTokenAccount]:
    "Invalid associated token account",
  [LiquidityManagementErrorCode.InvalidReserveSetting]:
    "Invalid reserve setting",
};

export default LiquidityManagementError;
