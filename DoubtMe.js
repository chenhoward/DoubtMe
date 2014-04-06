if (Meteor.isClient) {

  /* Events */
  Template.login.greeting = function () {
    if (Meteor.user())
      return Meteor.user().emails[0].address + " " + Meteor.user().points;
  };
  var isValidPassword = function(val) {
    return (val.length >= 6) ? true : false;
  }
  var trimInput = function(val) {
    return val.replace(/^\s*|\s*$/g, "");
  }
  Template.login.events({

    'submit #login-form' : function(e, t){
      e.preventDefault();
      // retrieve the input field values
      var email = t.find('#login-email').value
        , password = t.find('#login-password').value;
      console.log("call");
      var email = trimInput(email);

      // Trim and validate your fields here.... 

      // If validation passes, supply the appropriate fields to the
      // Meteor.loginWithPassword() function.
      Meteor.loginWithPassword(email, password, function(err){
        if (err) {
          console.log("Error");
        }
        // The user might not have been found, or their passwword
        // could be incorrect. Inform the user that their
        // login attempt has failed. 
        else {
          console.log("Success");
        }
        // The user has been logged in.
      });
      return false; 
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
      var points_per_person = template.find(".points_per_person").value;
      if (title.length && description.length && points_per_person) {
        Meteor.call('createGoal', {
          title: title,
          description: description,
          points_per_person: points_per_person,
          creator: Meteor.user() ? Meteor.user().emails[0].address : 'Stranger'
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
    if (Meteor.user())
      return Goals.find();
  };
  Template.feed.showCreateDialog = function () {
    return Boolean(Session.get("showCreateDialog"));
  };

  /* Goal Methods */
  Template.goal.events({
    'click .doubt': function() {
      var temp_user_id = Meteor.user()._id;
      var temp_goal_id = this._id;
      Meteor.call('doubtGoal', {
        goal_id : temp_goal_id,
        user_id : temp_user_id
      });
    }
  });
  Template.goal.goal_doubters = function() {
    var doubters = Doubters.find({goal_id: this._id}).fetch()[0];
    if (doubters) {
      return doubters.doubter_list;
    } else {
      return null;
    }
  };
  Template.register.events({
    'submit #register-form' : function(e, t) {
      e.preventDefault();
      var email = t.find('#account-email').value
        , password = t.find('#account-password').value;

      // Trim and validate the input
        var email = trimInput(email);

        if (isValidPassword(password)) {
          Accounts.createUser({email: email, password : password}, function(err){
            if (err) {
              // Inform the user that account creation failed
            } else {
              // Success. Account has been created and the user
              // has logged in successfully. 
            }

          });

          return false;
        } else {
          console.log("fail");
          return false;
        }
    }

  });
  Deps.autorun(function() {
    Meteor.subscribe('users');
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish('users', function() {
    return Meteor.users.find({}, {fields: {points: 1}});
  });

  Accounts.onCreateUser(function(options, user) {
    user.points = 1000;
    // We still want the default hook's 'profile' behavior.
    if (options.profile)
      user.profile = options.profile;
    return user;
  });
}

/* Goals Model */
Goals = new Meteor.Collection('goals');
Doubters = new Meteor.Collection('doubters');
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
    var temp_goal_id = Goals.insert(
      {
      title: options.title,
      description: options.description,
      points_per_person: options.points_per_person,
      creator: options.creator,
      done: false
    });
    Doubters.insert(
      {
      goal_id: temp_goal_id,
      doubter_list: []
    });
  },
  removeAllGoals: function() {
    return Goals.remove({});
  },
  doubtGoal: function(options) {
    var temp_goal_id = options.goal_id;
    var new_doubter = options.user_id;
    return Doubters.update({goal_id: temp_goal_id}, {$push: {doubter_list: new_doubter}});
  }
});

