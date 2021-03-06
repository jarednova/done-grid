Meteor.methods({
  getStart : function() {
    //if (Meteor.isClient) {    
      var firstDay = Days.findOne({owner: Meteor.userId()}, {sort: {date: 1}});
      //var firstDay = Meteor.subscribe('startDate');
      console.log('firstDAy = ', firstDay.date);
      return firstDay.date;
    //}
  },
  addWeek : function(direction) {
    if (typeof Session != 'undefined') {
      if (direction < 0) {
        var start = Session.get('start');
        var $gridDate = moment(start);
        var $newGridDate = $gridDate.subtract(1, 'weeks');
        Session.set('start', $newGridDate.toDate())
      } 
      var length = Session.get('length');
      var newLength = length + Math.abs(direction);
      Session.set('length', newLength);
    }
  }
});

if (Meteor.isServer) {
  Meteor.publish("startDate", function () {
    console.log(Days);
    var startDay = Days.findOne({owner: Meteor.userId()}, {sort: {date: -1}});
    return startDay;
  });
}

