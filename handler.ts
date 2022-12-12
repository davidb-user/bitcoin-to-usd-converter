import axios from "axios";

type ExchangeChangeResponse = {
  data: {
    rates: {
      USD: string;
    };
  };
};

async function getBitcoinToUsdExchangeRate(): Promise<number> {
  const rateResponse = await axios.get<ExchangeChangeResponse>(
    "https://api.coinbase.com/v2/exchange-rates?currency=BTC"
  );

  return parseFloat(rateResponse.data.data.rates.USD);
}

async function convertBitcoinToUsd(bitcoinAmount: number): Promise<number> {
  if (!bitcoinAmount) {
    return 0;
  }

  const rate = await getBitcoinToUsdExchangeRate();

  return bitcoinAmount * rate;
}

interface Input {
  bitcoinAmount: number;
}

export const bitcoinToUsdConverter = async ({ bitcoinAmount }: Input) => {
  const usdAmount = await convertBitcoinToUsd(bitcoinAmount);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: { usdAmount },
        input: { bitcoinAmount },
      },
      null,
      2
    ),
  };
};
