import { PublicKey } from "@solana/web3.js";

class LayerCaPdas {
  constructor(private programId: PublicKey) {}

  deriveVaultUserCertificateAddress(vaultUserEntity: PublicKey): PublicKey {
    const [vaultUserCertificateAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault-user-certificate"), vaultUserEntity.toBuffer()],
      this.programId
    );

    return vaultUserCertificateAddress;
  }
}

export default LayerCaPdas;
