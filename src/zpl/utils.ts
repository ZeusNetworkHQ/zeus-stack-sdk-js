import { Structure } from "@solana/buffer-layout";
import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
  SendTransactionError,
} from "@solana/web3.js";
import bs58 from "bs58";
import { sha256 } from "js-sha256";

const DISCRIMINATOR_SIZE = 8;

type Deserializer<T> = (pubkey: PublicKey, data: Buffer) => T;

const createDeserializer = <T>(schema: Structure<T>): Deserializer<T> => {
  return (publicKey: PublicKey, data: Buffer): T => {
    const decoded = schema.decode(data);

    return {
      publicKey,
      ...decoded,
    };
  };
};

const generateAccountDiscriminator = (input: string): Buffer => {
  const preImage = Buffer.from(input);
  return Buffer.from(sha256(preImage), "hex").subarray(0, 8);
};

export const createDiscriminatorFilter = (
  discriminatorName: string
): GetProgramAccountsFilter => {
  return {
    memcmp: {
      offset: 0,
      bytes: bs58.encode(generateAccountDiscriminator(discriminatorName)),
    },
  };
};

export const getDeserializedAccounts = async <T>(
  connection: Connection,
  programId: PublicKey,
  filters: GetProgramAccountsFilter[],
  accountSchema: Structure<T>
): Promise<T[]> => {
  const accounts = await connection.getProgramAccounts(programId, { filters });
  const deserializer = createDeserializer(accountSchema);

  return accounts.map((account) => {
    const { data } = account.account;
    return deserializer(account.pubkey, data.subarray(DISCRIMINATOR_SIZE));
  });
};

export const extractErrorCodeFromSendTransactionError = (
  error: SendTransactionError
): number | null => {
  // Look for pattern like "custom program error: 0x14"
  const hexErrorMatch = error.message.match(
    /custom program error: (0x[0-9a-f]+)/i
  );

  if (hexErrorMatch && hexErrorMatch[1]) {
    // Convert hex error code to decimal
    return parseInt(hexErrorMatch[1], 16);
  }

  return null;
};

export const extractProgramIdFromSendTransactionError = (
  error: SendTransactionError
): string | null => {
  // Look for pattern like "Program {program_id} failed"
  const programIdMatch = error.message.match(
    /Program ([1-9A-HJ-NP-Za-km-z]{32,44}) (failed)/
  );

  if (programIdMatch && programIdMatch[1]) {
    return programIdMatch[1];
  }

  return null;
};
