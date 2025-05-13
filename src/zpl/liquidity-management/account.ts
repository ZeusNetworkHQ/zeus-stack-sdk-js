import { Connection, PublicKey } from "@solana/web3.js";

import {
  createDeserializer,
  createDiscriminatorFilter,
  getDeserializedAccounts,
} from "../utils";
import { Position, PositionSchema } from "./types";

class LiquidityManagementAccounts {
  constructor(
    private connection: Connection,
    private programId: PublicKey
  ) {}

  async getPositionsByWallet(solanaPubkey: PublicKey): Promise<Position[]> {
    const filters = [
      createDiscriminatorFilter("liquidity-management:position"),
      {
        memcmp: {
          offset: 8,
          bytes: solanaPubkey.toBase58(),
        },
      },
    ];

    const positions = await getDeserializedAccounts(
      this.connection,
      this.programId,
      filters,
      createDeserializer(PositionSchema)
    );

    return positions;
  }
}

export default LiquidityManagementAccounts;
