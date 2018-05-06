Users = (function() {
    return {};
})();

function User(data) {
	this.data = data;
}

Users.create(data) {
	return new User(data);
}

__MODULE__ = Users;
