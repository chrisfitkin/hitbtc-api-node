'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _get = require('lodash/fp/get');

var _get2 = _interopRequireDefault(_get);

var _pipe = require('lodash/fp/pipe');

var _pipe2 = _interopRequireDefault(_pipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const withData = listener => (0, _pipe2.default)((0, _get2.default)(`data`), dataString => JSON.parse(dataString), listener);

class HitBTCWebsocketClient {

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

  constructor({ key, secret, isDemo = false }) {
    this.createRequestData = payload => {
      const message = {
        nonce: Date.now(),
        payload
      };

      const signature = _crypto2.default.createHmac(`sha512`, this.secret).update(JSON.stringify(message)).digest(`base64`);

      message.payload;

      return JSON.stringify({
        apikey: this.key,
        signature,
        message
      });
    };

    this.subscribeOrderbook = listener => {
      this.marketSocket.addEventListener(`open`, () => this.marketSocket.send(this.createRequestData({
        "method": `subscribeOrderbook`,
        "params": {
          "symbol": `ETHBTC`
        },
        "id": 123
      })));
      return this.marketSocket.addEventListener(`message`, withData(listener));
    };

    this.key = key;
    this.secret = secret;
    this.baseUrl = `${isDemo ? `demo-api` : `api`}.hitbtc.com`;
    // This.marketUrl = `ws://${this.baseUrl}:80`;
    // This.tradingUrl = `wss://${this.baseUrl}:8080`;
    this.marketUrl = `wss://${this.baseUrl}/api/2/ws`;
    this.hasCredentials = key && secret;

    console.log(`new WebSocket`, this.marketUrl);
    this.marketSocket = new _ws2.default(this.marketUrl);

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

}
exports.default = HitBTCWebsocketClient;