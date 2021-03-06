// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {

  Template.leaderboard.players = function () {
    if( Session.get("sort") === "alpha" )
	return Players.find({}, {sort: {score: -1, name: 1}});
    else
	return Players.find({}, {sort: {score: 1, name: -1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.player.events({
    'click input.remove': function() {
	Players.remove( this._id );
    }
  });

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    },
    'click input.sort': function () {	
	var sort = Session.equals("sort", "alpha") ? "sort" : "alpha";
	Session.set("sort", sort);
    },
    'click input.rand': function() {	
	Players.find().forEach(function(player){
     	  Players.update(player._id, {$set: {score: Math.floor(Random.fraction()*10)*5}});
	});
    },
   'click input.add': function() {
	var elm = document.getElementById("addition");
   	var addition = elm.value;
	Players.insert({name: addition, score: Math.floor(Random.fraction()*10)*5});
     	elm.value = "";
     }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "The Brock Ellis",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
