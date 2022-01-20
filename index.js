const web3 = require('@solana/web3.js');

const userWallet=web3.Keypair.generate();
const treasuryWallet = web3.Keypair.generate();

const publicKey = userWallet.publicKey;
const privateKey = userWallet.secretKey;

const { airDropSol, getWalletBalance, transferSOL } = require('./solana');
const { getRandomBetween, getReturnAmount } = require('./helper');


async function runCMD() {
    const inq = require('inquirer');
    const numberValidation = (value) => {
        if (isNaN(value)) {
            return 'Please enter a number'
        }

        return true
    }
    const questions = [
        {
            type: 'input',
            name: 'amount',
            message: "Enter your amount",
            validate: numberValidation
        },
        {
            type: 'input',
            name: 'ratio',
            message: "Enter your ratio",
            validate: numberValidation
        },
        {
            type: 'input',
            name: 'guess_num',
            message: "Enter your guess (1-5)",
            validate(value) {
                if (isNaN(value)) {
                    return 'Please enter a number'
                }

                if (value < 1 || value > 5) return 'Please enter a number between 1 and 5'
                if (value - Math.floor(value) != 0) return 'Please enter an integer';

                return true
            }
        }
    ]
    try {
        const answers = await inq.prompt(questions);
        const guess_num = Number(answers['guess_num']);
        const amount = Number(answers['amount']);
        const ratio = Number(answers['ratio']);
        try {
            await airDropSol(userWallet, 2)
            console.log(`Account Balance : ${await getWalletBalance(userWallet.publicKey)}`);
            const signature = await transferSOL(userWallet, treasuryWallet, amount);
            console.log(`Fees debited successsfully with ${signature}`);
            console.log(`Account Balance : ${await getWalletBalance(userWallet.publicKey)}`);


            if (guess_num != getRandomBetween(1, 5)) {
                console.log("Better luck next time")
            } else {
                console.log(`Congratulations ${getReturnAmount(amount, ratio)} transferred`);
                await airDropSol(userWallet, getReturnAmount(amount, ratio));
                console.log(`Congratulations, prizes deposited, current balance: ${await getWalletBalance(userWallet.publicKey)}`)
            }
        } catch (err) {
            console.log("Error in debiting fees");
            console.log(err.message)
        }

    } catch(err) {
        console.log("Error in taking input")
    }
}

runCMD();