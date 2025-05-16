import { SendTransactionError } from "@solana/web3.js";

import { extractErrorCodeFromSendTransactionError } from "../utils";

class TwoWayPegError extends Error {
  readonly code: TwoWayPegErrorCode;
  readonly originalError: SendTransactionError;

  constructor(originalError: SendTransactionError) {
    const errorCode = extractErrorCodeFromSendTransactionError(originalError);

    if (errorCode !== null) {
      super(
        ERROR_MESSAGES[errorCode as TwoWayPegErrorCode] ||
          `Program error: ${errorCode}`
      );
      this.code = errorCode as TwoWayPegErrorCode;
    } else {
      super(originalError.message || "Unknown error");
      this.code = TwoWayPegErrorCode.InvalidInstruction;
    }

    this.originalError = originalError;

    this.name = "TwoWayPegError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TwoWayPegError);
    }
  }

  get errorName(): string {
    return TwoWayPegErrorCode[this.code] || "UnknownError";
  }

  toString(): string {
    return `TwoWayPegError: ${this.errorName} (${this.code}) - ${this.message}`;
  }
}

export enum TwoWayPegErrorCode {
  InvalidInstruction = 0,
  Initialized = 1,
  ReserveSettingExists = 2,
  InvalidOwner = 3,
  InvalidConfiguration = 4,
  InvalidCertificateStatus = 5,
  PermissionDenied = 6,
  InvalidLockTime = 7,
  TweakXOnlyPublicKey = 8,
  UnexpectedProgramDerivedAddress = 9,
  ColdReserveBucketExists = 10,
  HotReserveBucketExists = 11,
  HotReserveBucketNotExisting = 12,
  UnexpiredHotReserveBucket = 13,
  TransactionNotExisting = 14,
  TransactionNotMatched = 15,
  InvalidChadBufferDataOwner = 16,
  InvalidChadBufferProgram = 17,
  InvalidBitcoinSpvProgram = 18,
  InvalidLiquidityManagementProgram = 19,
  InvalidTokenProgram = 20,
  InvalidLockingScript = 21,
  ParseTransaction = 22,
  UtxoCountNotMatched = 23,
  InvalidUtxoStatus = 24,
  InvalidTransactionInputCount = 25,
  InvalidTransactionOutputCount = 26,
  TooManyTransactionInputs = 27,
  TooManyTransactionOutputs = 28,
  InvalidTransactionProposalStatus = 29,
  InvalidTransactionProposalType = 30,
  TransactionProposerNotMatched = 31,
  InsufficientWithdrawalAmount = 32,
  InsufficientWithdrawalAmountToCoverFee = 33,
  InsufficientMinerFee = 34,
  InsufficientAmount = 35,
  InvalidWithdrawalRequestStatus = 36,
  InvalidReserveSetting = 37,
  InvalidGuardianCertificate = 38,
  InvalidOperatorCertificate = 39,
  InvalidUtxoReceiver = 40,
  InvalidInteractionStatus = 41,
  TooManyRecoveryKeys = 42,
  InvalidSplTokenMintAuthority = 43,
  InvalidChadBufferAuthority = 44,
  UtxoAlreadyInitialized = 45,
  InvalidTokenMint = 46,
  InvalidLayerFeeCollector = 47,
  InvalidColdReserveBucketAddress = 48,
  InvalidExternalReserveBucketAddress = 49,
  InvalidExternalReserveBucketAddressType = 50,
  TransactionProposalDataAccountMismatched = 51,
  TooManyReserveOutputCount = 52,
  InvalidAuthority = 53,
  WithdrawalRequestAndInteractionMismatched = 54,
  DepositInteractionAlreadyInitialized = 55,
  UnsupportedBitcoinAddressType = 56,
  ReleaseUnreleasableAccount = 57,
  MinerFeeRateTooLow = 58,
  TransactionProposalExists = 59,
  StxoExists = 60,
  InvalidUtxoType = 61,
  InvalidInteractionType = 62,
  InvalidRecoveryParameters = 63,
  MarkUtxoAsStale = 64,
  InvalidUtxoBucket = 65,
  ExternalReserveBucketExists = 66,
  ExternalReserveBucketNotExisting = 67,
  InvalidUtxoOutpoint = 68,
}

export const ERROR_MESSAGES: Record<TwoWayPegErrorCode, string> = {
  [TwoWayPegErrorCode.InvalidInstruction]: "Invalid instruction",
  [TwoWayPegErrorCode.Initialized]: "Account already initialized",
  [TwoWayPegErrorCode.ReserveSettingExists]: "Reserve setting already exists",
  [TwoWayPegErrorCode.InvalidOwner]: "Invalid owner",
  [TwoWayPegErrorCode.InvalidConfiguration]: "Invalid configuration",
  [TwoWayPegErrorCode.InvalidCertificateStatus]: "Invalid certificate status",
  [TwoWayPegErrorCode.PermissionDenied]: "Permission denied",
  [TwoWayPegErrorCode.InvalidLockTime]: "Invalid lock time",
  [TwoWayPegErrorCode.TweakXOnlyPublicKey]: "Failed to tweak X-only public key",
  [TwoWayPegErrorCode.UnexpectedProgramDerivedAddress]:
    "Unexpected program derived address",
  [TwoWayPegErrorCode.ColdReserveBucketExists]:
    "Cold reserve bucket already exists",
  [TwoWayPegErrorCode.HotReserveBucketExists]:
    "Hot reserve bucket already exists",
  [TwoWayPegErrorCode.HotReserveBucketNotExisting]:
    "Hot reserve bucket does not exist",
  [TwoWayPegErrorCode.UnexpiredHotReserveBucket]:
    "Hot reserve bucket has not expired",
  [TwoWayPegErrorCode.TransactionNotExisting]: "Transaction does not exist",
  [TwoWayPegErrorCode.TransactionNotMatched]: "Transaction does not match",
  [TwoWayPegErrorCode.InvalidChadBufferDataOwner]:
    "Invalid chad buffer data owner",
  [TwoWayPegErrorCode.InvalidChadBufferProgram]: "Invalid chad buffer program",
  [TwoWayPegErrorCode.InvalidBitcoinSpvProgram]: "Invalid Bitcoin SPV program",
  [TwoWayPegErrorCode.InvalidLiquidityManagementProgram]:
    "Invalid liquidity management program",
  [TwoWayPegErrorCode.InvalidTokenProgram]: "Invalid token program",
  [TwoWayPegErrorCode.InvalidLockingScript]: "Invalid locking script",
  [TwoWayPegErrorCode.ParseTransaction]: "Failed to parse transaction",
  [TwoWayPegErrorCode.UtxoCountNotMatched]: "UTXO count does not match",
  [TwoWayPegErrorCode.InvalidUtxoStatus]: "Invalid UTXO status",
  [TwoWayPegErrorCode.InvalidTransactionInputCount]:
    "Invalid transaction input count",
  [TwoWayPegErrorCode.InvalidTransactionOutputCount]:
    "Invalid transaction output count",
  [TwoWayPegErrorCode.TooManyTransactionInputs]: "Too many transaction inputs",
  [TwoWayPegErrorCode.TooManyTransactionOutputs]:
    "Too many transaction outputs",
  [TwoWayPegErrorCode.InvalidTransactionProposalStatus]:
    "Invalid transaction proposal status",
  [TwoWayPegErrorCode.InvalidTransactionProposalType]:
    "Invalid transaction proposal type",
  [TwoWayPegErrorCode.TransactionProposerNotMatched]:
    "Transaction proposer does not match",
  [TwoWayPegErrorCode.InsufficientWithdrawalAmount]:
    "Insufficient withdrawal amount",
  [TwoWayPegErrorCode.InsufficientWithdrawalAmountToCoverFee]:
    "Insufficient withdrawal amount to cover fee",
  [TwoWayPegErrorCode.InsufficientMinerFee]: "Insufficient miner fee",
  [TwoWayPegErrorCode.InsufficientAmount]: "Insufficient amount",
  [TwoWayPegErrorCode.InvalidWithdrawalRequestStatus]:
    "Invalid withdrawal request status",
  [TwoWayPegErrorCode.InvalidReserveSetting]: "Invalid reserve setting",
  [TwoWayPegErrorCode.InvalidGuardianCertificate]:
    "Invalid guardian certificate",
  [TwoWayPegErrorCode.InvalidOperatorCertificate]:
    "Invalid operator certificate",
  [TwoWayPegErrorCode.InvalidUtxoReceiver]: "Invalid UTXO receiver",
  [TwoWayPegErrorCode.InvalidInteractionStatus]: "Invalid interaction status",
  [TwoWayPegErrorCode.TooManyRecoveryKeys]: "Too many recovery keys",
  [TwoWayPegErrorCode.InvalidSplTokenMintAuthority]:
    "Invalid SPL token mint authority",
  [TwoWayPegErrorCode.InvalidChadBufferAuthority]:
    "Invalid chad buffer authority",
  [TwoWayPegErrorCode.UtxoAlreadyInitialized]: "UTXO already initialized",
  [TwoWayPegErrorCode.InvalidTokenMint]: "Invalid token mint",
  [TwoWayPegErrorCode.InvalidLayerFeeCollector]: "Invalid layer fee collector",
  [TwoWayPegErrorCode.InvalidColdReserveBucketAddress]:
    "Invalid cold reserve bucket address",
  [TwoWayPegErrorCode.InvalidExternalReserveBucketAddress]:
    "Invalid external reserve bucket address",
  [TwoWayPegErrorCode.InvalidExternalReserveBucketAddressType]:
    "Invalid external reserve bucket address type",
  [TwoWayPegErrorCode.TransactionProposalDataAccountMismatched]:
    "Transaction proposal data account mismatched",
  [TwoWayPegErrorCode.TooManyReserveOutputCount]:
    "Too many reserve output count",
  [TwoWayPegErrorCode.InvalidAuthority]: "Invalid authority",
  [TwoWayPegErrorCode.WithdrawalRequestAndInteractionMismatched]:
    "Withdrawal request and interaction mismatched",
  [TwoWayPegErrorCode.DepositInteractionAlreadyInitialized]:
    "Deposit interaction already initialized",
  [TwoWayPegErrorCode.UnsupportedBitcoinAddressType]:
    "Unsupported Bitcoin address type",
  [TwoWayPegErrorCode.ReleaseUnreleasableAccount]:
    "Cannot release an account that is not releasable",
  [TwoWayPegErrorCode.MinerFeeRateTooLow]: "Miner fee rate too low",
  [TwoWayPegErrorCode.TransactionProposalExists]:
    "Transaction proposal already exists",
  [TwoWayPegErrorCode.StxoExists]: "STXO already exists",
  [TwoWayPegErrorCode.InvalidUtxoType]: "Invalid UTXO type",
  [TwoWayPegErrorCode.InvalidInteractionType]: "Invalid interaction type",
  [TwoWayPegErrorCode.InvalidRecoveryParameters]: "Invalid recovery parameters",
  [TwoWayPegErrorCode.MarkUtxoAsStale]: "Failed to mark UTXO as stale",
  [TwoWayPegErrorCode.InvalidUtxoBucket]: "Invalid UTXO bucket",
  [TwoWayPegErrorCode.ExternalReserveBucketExists]:
    "External reserve bucket already exists",
  [TwoWayPegErrorCode.ExternalReserveBucketNotExisting]:
    "External reserve bucket does not exist",
  [TwoWayPegErrorCode.InvalidUtxoOutpoint]: "Invalid UTXO outpoint",
};

export default TwoWayPegError;
