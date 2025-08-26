import { Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

import { createDiscriminatorFilter, getDeserializedAccounts } from "../utils";
import {
  ColdReserveBucket,
  ColdReserveBucketSchema,
  EntityDerivedReserve,
  EntityDerivedReserveAddress,
  EntityDerivedReserveAddressSchema,
  EntityDerivedReserveSchema,
  HotReserveBucket,
  HotReserveBucketSchema,
  TwoWayPegConfiguration,
  TwoWayPegConfigurationSchema,
  UserSetting,
  UserSettingSchema,
} from "./types";

class TwoWayPegAccounts {
  constructor(
    private connection: Connection,
    private programId: PublicKey
  ) {}

  async getConfiguration(): Promise<TwoWayPegConfiguration> {
    const filters = [createDiscriminatorFilter("two-way-peg:configuration")];

    const twoWayPegConfigurations = await getDeserializedAccounts(
      this.connection,
      this.programId,
      filters,
      TwoWayPegConfigurationSchema
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
      ColdReserveBucketSchema
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
      HotReserveBucketSchema
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
      HotReserveBucketSchema
    );

    return hotReserveBuckets;
  }

  async getEntityDerivedReserves(): Promise<EntityDerivedReserve[]> {
    const filters = [
      createDiscriminatorFilter("two-way-peg:entity-derived-reserve"),
    ];

    const entityDerivedReserves = await getDeserializedAccounts(
      this.connection,
      this.programId,
      filters,
      EntityDerivedReserveSchema
    );

    return entityDerivedReserves;
  }

  async getEntityDerivedReserveAddressesBySolanaPubkey(
    solanaPubkey: PublicKey
  ): Promise<EntityDerivedReserveAddress[]> {
    const filters = [
      createDiscriminatorFilter("zpl:entity-derived-reserve-address"),
      {
        memcmp: {
          offset: 8,
          bytes: solanaPubkey.toBase58(),
        },
      },
    ];

    const entityDerivedReserveAddresses = await getDeserializedAccounts(
      this.connection,
      this.programId,
      filters,
      EntityDerivedReserveAddressSchema
    );

    return entityDerivedReserveAddresses;
  }

  async getUserSetting(solanaPubkey: PublicKey): Promise<UserSetting[]> {
    const filters = [
      createDiscriminatorFilter("two-way-peg:user-setting"),
      {
        memcmp: {
          offset: 8,
          bytes: solanaPubkey.toBase58(),
        },
      },
    ];

    const UserSetting = await getDeserializedAccounts(
      this.connection,
      this.programId,
      filters,
      UserSettingSchema
    );

    return UserSetting;
  }
}

export default TwoWayPegAccounts;
