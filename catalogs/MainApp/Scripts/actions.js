Actions = (function() {
    return {};
})();

Actions.account  = require("account");
Actions.wallet   = require("wallet");
Actions.steemjs  = require("steemjs");
Actions.global   = require("global");
Actions.contents = require("contents");
Actions.users    = require("users");
Actions.rewards  = require("rewards");
Actions.quests   = require("quests");
Actions.settings = require("settings");
Actions.urls     = require("urls");

Actions.query_account = function(params) {
    if (Actions.account.is_logged_in()) {
        Actions.__on_complete(params, "account", {
            "username":Actions.account.get_username()
        });
    } else {
        Actions.__on_complete(params);
    }
}

Actions.open_discussion = function(params) {
    var user = Actions.users.create(params["author"]);

    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION", {
        "author":params["author"],
        "permlink":params["permlink"],
        "userpic-url":user.get_userpic_url("small")
    });

    controller.action("page", { "display-unit":"S_DISCUSSION", "target":"popup" });
}

Actions.show_user = function(params) {
    var user = Actions.users.create(params["username"]);

    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":user.name,
        "userpic-url":user.get_userpic_url("small"),
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_USER", "target":"popup" })
}

Actions.show_votes = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_VOTES", {
        "author":params["author"],
        "permlink":params["permlink"]
    });

    controller.action("page", { "display-unit":"S_VOTES", "target":"popup" })
}

Actions.show_replies = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_REPLIES", {
        "author":params["author"],
        "permlink":params["permlink"]
    });

    controller.action("page", { "display-unit":"S_REPLIES", "target":"popup" })
}

Actions.show_tag = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_TAG", {
        "tag":params["tag"],
        "navibar-title":"#" + params["tag"]
    });

    controller.action("page", { "display-unit":"S_TAG", "target":"popup" })    
}

Actions.vote = function(params) {
    Actions.account.vote(params["author"], params["permlink"], parseInt(params["weight"]), function(response) {
        if (response) {
            Actions.__get_updated_data_for_content(params["author"], params["permlink"], function(id, data) {
                controller.action("toast", { "message":"보팅이 완료되었습니다." });
                controller.update("votes-" + params["author"] + "." + params["permlink"], {});

                Actions.__on_complete(params, id, data);
            });
        } else {
            controller.action("toast", { "message":"보팅에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"보팅을 진행합니다." });
}

Actions.vote_after_payout = function(params) {
    Actions.rewards.get_reward_reply(params["author"], params["permlink"], "after7days", true, function(author, permlink) {
        if (author && permlink) {
            Actions.account.vote(author, permlink, parseInt(params["weight"]), function(response) {
                if (response) {
                    Actions.__get_updated_data_for_content(params["author"], params["permlink"], function(id, data) {
                        controller.action("toast", { "message":"보팅이 완료되었습니다." });
                        controller.update("votes-" + params["author"] + "." + params["permlink"], {});

                        Actions.__on_complete(params, id, data);
                    });
                } else {
                    controller.action("toast", { "message":"보팅에 실패했습니다." });
                }
            });            
        } else {
            controller.action("toast", { "message":"보팅에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"보팅을 진행합니다." });
}

Actions.unvote = function(params) {
    Actions.account.vote(params["author"], params["permlink"], 0, function(response) {
        if (response) {
            Actions.__get_updated_data_for_content(params["author"], params["permlink"], function(id, data) {
                controller.action("toast", { "message":"보팅이 취소되었습니다." });
                controller.update("votes-" + params["author"] + "." + params["permlink"], {});

                Actions.__on_complete(params, id, data);
            });
        } else {
            controller.action("toast", { "message":"보팅 취소에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"보팅 취소를 진행합니다." });
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

Actions.hide_comment = function(params) {
    Actions.__get_user(Actions.account.get_username(), function(user) {
        if (user) {
            Actions.account.vote(params["author"], params["permlink"], -user.get_minimum_voting_weight(), function(response) {
                if (response) {
                    Actions.__get_updated_data_for_content(params["parent-author"], params["parent-permlink"], function(id, data) {
                        controller.action("toast", { "message":"댓글을 감췄습니다." });
                        controller.update("replies-" + params["parent-author"] + "." + params["parent-permlink"], {});

                        Actions.__on_complete(params, id, data);
                    });
                } else {
                    controller.action("toast", { "message":"댓글 감추기에 실패했습니다." });
                }
            });
        } else {
            controller.action("toast", { "message":"댓글 감추기에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"댓글 감추기를 진행하고 있습니다." });
}

Actions.follow = function(params) {
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

Actions.unfollow = function(params) {
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

Actions.mute = function(params) {
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

Actions.unmute = function(params) {
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
    var amount = parseFloat(params["amount"]).toFixed(3) + " " + params["coin"];

    if (Actions.settings.wallet_features_allowed()) {
        Actions.wallet.transfer(params["to"], amount, params["memo"], function(response) {
            if (response) {
                Actions.__get_updated_data_for_assets(Actions.account.get_username(), function(id, data) {
                    Actions.__on_complete(params, id, data);
                });
            }
        });        
    } else {
        Actions.__browse_steemconnect("transfer", {
            "from":Actions.account.get_username(),
            "to":params["to"],
            "amount":amount,
            "memo":encodeURIComponent(params["memo"] || "")
        });
    }
}

Actions.delegate = function(params) {
    var amount = parseFloat(params["amount"]).toFixed(3) + " " + params["coin"];

    if (Actions.settings.wallet_features_allowed()) {
        Actions.wallet.delegate(params["to"], amount, function(response) {
            if (response) {
                Actions.__get_updated_data_for_assets(Actions.account.get_username(), function(id, data) {
                    Actions.__on_complete(params, id, data);
                });
            }
        });
    } else {
        Actions.__browse_steemconnect("delegate-vesting-shares", {
            "delegator":Actions.account.get_username(),
            "delegatee":params["to"],
            "vesting_shares":amount
        });
    }
}

Actions.undelegate = function(params) {
    if (Actions.settings.wallet_features_allowed()) {
        Actions.wallet.undelegate(params["from"], function(response) {
            if (response) {
                Actions.__get_updated_data_for_assets(Actions.account.get_username(), function(id, data) {
                    Actions.__on_complete(params, id, data);
                });
            }
        });
    } else {
        Actions.__browse_steemconnect("undelegate-vesting-shares", {
            "delegator":Actions.account.get_username(),
            "delegatee":params["from"]
        });
    }
}

Actions.power_up = function(params) {
    var amount = parseFloat(params["amount"]).toFixed(3) + " " + params["coin"];

    if (Actions.settings.wallet_features_allowed()) {
        Actions.wallet.power_up(amount, function(response) {
            if (response) {
                Actions.__get_updated_data_for_assets(Actions.account.get_username(), function(id, data) {
                    Actions.__on_complete(params, id, data);
                });
            }
        });
    } else {
        Actions.__browse_steemconnect("transfer-to-vesting", {
            "to":Actions.account.get_username(),
            "amount":amount
        });
    }
}

Actions.power_down = function(params) {
    var amount = parseFloat(params["amount"]).toFixed(3) + " " + params["coin"];

    if (Actions.settings.wallet_features_allowed()) {
        Actions.wallet.power_down(amount, function(response) {
            if (response) {
                Actions.__get_updated_data_for_assets(Actions.account.get_username(), function(id, data) {
                    Actions.__on_complete(params, id, data);
                });
            }
        });
    } else {
        Actions.__browse_steemconnect("withdraw-vesting", {
            "account":Actions.account.get_username(),
            "amount":amount
        });
    }
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

Actions.start_quest = function(params) {
    Actions.quests.start_quest(params["author"], params["permlink"], function() {
        Actions.__get_updated_data_for_content(params["author"], params["permlink"], function(id, data) {
            Actions.__on_complete(params, id, data);
        });
    });
}

Actions.finish_quest = function(params) {
    Actions.quests.finish_quest(params["author"], params["permlink"], params["comment"], function() {
        Actions.__get_updated_data_for_content(params["author"], params["permlink"], function(id, data) {
            Actions.__on_complete(params, id, data);
        });
    });    
}

Actions.__get_user = function(username, handler) {
    Promise.all([
        Actions.steemjs.get_accounts([ username ]),
        Actions.steemjs.get_dynamic_global_properties()
    ]).then(function(response) {
        if (response[0][0]) {
            handler(Actions.users.create(username, response[0][0], undefined, Actions.global.create(response[1])));
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    });
}

Actions.__get_updated_data_for_content = function(author, permlink, handler) {
    var path = "/" + undefined + "/@" + author + "/" + permlink;

    Actions.steemjs.get_state(path).then(function(response) {
        if (response) {
            var discussion = response["content"][author + "/" + permlink];
            var replies = [];

            Object.keys(response["content"]).forEach(function(path) {
                var content = response["content"][path];

                if (content["parent_permlink"] === permlink) {
                    replies.push(content);
                }
            });

            var content = Actions.contents.create(discussion, replies);
            var reblogged = (content.data["reblogged_by"].length > 0) ? true : false;
            var me = storage.value("ACTIVE_USER") || "";
            var data = {
                "votes-count":content.data["net_votes"].toString(),
                "vote-weight":(content.get_vote_weight(me) || content.get_vote_weight_after_payout(me)).toString(),
                "replies-count":content.data["children"].toString(),
                "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                "payout-done":content.is_payout_done() ? "yes" : "no",
                "payout-declined":content.is_payout_declined() ? "yes" : "no",
                "reblogged":reblogged ? "yes" : "no",
                "reblogged-by":reblogged ? content.data["reblogged_by"][0] : "",
                "reblogged-count":content.data["reblogged_by"].length.toString(),
                "reblogged-count-1":(content.data["reblogged_by"].length - 1).toString(),
                "editable":content.is_editable(me) ? "yes" : "no",
                "deletable":content.is_deletable(me) ? "yes" : "no",
                "hidable":(content.is_hidable(me) && !content.is_owner(me)) ? "yes" : "no"
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
    var me = storage.value("ACTIVE_USER") || "";

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

Actions.__browse_steemconnect = function(method, params) {
    var query = Actions.urls.build_query(params);
    var url = "https://v2.steemconnect.com/sign/" + method + "?" + query;

    controller.action("link", {
        "url":url,
        "target":"browser"
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
