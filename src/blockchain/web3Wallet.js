import Web3 from "web3";
import  { useState } from 'react';
import { contractAddress, contractAbi } from "../constants/contract_data"; 

const web3 = new Web3(window.ethereum);
const votingContract = new web3.eth.Contract(contractAbi, contractAddress);

export const connectToMetamask = async() => {
    if (window.ethereum) { //checks if metamask installed in the browser 
      try {
        /*this line : Opens MetaMask
          Asks the user to connect
          Gives your app permission to access their wallet address */
        await window.ethereum.request({ method: "eth_requestAccounts" });
        //retrieves the list of Ethereum accounts (wallet addresses) that the user has made available through MetaMask.
        //The account variable will contain the Ethereum address of the user's wallet
        const accounts = await web3.eth.getAccounts();
        //This selects the first account in that list.
        let account = accounts[0];
        console.log("Connected account:", account);

      return { web3, account };
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser")
    }
}

export const listenToAccountChanges = (handleAccountsChanged) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
  }

  return () => {
    if (window.ethereum){
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  };

};


