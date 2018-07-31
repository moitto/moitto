API = (function() {
    return {};
})();

API.account  = require("account");
API.wallet   = require("wallet");
API.steemjs  = require("steemjs");
API.global   = require("global");
API.contents = require("contents");
API.users    = require("users");

API.vote = function(params) {
    API.account.vote(params["author"], params["permlink"], parseInt(params["weight"]), function(response) {
        if (response) {
            API.__get_content(params["author"], params["permlink"], function(content) {
                var reblogged = (content.data["reblogged_by"].length > 0) ? true : false;
                var me = API.account.get_username();

                if (parseInt(params["weight"]) == 0) {
                    controller.action("toast", { "message":"보팅이 취소되었습니다." });
                } else {
                    controller.action("toast", { "message":"보팅이 완료되었습니다." });
                }
                controller.update("content-" + content.data["author"] + "." + content.data["permlink"], {
                    "votes-count":content.data["net_votes"].toString(),
                    "vote-weight":content.get_vote_weight(me).toString(),
                    "replies-count":content.data["children"].toString(),
                    "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                    "payout-done":content.is_payout_done() ? "yes" : "no",
                    "payout-declined":content.is_payout_declined() ? "yes" : "no",
                    "reblogged":reblogged ? "yes" : "no",
                    "reblogged-by":reblogged ? content.data["reblogged_by"][0] : "",
                    "reblogged-count":content.data["reblogged_by"].length.toString(),
                    "reblogged-count-1":(content.data["reblogged_by"].length - 1).toString()
                });
            });
        } else {
            controller.action("toast", { "message":"보팅에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"보팅을 진행합니다." });
}

API.reblog = function(params) {
    API.account.reblog(params["author"], params["permlink"], function(response) {
        if (response) {
            API.__get_content(params["author"], params["permlink"], function(content) {
                var reblogged = (content.data["reblogged_by"].length > 0) ? true : false;
                var me = API.account.get_username();

                controller.action("toast", { "message":"리블로그 되었습니다." });
                controller.update("content-" + content.data["author"] + "." + content.data["permlink"], {
                    "votes-count":content.data["net_votes"].toString(),
                    "vote-weight":content.get_vote_weight(me).toString(),
                    "replies-count":content.data["children"].toString(),
                    "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                    "payout-done":content.is_payout_done() ? "yes" : "no",
                    "payout-declined":content.is_payout_declined() ? "yes" : "no",
                    "reblogged":reblogged ? "yes" : "no",
                    "reblogged-by":reblogged ? content.data["reblogged_by"][0] : "",
                    "reblogged-count":content.data["reblogged_by"].length.toString(),
                    "reblogged-count-1":(content.data["reblogged_by"].length - 1).toString()
                });
            });
        } else {
            controller.action("toast", { "message":"리블로그에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"리블로그를 진행합니다." });
}

API.follow_user = function(params) {
    API.account.follow_user(params["username"], function(response) {
        if (response) {
            API.__get_user(params["username"], function(user, follows, muted) {
                controller.action("toast", { "message":"팔로우가 완료되었습니다." });
                controller.update("user-" + user.name, {
                    "reputation":user.get_reputation().toFixed(1).toString(),
                    "post-count":user.get_post_count().toString(),
                    "following-count":user.get_following_count().toString(),
                    "follower-count":user.get_follower_count().toString(),
                    "follows":follows ? "yes" : "no",
                    "muted":muted ? "yes" : "no"
                });
            });
        } else {
            controller.action("toast", { "message":"팔로우에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"팔로우를 진행합니다." });
}

API.unfollow_user = function(params) {
    API.account.unfollow_user(params["username"], function(response) {
        if (response) {
            API.__get_user(params["username"], function(user, follows, muted) {
                controller.action("toast", { "message":"언팔로우가 완료되었습니다." });
                controller.update("user-" + user.name, {
                    "reputation":user.get_reputation().toFixed(1).toString(),
                    "post-count":user.get_post_count().toString(),
                    "following-count":user.get_following_count().toString(),
                    "follower-count":user.get_follower_count().toString(),
                    "follows":follows ? "yes" : "no",
                    "muted":muted ? "yes" : "no"
                });
            });
        } else {
            controller.action("toast", { "message":"언팔로우에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"언팔로우를 진행합니다." });
}

API.mute_user = function(params) {
    API.account.mute_user(params["username"], function(response) {
        if (response) {
            API.__get_user(params["username"], function(user, follows, muted) {
                controller.action("toast", { "message":"뮤트가 완료되었습니다." });
                controller.update("user-" + user.name, {
                    "reputation":user.get_reputation().toFixed(1).toString(),
                    "post-count":user.get_post_count().toString(),
                    "following-count":user.get_following_count().toString(),
                    "follower-count":user.get_follower_count().toString(),
                    "follows":follows ? "yes" : "no",
                    "muted":muted ? "yes" : "no"
                });
            });
        } else {
            controller.action("toast", { "message":"뮤트에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"뮤트를 진행합니다." });
}

API.unmute_user = function(params) {
    API.account.unmute_user(params["username"], function(response) {
        if (response) {
            API.__get_user(params["username"], function(user, follows, muted) {
                controller.action("toast", { "message":"언뮤트가 완료되었습니다." });
                controller.update("user-" + user.name, {
                    "reputation":user.get_reputation().toFixed(1).toString(),
                    "post-count":user.get_post_count().toString(),
                    "following-count":user.get_following_count().toString(),
                    "follower-count":user.get_follower_count().toString(),
                    "follows":follows ? "yes" : "no",
                    "muted":muted ? "yes" : "no"
                });
            });
        } else {
            controller.action("toast", { "message":"언뮤트에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"언뮤트를 진행합니다." });
}

API.transfer = function(params) {
    API.wallet.transfer(params["to"], 
                        params["coin"], 
                        parseFloat(params["amount"]), 
                        params["memo"], function(response) {
        if (response) {
            API.__get_user_simple(account.get_username(), function(user) {
                controller.update("assets", {
                    "steem-balance":user.get_steem_balance().toFixed(3).toString(),
                    "steem-power":user.get_steem_power().toFixed(3).toString(),
                    "sbd-balance":user.get_sbd_balance().toFixed(3).toString(),
                    "reward-steem-balance":user.get_reward_steem_balance().toFixed(3).toString(),
                    "reward-steem-power":user.get_reward_steem_power().toFixed(3).toString(),
                    "reward-sbd-balance":user.get_reward_sbd_balance().toFixed(3).toString(),
                    "has-rewards":user.has_rewards() ? "yes" : "no"
                });
            });
        }
    });
}

API.delegate = function(params) {
    API.wallet.delegate(params["to"], parseFloat(params["amount"]), function(response) {
        if (response) {
            API.__get_user_simple(account.get_username(), function(user) {
                controller.update("assets", {
                    "steem-balance":user.get_steem_balance().toFixed(3).toString(),
                    "steem-power":user.get_steem_power().toFixed(3).toString(),
                    "sbd-balance":user.get_sbd_balance().toFixed(3).toString(),
                    "reward-steem-balance":user.get_reward_steem_balance().toFixed(3).toString(),
                    "reward-steem-power":user.get_reward_steem_power().toFixed(3).toString(),
                    "reward-sbd-balance":user.get_reward_sbd_balance().toFixed(3).toString(),
                    "has-rewards":user.has_rewards() ? "yes" : "no"
                });
            });
        }
    });
}

API.power_up = function(params) {
    API.wallet.power_up(parseFloat(params["amount"]), function(response) {
        if (response) {
            API.__get_user_simple(account.get_username(), function(user) {
                controller.update("assets", {
                    "steem-balance":user.get_steem_balance().toFixed(3).toString(),
                    "steem-power":user.get_steem_power().toFixed(3).toString(),
                    "sbd-balance":user.get_sbd_balance().toFixed(3).toString(),
                    "reward-steem-balance":user.get_reward_steem_balance().toFixed(3).toString(),
                    "reward-steem-power":user.get_reward_steem_power().toFixed(3).toString(),
                    "reward-sbd-balance":user.get_reward_sbd_balance().toFixed(3).toString(),
                    "has-rewards":user.has_rewards() ? "yes" : "no"
                });
            });
        }
    });
}

API.power_down = function(params) {
    API.wallet.power_down(parseFloat(params["amount"]), function(response) {
        if (response) {
            API.__get_user_simple(account.get_username(), function(user) {
                controller.update("assets", {
                    "steem-balance":user.get_steem_balance().toFixed(3).toString(),
                    "steem-power":user.get_steem_power().toFixed(3).toString(),
                    "sbd-balance":user.get_sbd_balance().toFixed(3).toString(),
                    "reward-steem-balance":user.get_reward_steem_balance().toFixed(3).toString(),
                    "reward-steem-power":user.get_reward_steem_power().toFixed(3).toString(),
                    "reward-sbd-balance":user.get_reward_sbd_balance().toFixed(3).toString(),
                    "has-rewards":user.has_rewards() ? "yes" : "no"
                });
            });
        }
    });
}

API.redeem_rewards = function(params) {
    API.wallet.redeem_rewards(function(response) {
        if (response) {
            API.__get_user_simple(account.get_username(), function(user) {
                controller.update("assets", {
                    "steem-balance":user.get_steem_balance().toFixed(3).toString(),
                    "steem-power":user.get_steem_power().toFixed(3).toString(),
                    "sbd-balance":user.get_sbd_balance().toFixed(3).toString(),
                    "reward-steem-balance":user.get_reward_steem_balance().toFixed(3).toString(),
                    "reward-steem-power":user.get_reward_steem_power().toFixed(3).toString(),
                    "reward-sbd-balance":user.get_reward_sbd_balance().toFixed(3).toString(),
                    "has-rewards":user.has_rewards() ? "yes" : "no"
                });
            });
        }
    });
}

API.comment = function(params) {
    API.account.comment(params["parent_author"], 
                        params["parent_permlink"],
                        params["permlink"], 
                        params["title"] || "", 
                        params["body"] || "", 
                        JSON.stringify(params["meta"]), function(response) {
        if (response) {
            API.__get_content(params["parent_author"], params["parent_permlink"], function(content) {
                console.log(JSON.stringify(content.data));
                var reblogged = (content.data["reblogged_by"].length > 0) ? true : false;
                var me = API.account.get_username();

                controller.action("toast", { "message":"댓글을 업로드했습니다." });
                controller.update("content-" + content.data["author"] + "." + content.data["permlink"], {
                    "votes-count":content.data["net_votes"].toString(),
                    "vote-weight":content.get_vote_weight(me).toString(),
                    "replies-count":content.data["children"].toString(),
                    "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                    "payout-done":content.is_payout_done() ? "yes" : "no",
                    "payout-declined":content.is_payout_declined() ? "yes" : "no",
                    "reblogged":reblogged ? "yes" : "no",
                    "reblogged-by":reblogged ? content.data["reblogged_by"][0] : "",
                    "reblogged-count":content.data["reblogged_by"].length.toString(),
                    "reblogged-count-1":(content.data["reblogged_by"].length - 1).toString()
                });
            });
        } else {
            controller.action("toast", { "message":"댓글 업로드에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"댓글 업로드를 진행하고 있습니다." });
}

API.__get_content = function(author, permlink, handler) {
    API.steemjs.get_content(author, permlink).then(function(response) {
        if (response) {
            handler(API.contents.create(response));
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    }); 
}

API.__get_user = function(username, handler) {
    var me = API.account.get_username();

    Promise.all([
        API.steemjs.get_accounts([ username ]),
        API.steemjs.get_follow_count(username),
        API.steemjs.get_dynamic_global_properties(),
        API.steemjs.get_followers(username, me, "blog", 1),
        API.steemjs.get_followers(username, me, "ignore", 1)
    ]).then(function(response) {
        if (response[0][0]) {
            var user = API.users.create(username, response[0][0], response[1], API.global.create(response[2]));
            var follows = (response[3].length == 0 || response[3][0]["follower"] !== me) ? false : true;
            var muted   = (response[4].length == 0 || response[4][0]["follower"] !== me) ? false : true;

            handler(user, follows, muted);
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    });
}

API.__get_user_simple = function(username, handler) {
    Promise.all([
        API.steemjs.get_accounts([ username ]),
        API.steemjs.get_follow_count(username),
        API.steemjs.get_dynamic_global_properties()
    ]).then(function(response) {
        if (response[0][0]) {
            handler(API.users.create(username, response[0][0], response[1], API.global.create(response[2])));
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    });
}

__MODULE__ = API;
