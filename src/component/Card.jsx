import React from 'react';
import { Card, Typography as Typo } from '@supabase/ui';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';

import { formatValue, renderNumberToReadable } from '../util/currency';

const useStyles = makeStyles({
  cardLayoutStyle: {
    minWidth: '25rem',
    borderRadius: '1.5rem',
    backgroundColor: '#FFE53B',
    backgroundImage: 'linear-gradient(190deg, #FFE53B 0%, #FF2525 74%)',
  },

  textTitle: {
    margin: 0,
    color: '#ffffff',
    fontWeight: 200,
  },

  textToken: {
    margin: 0,
    color: '#ffffff',
  },

  textLabelBalanceColor: {
    fontSize: '0.7rem',
    color: '#ffffff',
  },
});

function CardHoverable({
  tokenName,
  balance,
  interestEarned,
  gainPercent,
  tokensIn,
  tokensOut,
}) {
  const classes = useStyles();

  console.log(balance);

  return (
    <Grid container>
      <Card hoverable className={classes.cardLayoutStyle}>
        <Grid container style={{ marginBottom: '1rem' }}>
          <Grid container item xs={12} direction='row-reverse'>
            <Typo.Title level={4} className={classes.textToken}>
              {tokenName}
            </Typo.Title>
          </Grid>
          <Grid container item xs={12}>
            <Typo.Text className={classes.textLabelBalanceColor}>
              my balance
            </Typo.Text>
          </Grid>
          <Grid container item xs={10}>
            <Typo.Title level={3} className={classes.textTitle}>
              {formatValue(balance)}
            </Typo.Title>
          </Grid>
          <Grid container item xs={2} direction='row-reverse'>
            <Typo.Title level={3} className={classes.textTitle}>
              {renderNumberToReadable(balance)}
            </Typo.Title>
          </Grid>
        </Grid>

        <Grid container>
          <Grid container item xs={10}>
            <Typo.Text
              className={classes.textLabelBalanceColor}
              style={{ marginRight: '0.2rem' }}
            >
              interest earned
            </Typo.Text>
            <Typo.Text
              className={classes.textLabelBalanceColor}
              style={{ marginRight: '0.2rem' }}
              strong
            >
              {formatValue(interestEarned)}
            </Typo.Text>
            <Typo.Text
              className={classes.textLabelBalanceColor}
              style={{ color: '#38ff52' }}
              strong
            >
              {gainPercent}%
            </Typo.Text>
          </Grid>
          <Grid container item xs={2} direction='row-reverse'>
            <Typo.Text className={classes.textLabelBalanceColor}>
              {renderNumberToReadable(interestEarned)}
            </Typo.Text>
          </Grid>
          <Grid container item xs={10}>
            <Typo.Text
              className={classes.textLabelBalanceColor}
              style={{ marginRight: '0.2rem' }}
            >
              deposits
            </Typo.Text>
            <Typo.Text className={classes.textLabelBalanceColor} strong>
              {formatValue(tokensIn)}
            </Typo.Text>
          </Grid>
          <Grid container item xs={2} direction='row-reverse'>
            <Typo.Text className={classes.textLabelBalanceColor}>
              {renderNumberToReadable(tokensIn)}
            </Typo.Text>
          </Grid>
          <Grid container item xs={10}>
            <Typo.Text
              className={classes.textLabelBalanceColor}
              style={{ marginRight: '0.2rem' }}
            >
              withdrawals
            </Typo.Text>
            <Typo.Text className={classes.textLabelBalanceColor} strong>
              {formatValue(tokensOut)}
            </Typo.Text>
          </Grid>
          <Grid container item xs={2} direction='row-reverse'>
            <Typo.Text className={classes.textLabelBalanceColor}>
              {renderNumberToReadable(tokensOut)}
            </Typo.Text>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}

export default CardHoverable;
