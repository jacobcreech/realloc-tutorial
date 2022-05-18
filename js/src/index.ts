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

(async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  const programId = new PublicKey(
    '8oWgidXhTxwt5Y5e867cj5L1ogfbx2vFpXYtpJd2naGs'
  );

  // Airdop to Payer
  await connection.confirmTransaction(
    await connection.requestAirdrop(PAYER_KEYPAIR.publicKey, LAMPORTS_PER_SOL)
  );

  const [pda, bump] = await PublicKey.findProgramAddress(
    [Buffer.from('customaddress'), PAYER_KEYPAIR.publicKey.toBuffer()],
    programId
  );
  
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

  const txHash = await sendAndConfirmTransaction(connection, transaction, [PAYER_KEYPAIR]);
  console.log(`Created PDA successfully. Tx Hash: ${txHash}`);

  const publicKey = (property: string = 'publicKey'): Object => {
    return BufferLayout.blob(32, property);
  };

  let addPubkeyStruct = BufferLayout.struct([BufferLayout.u8('instruction')], publicKey('key'));
  const pubkeyData = Buffer.alloc(addPubkeyStruct.span);

  addPubkeyStruct.encode(
    {
      instruction: 1,
      key: publicKey(PAYER_KEYPAIR.publicKey.toBase58()),
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

  const addPubkeyTxHash = await sendAndConfirmTransaction(connection, addPubkeyTx, [PAYER_KEYPAIR]);
  console.log(`Added Payer to PDA successfully. Tx Hash: ${addPubkeyTxHash}`);
})();
