import React, { useState } from 'react';
import axios from 'axios';

function AddressDetails() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [state, setState] = useState({
    tokenName: '',
    address: '',
    balance: '',
    tokensIn: '',
    firstTransaction: '',
    tokensOut: '',
    netDeposits: '',
    interestEarned: '',
    gainPercent: '',
  });

  const getAddressDetails = async (address, tokenAddress) => {
    setError(false);
    setLoading(true);

    const [balanceResponse, txResponse] = await axios.all([
      axios.get(
        `https://api.covalenthq.com/v1/56/address/${address}/balances_v2/?&key=${process.env.REACT_APP_COVALENT_APIKEY}`
      ),
      axios.get(
        `https://api.covalenthq.com/v1/56/address/${address}/transfers_v2/?contract-address=${tokenAddress}&page-number=0&page-size=1000&key=${process.env.REACT_APP_COVALENT_APIKEY}`
      ),
    ]);

    const tokenBalance = balanceResponse.data.data.items.find(
      (rm) => rm.contract_address === tokenAddress
    );

    const tokenName = tokenBalance.contract_name;
    const decimals = tokenBalance.contract_decimals;
    const balance =
      parseFloat(tokenBalance.balance) / parseFloat(Math.pow(10, decimals));

    const tokenTxItems = txResponse.data.data.items.flatMap((i) => i.transfers);

    const transfersIn = tokenTxItems.filter(
      (i) => i.from_address.toLowerCase() !== address.toLowerCase()
    );
    const transfersOut = tokenTxItems.filter(
      (i) => i.from_address.toLowerCase() === address.toLowerCase()
    );

    // sort from oldest to newest to grab the first transaction
    const sortedTransfersIn = transfersIn.sort((a, b) =>
      Date.parse(a.block_signed_at) > Date.parse(b.block_signed_at) ? 1 : -1
    );
    const firstTransaction = new Date(
      sortedTransfersIn[0].block_signed_at
    ).toDateString();

    // grab total amount of buying in and sell out
    const tokensIn =
      transfersIn.reduce((sum, tx) => sum + parseFloat(tx.delta), 0) /
      parseFloat(Math.pow(10, decimals));
    const tokensOut =
      transfersOut.reduce((sum, tx) => sum + parseFloat(tx.delta), 0) /
      parseFloat(Math.pow(10, decimals));

    const netDeposits = tokensIn - tokensOut;
    const interestEarned = balance - netDeposits;
    const gainPercent =
      netDeposits > 0 ? ((interestEarned / netDeposits) * 100).toFixed(2) : 0;

    setState({
      tokenName,
      address,
      balance,
      tokensIn,
      firstTransaction,
      tokensOut,
      netDeposits,
      interestEarned,
      gainPercent,
    });

    return [balanceResponse, txResponse];
  };

  const yourAddress = process.env.REACT_APP_TEST_WALLET_ADDRESS;
  const tokenAddress = process.env.REACT_APP_TEST_TOKEN_ADDRESS;
  const {
    tokenName,
    address,
    balance,
    tokensIn,
    firstTransaction,
    tokensOut,
    netDeposits,
    interestEarned,
    gainPercent,
  } = state;

  return (
    <div>
      <button
        onClick={() => {
          getAddressDetails(yourAddress, tokenAddress)
            .then(() => {
              setLoading(false);
            })
            .catch((e) => {
              setLoading(false);
              setError(e.response.data.error_message);
            });
        }}
      >
        On Click
      </button>
      <br />

      {error && !loading && <div>{error}</div>}

      {loading && !error && <div>loading...</div>}

      {!loading && !error && (
        <div>
          Token name: {tokenName}
          <br />
          Your wallet address: {address}
          <br />
          Balance: {balance}
          <br />
          Deposits: {tokensIn}
          <br />
          First transaction: {firstTransaction}
          <br />
          Withdrawals: {tokensOut}
          <br />
          Net deposits: {netDeposits}
          <br />
          Interest earned: {interestEarned}
          <br />
          Gain percent: {gainPercent}
          <br />
        </div>
      )}
    </div>
  );
}

export default AddressDetails;
