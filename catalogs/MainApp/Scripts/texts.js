Texts = (function() {
    return {};
})();

Texts.replace_emoji_chars = function(text, replaced_text) {
    var pattern = /((?:\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff])+)/g

    return text.replace(pattern, replaced_text);
}

__MODULE__ = Texts;
