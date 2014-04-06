if (Meteor.isClient) {
  Session.set('showCreateDialog', false);
  Template.hello.greeting = function () {
    return "Welcome to DoubtMe.";
  };
  

  /* Events */
  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
  Template.feed.events({
    'click .add_task': function() {
      Session.set("showCreateDialog", true);
    },
  });
  /* Create Goal Method */
  Template.createDialog.events({
    'click .save': function (event, template) {
      var title = template.find(".title").value;
      var description = template.find(".description").value;
      if (title.length && description.length) {
        Meteor.call('createGoal', {
          title: title,
          description: description,
          creator: "Wonjun"
        });
        Session.set("showCreateDialog",false);
      } else {
        Session.set("createError",
                    "It needs a title and a description, or why bother?");
      }
    },
    'click .cancel': function () {
      Session.set("showCreateDialog", false);
    }
  });

  /* Feed Methods */
  Template.feed.goals = function () {
      return Goals.find();
  };
  Template.feed.showCreateDialog = function () {
    return Boolean(Session.get("showCreateDialog"));
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

/* Goals Model */
Goals = new Meteor.Collection('goals');

Goals.allow({
  insert: function(userId, goals) {
    return false;
  },
  update: function(userId, goals, fields, modifier) {
    return true;
  },
  remove: function(userId, goals) {
    return _.all(goals, function(goal){return goal.done;});
  }
});

Meteor.methods({
  createGoal: function(options) {
    return Goals.insert(
      {
      title: options.title,
      description: options.description,
      creator: options.creator,
      done: false
    });
  },
  removeAllGoals: function() {
    return Goals.remove({});
  }
});

