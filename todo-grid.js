var start = new Date();

function User(userId) {
  this.userId = userId;
}

User.prototype.getDefaultGrid = function() {
  var day = Days.findOne( {owner: this.userId}, {sort: {createdAt: -1}} );
  var grid = new Grid(this.userId, 'exercise');
  return grid;
}

function getUsername() {
  var user = Meteor.user();
  if ( user ) { 
    if ( user.profile ) {
      return user.profile.name;
    } else {
      return user.username();
    }
  }
}


if (Meteor.isClient) {
  
  Template.body.helpers({
    username : getUsername(),
    
    
    showTotalScore : function () {
      return Session.get("showTotalScore");
    }
  });

  Template.body.events({
    "click .show-total-score input": function (event) {
      Session.set("showTotalScore", event.target.checked);
      console.log(Session.get('showTotalScore'));
    } ,
    "click .js-new-grid" : function(event) {
      var gridName = prompt('Enter a name for your grid');
      var grid = new Grid(Meteor.userId(), gridName);
      Session.set('grid', grid);
    },
    "click .js-add-week-start" : function(event) {
      Meteor.call('addWeek', -1);
    },
    "click .js-add-week-end" : function(event) {
      Meteor.call('addWeek', 1);
    }
  });

  
  
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY",
  });

  Meteor.startup(function () {
    console.log('startup!');
    var start = Meteor.call('getStart', function(error, start) {
      console.log('start = ', start);
      Session.set('start', start);
    });
    console.log('start = ' + start);
  });
}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });

  Meteor.publish('day', function(userId, myDate, gridName) {
    return Days.findOne({date:myDate, owner: userId, gridName: gridName });
  });
}

UI.registerHelper('formatDate', function(context, format) {
  if (!format) {
    format = 'YYYY/MM/DD';
  }
  if(context)
    return moment(context).format(format);
});
