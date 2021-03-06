import React, { useState } from 'react';
import axios from 'axios';
import Card from './Card';
import { Button, Typography as Typo, Select } from '@supabase/ui';
import { Input } from '@supabase/ui';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import '../css/button.css';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

function AddressDetails() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [tokenItems, setTokenItems] = useState(null);
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

  const renderCard = () => {
    const { tokenName } = state;
    return !loading && !error && tokenName !== '';
  };

  const walletInput = (e) => {
    setWalletAddress(e.target.value);
  };

  const handleSelect = (e) => {
    getAddressDetails(walletAddress, e.target.value)
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(e.response?.data.error_message);
      });
  };

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

    // if no tokenAddress is specified, we grab the first one from the list
    const tokenBalance = !tokenAddress
      ? balanceResponse.data.data.items[0]
      : balanceResponse.data.data.items.find(
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

    setTokenItems(
      balanceResponse.data.data.items.map((t) => ({
        contractName: t.contract_name,
        contractAddress: t.contract_address,
      }))
    );

    return [balanceResponse, txResponse];
  };

  const yourAddress = walletAddress;
  const tokenAddress = '0x17d1285bc68d9085f8e4b86fc565e452b29dc48f';
  const classes = useStyles();

  console.log(tokenItems);

  return (
    <div className={classes.root}>
      <Grid container style={{ marginBottom: '1rem' }}>
        <Grid item xs={12} style={{ marginBottom: '0.5rem' }}>
          <Typo.Text>wallet address</Typo.Text>
        </Grid>
        <Grid item xs={12} style={{ marginBottom: '1rem' }}>
          <Input onChange={(e) => walletInput(e)} error={error} />
        </Grid>

        {tokenItems && (
          <Grid item xs={6}>
            <Select onChange={handleSelect}>
              {(tokenItems || []).map((t) => (
                <Select.Option
                  key={t.contractAddress}
                  value={t.contractAddress}
                >
                  {t.contractName}
                </Select.Option>
              ))}
            </Select>
          </Grid>
        )}
      </Grid>

      <Grid item xs={12}>
        <Button
          style={{
            borderRadius: '0.55rem',
            maxHeight: '2rem',
            width: '100%',
            justifyContent: 'center',
          }}
          onClick={() => {
            getAddressDetails(yourAddress, tokenAddress)
              .then(() => {
                setLoading(false);
              })
              .catch((e) => {
                setLoading(false);
                setError(e.response?.data.error_message);
              });
          }}
          loading={loading}
        >
          Show
        </Button>
      </Grid>

      {renderCard() && (
        <Grid container style={{ marginTop: '1rem' }}>
          <Grid item xs={12}>
            <Card {...state} />
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default AddressDetails;
