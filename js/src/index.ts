import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

const BufferLayout = require("@solana/buffer-layout");

const PAYER_KEYPAIR = Keypair.generate();

const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
const programId = new PublicKey(
  '8oWgidXhTxwt5Y5e867cj5L1ogfbx2vFpXYtpJd2naGs'
);

const createList = async (pda: PublicKey) => {

  let initializeStruct = BufferLayout.struct([BufferLayout.u8('instruction')]);
  const data = Buffer.alloc(initializeStruct.span);

  initializeStruct.encode(
    {
      instruction: 0,
    },
    data,
  );

  const createPDAIx = new TransactionInstruction({
    programId: programId,
    data: data,
    keys: [
      {
        isSigner: true,
        isWritable: true,
        pubkey: PAYER_KEYPAIR.publicKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: pda,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: SystemProgram.programId,
      },
    ],
  });

  const transaction = new Transaction();
  transaction.add(createPDAIx);

  return sendAndConfirmTransaction(connection, transaction, [PAYER_KEYPAIR]);
}

const addPubkey = async (pda: PublicKey, key: PublicKey) => {
  const publicKey = (property: string = 'publicKey'): Object => {
    return BufferLayout.blob(32, property);
  };

  let addPubkeyStruct = BufferLayout.struct([BufferLayout.u8('instruction'), publicKey('key')]);
  const pubkeyData = Buffer.alloc(addPubkeyStruct.span);

  addPubkeyStruct.encode(
    {
      instruction: 1,
      key: key.toBuffer(),
    },
    pubkeyData,
  );

  const addPubkeyIx = new TransactionInstruction({
    programId: programId,
    data: pubkeyData,
    keys: [
      {
        isSigner: true,
        isWritable: true,
        pubkey: PAYER_KEYPAIR.publicKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: pda,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: SystemProgram.programId,
      },
    ],
  });

  const addPubkeyTx = new Transaction();
  addPubkeyTx.add(addPubkeyIx);

  return sendAndConfirmTransaction(connection, addPubkeyTx, [PAYER_KEYPAIR]);
}

(async () => {
  // Airdop to Payer
  await connection.confirmTransaction(
    await connection.requestAirdrop(PAYER_KEYPAIR.publicKey, LAMPORTS_PER_SOL)
  );

  const [pda] = await PublicKey.findProgramAddress(
    [Buffer.from('customaddress'), PAYER_KEYPAIR.publicKey.toBuffer()],
    programId
  );

  console.log(`PDA: ${pda.toBase58()}`);

  const pdaTxHash = await createList(pda);
  console.log(`Created PDA successfully. Tx Hash: ${pdaTxHash}`);

  const initialAccountInfo = await connection.getAccountInfo(pda);
  console.log(`Initial Account length: ${initialAccountInfo?.data.length}`);

  const addKeyTxHash = await addPubkey(pda, Keypair.generate().publicKey);
  console.log(`Added key successfully. Tx Hash: ${addKeyTxHash}`);

  const finalAccountInfo = await connection.getAccountInfo(pda);
  console.log(`Final Account length: ${finalAccountInfo?.data.length}`);
})();


