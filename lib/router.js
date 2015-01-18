Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	waitOn: function() { return Meteor.subscribe('days'); }
});

Router.route('/grids/:_gridName', {
  name : 'gridPage',
  data : function() {
    return Days.find(this.params._gridName);
  }
});