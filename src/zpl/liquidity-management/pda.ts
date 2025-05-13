import { PublicKey } from "@solana/web3.js";

class LiquidityManagementPdas {
  constructor(private programId: PublicKey) {}

  deriveConfigurationAddress(): PublicKey {
    const [configurationAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("configuration")],
      this.programId
    );

    return configurationAddress;
  }

  deriveVaultSettingAddress(twoWayPegReserveSetting: PublicKey): PublicKey {
    // NOTE: the name of the account is changed to "vault-setting" in ZPL, but the seed is still "guardian-setting"
    const [vaultSettingAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("guardian-setting"), twoWayPegReserveSetting.toBuffer()],
      this.programId
    );

    return vaultSettingAddress;
  }

  deriveSplTokenVaultAuthorityAddress(
    twoWayPegReserveSetting: PublicKey
  ): PublicKey {
    const [splTokenVaultAuthorityAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("spl-token-vault-authority"),
        twoWayPegReserveSetting.toBuffer(),
      ],
      this.programId
    );

    return splTokenVaultAuthorityAddress;
  }

  derivePositionAddress(
    vaultSetting: PublicKey,
    userAddress: PublicKey | null
  ): PublicKey {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("position"),
        vaultSetting.toBuffer(),
        userAddress?.toBuffer() ?? Buffer.from([]),
      ],
      this.programId
    )[0];
  }
}

export default LiquidityManagementPdas;
