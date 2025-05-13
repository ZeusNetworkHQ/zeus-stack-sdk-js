import { Structure } from "@solana/buffer-layout";
import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from "@solana/web3.js";
import bs58 from "bs58";
import { sha256 } from "js-sha256";

const DISCRIMINATOR_SIZE = 8;

type Deserializer<T> = (pubkey: PublicKey, data: Buffer) => T;

export const createDeserializer = <T>(
  schema: Structure<T>
): Deserializer<T> => {
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
  deserializer: Deserializer<T>
): Promise<T[]> => {
  const accounts = await connection.getProgramAccounts(programId, { filters });

  return accounts.map((account) => {
    const { data } = account.account;
    return deserializer(account.pubkey, data.subarray(DISCRIMINATOR_SIZE));
  });
};
