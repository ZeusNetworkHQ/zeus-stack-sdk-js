export interface UTXO {
  transaction_id: string;
  transaction_index: number;
  satoshis: number;
  block_height: number;
}
