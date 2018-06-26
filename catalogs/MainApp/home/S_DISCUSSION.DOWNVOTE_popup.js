var global = require("global");

var __user = null;

function on_loaded() {
    var me = storage.value("ACTIVE_USER");

    global.get_user(me).then(function(user) {
		__update_power_label(user.get_voting_power().toFixed(1));
    	__update_amount_label(user.get_voting_amount(__get_voting_weight()).toFixed(2));

    	__user = user;
    });
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

function downvote() {
	document.value("VOTE", {
		author:$data["author"],
		permlink:$data["permlink"],
		weight:__get_voting_weight()
	});

	controller.action("script", { 
		"script":"vote",
		"subview":"__MAIN__",
		"close-popup":"yes"
	});
}

function __update_percent_slider(percent) {
	var slider = view.object("slider.percent");

	slider.property({ "position":percent });
}

function __update_percent_label(percent) {
	var label = view.object("label.percent");

	label.property({ "text":percent + "%" });
}

function __update_power_label(power) {
	var label = view.object("label.power");

	label.property({ "text":power + "%" });
}

function __update_amount_label(amount) {
	var label = view.object("label.amount");

	label.property({ "text":"$" + amount });
}

function __get_voting_weight() {
	return -parseFloat(view.object("slider.percent").value()).toFixed(1) * 100;
}
