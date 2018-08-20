Actions = (function() {
    return {};
})();

Actions.account  = require("account");
Actions.wallet   = require("wallet");
Actions.steemjs  = require("steemjs");
Actions.global   = require("global");
Actions.contents = require("contents");
Actions.users    = require("users");

Actions.vote = function(params) {
    Actions.account.vote(params["author"], params["permlink"], parseInt(params["weight"]), function(response) {
        if (response) {
            Actions.__get_updated_data_for_content(params["author"], params["permlink"], function(id, data) {
                if (parseInt(params["weight"]) == 0) {
                    controller.action("toast", { "message":"보팅이 취소되었습니다." });
                } else {
                    controller.action("toast", { "message":"보팅이 완료되었습니다." });
                }
                controller.update("votes-" + params["author"] + "." + params["permlink"], {});

                Actions.__on_complete(params, id, data);
            });
        } else {
            controller.action("toast", { "message":"보팅에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"보팅을 진행합니다." });
}

Actions.reblog = function(params) {
    Actions.account.reblog(params["author"], params["permlink"], function(response) {
        if (response) {
            Actions.__get_updated_data_for_content(params["author"], params["permlink"], function(id, data) {
                controller.action("toast", { "message":"리블로그 되었습니다." });
                
                Actions.__on_complete(params, id, data);
            });
        } else {
            controller.action("toast", { "message":"리블로그에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"리블로그를 진행합니다." });
}

Actions.comment = function(params) {
    Actions.account.comment(params["parent-author"], 
                            params["parent-permlink"],
                            params["permlink"], 
                            params["title"] || "", 
                            params["body"] || "", 
                            JSON.stringify(params["meta"]), function(response) {
        if (response) {
            Actions.__get_updated_data_for_content(params["parent-author"], params["parent-permlink"], function(id, data) {
                controller.action("toast", { "message":"댓글을 업로드했습니다." });
                controller.update("replies-" + params["parent-author"] + "." + params["parent-permlink"], {});

                Actions.__on_complete(params, id, data);
            });
        } else {
            controller.action("toast", { "message":"댓글 업로드에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"댓글 업로드를 진행하고 있습니다." });
}

Actions.delete_comment = function(params) {
    Actions.account.delete_comment(params["permlink"], function(response) {
        if (response) {
            Actions.__get_updated_data_for_content(params["parent-author"], params["parent-permlink"], function(id, data) {
                controller.action("toast", { "message":"댓글을 삭제했습니다." });
                controller.update("replies-" + params["parent-author"] + "." + params["parent-permlink"], {});

                Actions.__on_complete(params, id, data);
            });
        } else {
            controller.action("toast", { "message":"댓글 삭제에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"댓글 삭제를 진행하고 있습니다." });
}

Actions.follow_user = function(params) {
    Actions.account.follow_user(params["username"], function(response) {
        if (response) {
            Actions.__get_updated_data_for_user(params["username"], function(id, data) {
                controller.action("toast", { "message":"팔로우가 완료되었습니다." });

                Actions.__on_complete(params, id, data);
            });
        } else {
            controller.action("toast", { "message":"팔로우에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"팔로우를 진행합니다." });
}

Actions.unfollow_user = function(params) {
    Actions.account.unfollow_user(params["username"], function(response) {
        if (response) {
            Actions.__get_updated_data_for_user(params["username"], function(id, data) {
                controller.action("toast", { "message":"언팔로우가 완료되었습니다." });

                Actions.__on_complete(params, id, data);
            });
        } else {
            controller.action("toast", { "message":"언팔로우에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"언팔로우를 진행합니다." });
}

Actions.mute_user = function(params) {
    Actions.account.mute_user(params["username"], function(response) {
        if (response) {
            Actions.__get_updated_data_for_user(params["username"], function(id, data) {
                controller.action("toast", { "message":"뮤트가 완료되었습니다." });

                Actions.__on_complete(params, id, data);
            });
        } else {
            controller.action("toast", { "message":"뮤트에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"뮤트를 진행합니다." });
}

Actions.unmute_user = function(params) {
    Actions.account.unmute_user(params["username"], function(response) {
        if (response) {
            Actions.__get_updated_data_for_user(params["username"], function(id, data) {
                controller.action("toast", { "message":"언뮤트가 완료되었습니다." });

                Actions.__on_complete(params, id, data);
            });
        } else {
            controller.action("toast", { "message":"언뮤트에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"언뮤트를 진행합니다." });
}

Actions.transfer = function(params) {
    Actions.wallet.transfer(params["to"], 
                            params["coin"], 
                            parseFloat(params["amount"]), 
                            params["memo"], function(response) {
        if (response) {
            Actions.__get_updated_data_for_assets(Actions.account.get_username(), function(id, data) {
                Actions.__on_complete(params, id, data);
            });
        }
    });
}

Actions.delegate = function(params) {
    Actions.wallet.delegate(params["to"], parseFloat(params["amount"]), function(response) {
        if (response) {
            Actions.__get_updated_data_for_assets(Actions.account.get_username(), function(id, data) {
                Actions.__on_complete(params, id, data);
            });
        }
    });
}

Actions.undelegate = function(params) {
    Actions.wallet.undelegate(params["from"], function(response) {
        if (response) {
            Actions.__get_updated_data_for_assets(Actions.account.get_username(), function(id, data) {
                Actions.__on_complete(params, id, data);
            });
        }
    });
}

Actions.power_up = function(params) {
    Actions.wallet.power_up(parseFloat(params["amount"]), function(response) {
        if (response) {
            Actions.__get_updated_data_for_assets(Actions.account.get_username(), function(id, data) {
                Actions.__on_complete(params, id, data);
            });
        }
    });
}

Actions.power_down = function(params) {
    Actions.wallet.power_down(parseFloat(params["amount"]), function(response) {
        if (response) {
            Actions.__get_updated_data_for_assets(Actions.account.get_username(), function(id, data) {
                Actions.__on_complete(params, id, data);
            });
        }
    });
}

Actions.redeem_rewards = function(params) {
    Actions.wallet.redeem_rewards(function(response) {
        if (response) {
            Actions.__get_updated_data_for_assets(Actions.account.get_username(), function(id, data) {
                Actions.__on_complete(params, id, data);
            });
        } else {
            Actions.__get_updated_data_for_assets(Actions.account.get_username(), function(id, data) {
                Actions.__on_complete(params, id, data);
            });
        }
    });
}

Actions.__get_updated_data_for_content = function(author, permlink, handler) {
    Actions.steemjs.get_content(author, permlink).then(function(response) {
        if (response) {
            var content = Actions.contents.create(response);
            var reblogged = (content.data["reblogged_by"].length > 0) ? true : false;
            var me = Actions.account.get_username();
            var data = {
                "votes-count":content.data["net_votes"].toString(),
                "vote-weight":content.get_vote_weight(me).toString(),
                "replies-count":content.data["children"].toString(),
                "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                "payout-done":content.is_payout_done() ? "yes" : "no",
                "payout-declined":content.is_payout_declined() ? "yes" : "no",
                "reblogged":reblogged ? "yes" : "no",
                "reblogged-by":reblogged ? content.data["reblogged_by"][0] : "",
                "reblogged-count":content.data["reblogged_by"].length.toString(),
                "reblogged-count-1":(content.data["reblogged_by"].length - 1).toString(),
                "editable":content.is_editable(me) ? "yes" : "no",
                "deletable":content.is_deletable(me) ? "yes" : "no"
            }
 
            handler("content-" + content.data["author"] + "." + content.data["permlink"], data);
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    }); 
}

Actions.__get_updated_data_for_user = function(username, handler) {
    var me = Actions.account.get_username();

    Promise.all([
        Actions.steemjs.get_accounts([ username ]),
        Actions.steemjs.get_follow_count(username),
        Actions.steemjs.get_dynamic_global_properties(),
        Actions.steemjs.get_followers(username, me, "blog", 1),
        Actions.steemjs.get_followers(username, me, "ignore", 1)
    ]).then(function(response) {
        if (response[0][0]) {
            var user = Actions.users.create(username, response[0][0], response[1], Actions.global.create(response[2]));
            var follows = (response[3].length == 0 || response[3][0]["follower"] !== me) ? false : true;
            var muted   = (response[4].length == 0 || response[4][0]["follower"] !== me) ? false : true;
            var data = {
                "reputation":user.get_reputation().toFixed(1).toString(),
                "post-count":user.get_post_count().toString(),
                "following-count":user.get_following_count().toString(),
                "follower-count":user.get_follower_count().toString(),
                "follows":follows ? "yes" : "no",
                "muted":muted ? "yes" : "no"
            }

            handler("user-" + user.name, data);
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    });
}

Actions.__get_updated_data_for_assets = function(username, handler) {
    Promise.all([
        Actions.steemjs.get_accounts([ username ]),
        Actions.steemjs.get_follow_count(username),
        Actions.steemjs.get_dynamic_global_properties()
    ]).then(function(response) {
        if (response[0][0]) {
            var user = Actions.users.create(username, response[0][0], response[1], Actions.global.create(response[2]));
            var data = {
                "steem-balance":user.get_steem_balance().toFixed(3).toString(),
                "steem-power":user.get_steem_power().toFixed(3).toString(),
                "sbd-balance":user.get_sbd_balance().toFixed(3).toString(),
                "reward-steem-balance":user.get_reward_steem_balance().toFixed(3).toString(),
                "reward-steem-power":user.get_reward_steem_power().toFixed(3).toString(),
                "reward-sbd-balance":user.get_reward_sbd_balance().toFixed(3).toString(),
                "has-rewards":user.has_rewards() ? "yes" : "no"
            }

            handler("assets", data);
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    });
}

Actions.__on_complete = function(params, id, data) {
    if (params["return-script"]) {
        controller.action("script", Object.assign({
            "script":params["return-script"],
            "app":params["source-app"] || "",
            "subview":params["return-subview"] || "",
            "request-id":params["request-id"] || "",
            "data-binding":id || ""
        }, data || {}));
    }

    if (id) {
        controller.update(id, data);
    }
}

__MODULE__ = Actions;
