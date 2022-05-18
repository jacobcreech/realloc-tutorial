"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var web3_js_1 = require("@solana/web3.js");
var BufferLayout = require("@solana/buffer-layout");
var PAYER_KEYPAIR = web3_js_1.Keypair.generate();
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var connection, programId, _a, _b, _c, pda, bump, initializeStruct, data, createPDAIx, transaction, txHash, publicKey, addPubkeyStruct, pubkeyData, addPubkeyIx, addPubkeyTx, addPubkeyTxHash;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                connection = new web3_js_1.Connection('http://127.0.0.1:8899', 'confirmed');
                programId = new web3_js_1.PublicKey('8oWgidXhTxwt5Y5e867cj5L1ogfbx2vFpXYtpJd2naGs');
                _b = (_a = connection).confirmTransaction;
                return [4 /*yield*/, connection.requestAirdrop(PAYER_KEYPAIR.publicKey, web3_js_1.LAMPORTS_PER_SOL)];
            case 1: 
            // Airdop to Payer
            return [4 /*yield*/, _b.apply(_a, [_d.sent()])];
            case 2:
                // Airdop to Payer
                _d.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from('customaddress'), PAYER_KEYPAIR.publicKey.toBuffer()], programId)];
            case 3:
                _c = _d.sent(), pda = _c[0], bump = _c[1];
                console.log("PDA Pubkey: ".concat(pda.toString()));
                console.log("Bump: ".concat(bump));
                initializeStruct = BufferLayout.struct([BufferLayout.u8('instruction')]);
                data = Buffer.alloc(initializeStruct.span);
                initializeStruct.encode({
                    instruction: 0,
                }, data);
                createPDAIx = new web3_js_1.TransactionInstruction({
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
                            pubkey: web3_js_1.SystemProgram.programId,
                        },
                    ],
                });
                transaction = new web3_js_1.Transaction();
                transaction.add(createPDAIx);
                return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [PAYER_KEYPAIR])];
            case 4:
                txHash = _d.sent();
                console.log("Created PDA successfully. Tx Hash: ".concat(txHash));
                publicKey = function (property) {
                    if (property === void 0) { property = 'publicKey'; }
                    return BufferLayout.blob(32, property);
                };
                addPubkeyStruct = BufferLayout.struct([BufferLayout.u8('instruction')], publicKey('key'));
                pubkeyData = Buffer.alloc(addPubkeyStruct.span);
                addPubkeyStruct.encode({
                    instruction: 1,
                    key: publicKey(PAYER_KEYPAIR.publicKey.toBase58()),
                }, pubkeyData);
                addPubkeyIx = new web3_js_1.TransactionInstruction({
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
                            pubkey: web3_js_1.SystemProgram.programId,
                        },
                    ],
                });
                addPubkeyTx = new web3_js_1.Transaction();
                addPubkeyTx.add(addPubkeyIx);
                return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, addPubkeyTx, [PAYER_KEYPAIR])];
            case 5:
                addPubkeyTxHash = _d.sent();
                console.log("Added Payer to PDA successfully. Tx Hash: ".concat(addPubkeyTxHash));
                return [2 /*return*/];
        }
    });
}); })();
