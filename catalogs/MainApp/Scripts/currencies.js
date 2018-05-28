Currencies = (function() {
    return {};
})();

Currencies.upbit = require("upbit");

Currencies.get_current_price = function(currency, coin, handler) {
    Currencies.upbit.get_candles(currency, coin, 1, function(candles) {
        if (candles) {
            handler(candles[0]["tradePrice"]);

            return;
        }

        handler();
    });
}

__MODULE__ = Currencies;
