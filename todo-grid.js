var Days = new Mongo.Collection("days");
var start = new Date();

function User(userId) {
  this.userId = userId;
}

User.prototype.getDefaultGrid = function() {
  var day = Days.findOne( {owner: this.userId}, {sort: {createdAt: -1}} );
  var grid = new Grid(this.userId, 'exercise');
  return grid;
}

function Grid(userId, gridName) {
  this.user = new User(userId);
  gridName = (typeof gridName === "undefined") ? null : gridName;
  this.gridName = gridName;
  if (gridName == null) {
    var grid = this.user.getDefaultGrid();
    this.gridName = 'exercise';
  }
  this.name = this.gridName;
}

Grid.prototype.set = function(key, value) {
  this[key] = value;
}

Grid.prototype.getWeeks = function( startDate, limit ) {
  var weeks = this.buildWeeks(startDate, limit);
  return weeks;
};

Grid.prototype.buildWeeks = function( startDate, limit ) {
  var weeks = new Array();
  var $startDate = moment(startDate);
  if (typeof startDate == 'string') {
    $startDate = moment(startDate, "YYYYMMDD");
  }
  do {
    $startDate = $startDate.subtract(1, 'days');
  } while ($startDate.format('dddd') != 'Sunday');
  
  for (var i = 0; i < limit; i++) {
    var week = this.buildWeek($startDate);
    $startDate = $startDate.add(7, 'days');
    weeks.push(week);
  }
  console.log(weeks);
  return weeks;
} 

Grid.prototype.buildWeek = function( startDate ) {
  var week = {};
  week.days = new Array();
  var $startDate = moment(startDate, "YYYYMMDD");
  var score = 0;
  for (var i = 0; i < 7; i++) {
    var day = this.buildDay($startDate);
    if (day.note) {
      score++;
    }
    week.days.push(day);
    $startDate = $startDate.add(1, 'days');
  }
  week.score = score;
  return week;
};

Grid.prototype.buildDay = function( date ) {
  var myDate = new Date(date);
  //var day = Meteor.subscribe('day', Meteor.userId, myDate, 'exercise');
  var day = this.Days.findOne({date:myDate, owner: Meteor.userId(), gridName: 'exercise' });
  console.log('day', day);
  if (!day) {
    day = {};
    day.date = new Date(myDate);
    day.status = false;
    day.note = false;
    day.slug = date.format('dddd').toLowerCase();
  } else if (day && day.note) {
    day.status = true;
  } else {
    day.status = false;
  }
  return day;
}

function onDayEnter(event) {
  var $input = $(event.currentTarget);
  var $td = $input.closest('td');
  var date = new Date($td.data('date'));
  var note = $input.val();
  if (note) {
    var obj = {
      date:date,
      note:note,
      gridName: 'exercise',
      createdAt : new Date(),
      owner:Meteor.userId()
    };
    console.log(obj);
    Days.insert(obj);
  } else {
    Days.remove(this._id);
  }
}

function buildDaysOfWeek(){
  var days = Array();
  var fullDayNames = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
  for ( var i = 0; i < fullDayNames.length; i++ ) {
    var day = {};
    day.fullName = fullDayNames[i];
    day.shortName = fullDayNames[i].substr(0, 3);
    day.letter = fullDayNames[i].substr(0, 1);
    days.push(day);
  }
  return days;
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
  Template.grid.helpers({
    weeks : function(){
      var grid = new Grid();
      grid.set('Days', Days);
      return grid.getWeeks(start, 10);
      //return buildWeeks(start, 10, Days);
    },
    daysOfWeek : buildDaysOfWeek(),
  });

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
    }
  });

  Template.day.events({

    "blur .grid-text-input" : onDayEnter,
    "keyup .grid-text-input" : function(event) {
      var $input = $(event.currentTarget);
      var $td = $input.closest('td');
      if (event.keyCode == 13) {
        onDayEnter(event);
        var $next = $td.next();
        $next.find('input').focus();
      }
      if (event.keyCode == 8) {
        if (!$input.val()) {
          onDayEnter(event);
          var $prev = $td.prev();
          $prev.find('input').focus();
        }
      }
    },
    "click ._js-count-days" : function(event) {
      var $td = $(event.currentTarget);
      var date = new Date($td.data('date'));
      var status = true;
      if ($td.data('status')) {
        status = false;
      }
      if (status) {
        Days.insert({
          date : date,
          status : status,
          owner: Meteor.userId(),
          createdAt: new Date(),
          gridName: 'exercise'
        });
      } else {
        Days.remove(this._id);
      }
      return true;
    }
  });
  
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY",
  });

  Meteor.startup(function () {
    var grid = new Grid(Meteor.userId());
    Session.set('grid', grid);
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
