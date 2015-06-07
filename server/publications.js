Meteor.publish("tps", function() {
	return TPS.find({});
});

Meteor.publish("openbci", function() {
	return OpenBCI.find({});
});