import { Connection, PublicKey } from "@solana/web3.js";

import TwoWayPegAccounts from "./account";
import TwoWayPegInstructions from "./instruction";
import TwoWayPegPdas from "./pda";

class TwoWayPegClient {
  readonly accounts: TwoWayPegAccounts;
  readonly instructions: TwoWayPegInstructions;
  readonly pdas: TwoWayPegPdas;

  constructor(connection: Connection, programId: PublicKey) {
    this.accounts = new TwoWayPegAccounts(connection, programId);
    this.pdas = new TwoWayPegPdas(programId);
    this.instructions = new TwoWayPegInstructions(programId, this.pdas);
  }
}

export default TwoWayPegClient;
