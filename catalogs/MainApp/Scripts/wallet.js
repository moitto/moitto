Wallet = (function() {
    return {};
})();

Wallet.account = require("account"); 
Wallet.upbit   = require("upbit");

Wallet.transfer = function(to, coin, amount, handler) {

}

Wallet.get_coin_price = function(currency, coin, handler) {
    Wallet.upbit.get_candles(currency, coin, 1, function(candles) {
        if (candles) {
            handler(candles[0]["tradePrice"]);
        } else {
            handler();
        }
    });
}


__MODULE__ = Wallet;
