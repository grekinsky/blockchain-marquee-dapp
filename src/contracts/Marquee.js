import contract from '@truffle/contract';
import Marquee from '../build/contracts/Marquee.json';

export default async function(provider, address) {
    const marqueeContract = contract(Marquee);
    marqueeContract.setProvider(provider);
    let marqueeInstance;
    if (address) {
        marqueeInstance = await marqueeContract.at(address);
        console.log('Contract address: ', address);
    } else {
        marqueeInstance = await marqueeContract.deployed();
        console.log('Contract address: ', marqueeInstance.address);
    }
    return marqueeInstance;
}
