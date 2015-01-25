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