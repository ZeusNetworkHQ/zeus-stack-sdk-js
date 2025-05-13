import { Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

import {
  createDeserializer,
  createDiscriminatorFilter,
  getDeserializedAccounts,
} from "../utils";
import {
  ColdReserveBucket,
  ColdReserveBucketSchema,
  HotReserveBucket,
  HotReserveBucketSchema,
  TwoWayPegConfiguration,
  TwoWayPegConfigurationSchema,
} from "./types";

class TwoWayPegAccounts {
  constructor(
    private connection: Connection,
    private programId: PublicKey
  ) {}

  async getTwoWayPegConfiguration(): Promise<TwoWayPegConfiguration> {
    const filters = [createDiscriminatorFilter("two-way-peg:configuration")];

    const twoWayPegConfigurations = await getDeserializedAccounts(
      this.connection,
      this.programId,
      filters,
      createDeserializer(TwoWayPegConfigurationSchema)
    );

    return twoWayPegConfigurations[0];
  }

  async getColdReserveBuckets(): Promise<ColdReserveBucket[]> {
    const filters = [
      createDiscriminatorFilter("two-way-peg:cold-reserve-bucket"),
    ];

    const coldReserveBuckets = await getDeserializedAccounts(
      this.connection,
      this.programId,
      filters,
      createDeserializer(ColdReserveBucketSchema)
    );

    return coldReserveBuckets;
  }

  async getHotReserveBucketsByBitcoinXOnlyPubkey(
    bitcoinXOnlyPubkey: Buffer
  ): Promise<HotReserveBucket[]> {
    const filters = [
      createDiscriminatorFilter("two-way-peg:hot-reserve-bucket"),
      {
        memcmp: {
          offset: 169,
          bytes: bs58.encode(bitcoinXOnlyPubkey),
        },
      },
    ];

    const hotReserveBuckets = await getDeserializedAccounts(
      this.connection,
      this.programId,
      filters,
      createDeserializer(HotReserveBucketSchema)
    );

    return hotReserveBuckets;
  }

  async getHotReserveBucketsBySolanaPubkey(
    solanaPubkey: PublicKey
  ): Promise<HotReserveBucket[]> {
    const filters = [
      createDiscriminatorFilter("two-way-peg:hot-reserve-bucket"),
      {
        memcmp: {
          offset: 8,
          bytes: solanaPubkey.toBase58(),
        },
      },
    ];

    const hotReserveBuckets = await getDeserializedAccounts(
      this.connection,
      this.programId,
      filters,
      createDeserializer(HotReserveBucketSchema)
    );

    return hotReserveBuckets;
  }
}

export default TwoWayPegAccounts;
