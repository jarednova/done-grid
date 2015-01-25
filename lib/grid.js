if (Meteor.isClient) {
  Template.grid.helpers({
    weeks : function(){
      var start = new Date();
      var grid = new Grid();
      grid.set('Days', Days);
      return grid.getWeeks(start, 10);
    },
    daysOfWeek : function(){
      var grid = new Grid();
      return grid.buildDaysOfWeek();
    }
  });
}

function Grid() {
  this.gridName = 'exercise';
  this.name = this.gridName;
}


Grid.prototype.buildDaysOfWeek = function(){
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
  return weeks;
} 

Grid.prototype.buildWeek = function( startDate ) {
  var week = {};
  week.days = new Array();
  var $startDate = moment(startDate, "YYYYMMDD 00:00:00");
  $startDate.hour(0);
  $startDate.minute(0);
  $startDate.second(0);
  var score = 0;
  for (var i = 0; i < 7; i++) {
    var day = this.buildDay($startDate.toDate());
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
  var $myDate = moment(date);
  var start = $myDate.toDate();
  var $nextDay = moment($myDate);
  var end = $nextDay.add(1, 'days').toDate();

  var day = this.Days.findOne({"date":{"$gte": start, "$lt" : end}, gridName:'exercise'});
  if (!day) {
    day = {};
    day.date = $myDate.toDate();
    day.status = false;
    day.note = false;
    day.slug = $myDate.format('dddd').toLowerCase();
  } else if (day && day.note) {
    day.status = true;
  } else {
    day.status = false;
  }
  return day;
}
