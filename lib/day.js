if (Meteor.isClient) {
  Template.day.events({

    "blur .grid-text-input" : onDayEnter,
    "keyup .grid-text-input" : function(event) {
      var $input = $(event.currentTarget);
      var $td = $input.closest('td');
      if (event.keyCode == 13) {
        onDayEnter(event);
        var $next = $td.next();
        $next.find('input').focus();
        this.alreadyEmpty = false;
      }
      if (event.keyCode == 8) {
        if (!$input.val()) {
          Days.remove(this._id);
          if (this.alreadyEmpty) {
            this.alreadyEmpty = false;
            var $prev = $td.prev();
            $prev.find('input').focus();
          }
          this.alreadyEmpty = true;          
        }
      }
    }
  });
}

function onDayEnter(event) {
  var $input = $(event.currentTarget);
  var $td = $input.closest('td');
  var date = new Date($td.data('date'));
  var $date = moment(date);
  var note = $input.val();
  if (note) {
    var obj = {
      date:date,
      note:note,
      gridName: 'exercise',
      slug: $date.format('YYYYMMDD').toLowerCase(),
      createdAt : new Date(),
      owner:Meteor.userId()
    };
    Days.insert(obj);
  } else {
    Days.remove(this._id);
  }
}