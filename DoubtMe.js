if (Meteor.isClient) {
  Session.set('showCreateDialog', false);

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

