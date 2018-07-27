var steemjs = require("steemjs");
var global  = require("global");
var users   = require("users");

var __user = null;

function on_loaded() {
    var me = storage.value("ACTIVE_USER") || "";

    __get_user(me, function(user) {
		__update_power_label(user.get_voting_power().toFixed(1));
    	__update_amount_label(user.get_voting_amount(__get_voting_weight()).toFixed(2));

    	__user = user;
    });

    __restore_recent_percent();
}

function on_change_percent(params) {
	var percent = parseFloat(params["value"]).toFixed(1);
	
	__update_percent_label(percent);

	if (__user) {
		__update_amount_label(__user.get_voting_amount(__get_voting_weight()).toFixed(2));
	}
}

function select_percent(params) {
	var percent = parseFloat(params["value"]).toFixed(1);

	__update_percent_slider(percent);
}

function upvote() {
	controller.action("script", { 
		"script":"api.vote",
		"subview":"__MAIN__",
        "author":$data["author"],
        "permlink":$data["permlink"],
        "weight":__get_voting_weight(),
		"close-popup":"yes"
	});

    __save_recent_percent();
}

function __get_user(username, handler) {
    Promise.all([
        steemjs.get_accounts([ username ]),
        steemjs.get_dynamic_global_properties()
    ]).then(function(response) {
                console.log(JSON.stringify(response));

        if (response[0][0]) {
            handler(users.create(username, response[0][0], undefined, global.create(response[1])));
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    });
}

function __restore_recent_percent() {
	var percent = storage.value("UPVOTE_PERCENT") || 100;

	__update_percent_slider(percent);
	__update_percent_label(percent);
}

function __save_recent_percent() {
	var percent = view.object("slider.percent").value();

	storage.value("UPVOTE_PERCENT", parseFloat(percent));
}

function __update_percent_slider(percent) {
	var slider = view.object("slider.percent");

	slider.property({ "position":percent.toString() });
}

function __update_percent_label(percent) {
	var label = view.object("label.percent");

	label.property({ "text":percent.toString() + "%" });
}

function __update_power_label(power) {
	var label = view.object("label.power");

	label.property({ "text":power.toString() + "%" });
}

function __update_amount_label(amount) {
	var label = view.object("label.amount");

	label.property({ "text":"$" + amount });
}

function __get_voting_weight() {
	return parseFloat(view.object("slider.percent").value()).toFixed(1) * 100;
}
