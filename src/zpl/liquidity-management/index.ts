import { Connection, PublicKey } from "@solana/web3.js";

import LiquidityManagementAccounts from "./account";
import LiquidityManagementInstructions from "./instruction";
import LiquidityManagementPdas from "./pda";

class LiquidityManagementClient {
  readonly accounts: LiquidityManagementAccounts;
  readonly instructions: LiquidityManagementInstructions;
  readonly pdas: LiquidityManagementPdas;

  constructor(connection: Connection, programId: PublicKey) {
    this.accounts = new LiquidityManagementAccounts(connection, programId);
    this.pdas = new LiquidityManagementPdas(programId);
    this.instructions = new LiquidityManagementInstructions(
      programId,
      this.pdas
    );
  }
}

export default LiquidityManagementClient;
