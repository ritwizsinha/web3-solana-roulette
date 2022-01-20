const web3 = require('@solana/web3.js');
const { PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');

const transferSOL=async (from,to,transferAmt)=>{
    try{
        const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
        const transaction=new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey:new web3.PublicKey(from.publicKey.toString()),
                toPubkey:new web3.PublicKey(to.publicKey.toString()),
                lamports:transferAmt*web3.LAMPORTS_PER_SOL
            })
        )
        const signature=await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        )
        return signature;
    }catch(err){
        console.log(err);
    }
}

const getWalletBalance= async (pubKey) =>{
    try{
        const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
        const balance=await connection.getBalance(pubKey);
        return balance/web3.LAMPORTS_PER_SOL;
    }catch(err){
        console.log(err);
    }
}

const airDropSol = async (wallet, amt) => {
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(wallet.publicKey),
            amt * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};


// const pair =web3.Keypair.generate();

// (async () => {
//     console.log(await getWalletBalance(pair.publicKey));
//     await airDropSol(pair)
//     console.log(await getWalletBalance(pair.publicKey));
// })()

module.exports = { transferSOL, getWalletBalance, airDropSol }