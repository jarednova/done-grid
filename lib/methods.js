Meteor.methods({
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