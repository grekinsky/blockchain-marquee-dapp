import Web3 from 'web3';

export default async function() {
    let provider, account;

    // Modern dapp browsers...
    if (window.ethereum) {
        // instance web3
        window.web3 = new Web3(window.ethereum);
        // Request account access if needed
        const accounts = await window.ethereum.enable();
        provider = window.web3.currentProvider;
        // Acccounts now exposed
        account = accounts && accounts.length && accounts[0];
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        // instance web3
        window.web3 = new Web3(window.web3.currentProvider);
        provider = window.web3.currentProvider;
        // Acccounts always exposed
        account =
            (await window.web3.eth.defaultAccount) ||
            (await window.web3.eth.getCoinbase()) ||
            (await window.web3.eth.getAccounts())[0];
    }
    // Non-dapp browsers...
    else {
        console.error(
            'Non-Ethereum browser detected. You should consider trying MetaMask!',
        );
        // instance local provider
        provider = new Web3.providers.HttpProvider('http://localhost:7545');
        // instance web3
        window.web3 = new Web3(provider);
        // Acccounts always exposed
        account =
            (await window.web3.eth.defaultAccount) ||
            (await window.web3.eth.getCoinbase()) ||
            (await window.web3.eth.getAccounts())[0];
    }

    console.log('Account address: ', account);
    return { provider, account };
}
