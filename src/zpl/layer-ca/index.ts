import { PublicKey } from "@solana/web3.js";

import LayerCaPdas from "./pda";

class LayerCaClient {
  readonly pdas: LayerCaPdas;

  constructor(programId: PublicKey) {
    this.pdas = new LayerCaPdas(programId);
  }
}

export default LayerCaClient;
