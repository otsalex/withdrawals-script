const { ethers } = require('ethers');
const fs = require('fs');

const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/APIKEY");

const contractAddress = "0xb5b29320d2dde5ba5bafa1ebcd270052070483ec";

const withdrawEventABI = {
    anonymous: false,
    inputs: [
        { indexed: true, internalType: 'address', name: 'caller', type: 'address' },
        { indexed: true, internalType: 'address', name: 'receiver', type: 'address' },
        { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'assets', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' }
    ],
    name: 'Withdraw',
    type: 'event'
};

const contract = new ethers.Contract(contractAddress, [withdrawEventABI], provider);

async function getWithdrawEvents() {

    const startBlock = 0;
    const endBlock = 'latest';

    const logs = await contract.queryFilter(contract.filters.Withdraw(), startBlock, endBlock);

    const users = new Set();

    logs.forEach(log => {
        users.add(log.args.owner);
    });

    const userArray = Array.from(users);

    fs.writeFile('withdraw_addresses.txt', userArray.join('\n'), (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Addresses have been written to withdraw_addresses.txt');
        }
    });
}

getWithdrawEvents().catch(console.error);
