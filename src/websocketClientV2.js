import WebSocket from 'ws';
import crypto from 'crypto';
import get from 'lodash/fp/get';
import pipe from 'lodash/fp/pipe';

const withData = listener => pipe(
  get(`data`),
  dataString => JSON.parse(dataString),
  listener,
);

export default class HitBTCWebsocketClient {
  constructor({ key, secret, isDemo = false }) {
    this.key = key;
    this.secret = secret;
    this.baseUrl = `${isDemo ? `demo-api` : `api`}.hitbtc.com`;
    // This.marketUrl = `ws://${this.baseUrl}:80`;
    // This.tradingUrl = `wss://${this.baseUrl}:8080`;
    this.marketUrl = `wss://${this.baseUrl}/api/2/ws`;
    this.hasCredentials = key && secret;

    console.log(`new WebSocket`, this.marketUrl);
    this.marketSocket = new WebSocket(this.marketUrl);

    this.marketSocket.on(`message`, message => {
      console.log(`received: %s`, message);
    });


    // If (this.hasCredentials) {
    //   This.tradingSocket = new WebSocket(this.tradingUrl);
    //   This.tradingSocket.addEventListener(`open`, () =>
    //     This.tradingSocket.send(
    //       This.createRequestData({ Login: {} }),
    //     ),
    //   );
    // }
  }

  createRequestData = payload => {
    const message = {
      nonce: Date.now(),
      payload,
    };

    const signature = crypto
      .createHmac(`sha512`, this.secret)
      .update(JSON.stringify(message))
      .digest(`base64`);

    message
      .payload;

    return JSON.stringify({
      apikey: this.key,
      signature,
      message,
    });
  };

  subscribeOrderbook = listener => {
      this.marketSocket.addEventListener(`open`, () =>
        this.marketSocket.send(this.createRequestData({
          "method": `subscribeOrderbook`,
          "params": {
            "symbol": `ETHBTC`,
          },
          "id": 123,
        })),
      );
      return this.marketSocket.addEventListener(`message`, withData(listener));
    }

  // AddMarketMessageListener = listener =>
  //   This.marketSocket.addEventListener(`message`, withData(listener));

  // AddTradingMessageListener = listener =>
  //   This.tradingSocket.addEventListener(`message`, withData(listener));

  // RemoveMarketMessageListener = listener =>
  //   This.marketSocket.removeEventListener(`message`, withData(listener));

  // RemoveTradingMessageListener = listener =>
  //   This.tradingSocket.removeEventListener(`message`, withData(listener));

  // AddMarketListener = (event, listener) =>
  //   This.marketSocket.addEventListener(event, listener);

  // AddTradingListener = (event, listener) =>
  //   This.tradingSocket.addEventListener(event, listener);

  // RemoveMarketListener = (event, listener) =>
  //   This.marketSocket.removeEventListener(event, listener);

  // RemoveTradingListener = (event, listener) =>
  //   This.tradingSocket.removeEventListener(event, listener);

}
