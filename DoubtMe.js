if (Meteor.isClient) {
  Session.set("errorMessage", "");
  Template.err.errMessage = function() {
    return Session.get("errorMessage");
  }
  Template.forms.showErrMessage = function() {
    return Boolean(Session.get("errorMessage"));
  }
  Template.err.events({
    'click .cancel': function() {
      Session.set("errorMessage", "");
    }
  })
  /* Events */
  Template.nav.greeting = function () {
    if (Meteor.user())
      return Meteor.user().emails[0].address + "\n" + Meteor.user().points;
  };
  Template.nav.greeting2 = function () {
    if (Meteor.user())
      return Meteor.user().points;
  };
  var isValidPassword = function(val) {
    return (val.length >= 6) ? true : false;
  }
  var trimInput = function(val) {
    return val.replace(/^\s*|\s*$/g, "");
  }

  Template.feed.showButtons = function() {
    return Boolean(Meteor.user());
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
          Session.set("errorMessage", "Login Failed");
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
    },
    'submit #login-form2' : function(e, t){
      e.preventDefault();
      // retrieve the input field values
      var email = t.find('#login-email2').value
        , password = t.find('#login-password2').value;
      console.log("call");
      var email = trimInput(email);

      // Trim and validate your fields here....

      // If validation passes, supply the appropriate fields to the
      // Meteor.loginWithPassword() function.
      Meteor.loginWithPassword(email, password, function(err){
        if (err) {
          Session.set("errorMessage", "Login Failed");
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
    },

    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
  Template.showLeaderboard.allUsers = function() {
    return Meteor.users.find({}, {sort: {points: -1}}).fetch();
  };
  Template.showLeaderboard.events({
    'click .cancel': function(){
      Session.set("showLeaderboardModal", false);
    }
  });

  Template.user.email_address = function(){
    return Meteor.users.find({_id: this._id}).fetch()[0].emails[0].address.split("@")[0];
    //return Meteor.users.find({_id: this._id}).fetch().emails[0].address;
  };
  Template.feed.events({
    'click .add_goal': function() {
      Session.set("showCreateDialog", true);
    },
    'click .show_leaderboard': function() {
      Session.set("showLeaderboardModal", true);
    },
    'click .logout': function() {
      console.log("logout");
      Meteor.logout();
    },
  });
  /* Create Challenge Method */
  Template.challengeCreate.opponentEmail = function() {
    var opponent_id = Session.get("challenger_id");
    var opponent = Meteor.users.find({_id: opponent_id});
    return opponent.fetch()[0].emails[0].address;
  };
  Template.challengeCreate.events({
    'click .cancel1': function(){
      Session.set("showChallengeCreate", false);
    },
    'click .save': function(event, template){
      var title = template.find(".title").value;
      var description = template.find(".description").value;
      var points_per_person = template.find(".points_per_person").value;
      var oppo_id = Session.get("challenger_id");
      if (title.length && description.length && points_per_person) {
        Meteor.call('createCompetition', {
          title: title,
          description: description,
          points_per_person: points_per_person,
          person_1: Meteor.userId(),
          person_2: oppo_id
        });
        Session.set("showChallengeCreate",false);
      } else {
        Session.set("createError",
                    "It needs a title and a description, or why bother?");
      }
    },

  });
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
          creator: Meteor.user() ? Meteor.user().emails[0].address.split("@")[0] : 'Stranger'
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
  Template.feed.showLeaderboardModal = function() {
    return Boolean(Session.get("showLeaderboardModal"));
  };
  Template.feed.showChallengeCreate = function() {
    return Boolean(Session.get("showChallengeCreate"));
  };
  Template.goal.showPayButtons = function() {
    return Meteor.user()._id == this.goal_owner;
  };
  Template.goal.winning = function() {
    var two = Doubters.find({goal_id: this._id}).fetch()[0].believe2.length;
    var one = Doubters.find({goal_id: this._id}).fetch()[0].believe1.length;
    if (one == 0 && two == 0) return 50;
    var percent = (((one*1.0) / (one+two))*100).toFixed(0);
    return percent; 
  };
  Template.goal.showCompPayButtons = function(){
    return (Meteor.user()._id == this.person1 || Meteor.user()._id == this.person2);
  };
  Template.goal.email_1 = function(){
    setTimeout(1);
    var temp = Meteor.users.find({_id: String(this.person1)}).fetch()[0];
    if (!temp) return '';
    return temp.emails[0].address.split("@")[0];
  };
  Template.goal.email_2 = function(){
    var temp = Meteor.users.find({_id: this.person2}).fetch()[0];
    if (!temp) return'';
    return temp.emails[0].address.split("@")[0];
  };
  /* User Event */
  Template.user.events({
    'click .challenge':function(){
      Session.set("showChallengeCreate", true);
      Session.set("challenger_id", this._id);
      Session.set("showLeaderboardModal", false);
    }
  });
  /* Goal Methods */
  Template.goal.events({
    'click .doubt': function() {
      var temp_user_id = Meteor.user()._id;
      var doubter_list = Doubters.find({goal_id: this._id}).fetch()[0].doubter_list;
      if (doubter_list.indexOf(temp_user_id) == -1) {
        Meteor.call('doubtGoal', {
          goal_id : this._id,
          user_id : temp_user_id
        });
      } else {
        alert("You've already doubted this!");
      }
    },
    'click .success': function() {
      var temp_user_id = Meteor.user()._id;
      var temp_doubter_list = Doubters.find({goal_id: this._id}).fetch()[0].doubter_list;
      Meteor.call('payPeople', {
        doubter_list: temp_doubter_list,
        points_per_person: this.points_per_person,
        goal_owner: this.goal_owner,
        success: true,
        goal_id: this._id
      });
    },
    'click .failure': function() {
      var temp_user_id = Meteor.user()._id;
      var temp_doubter_list = Doubters.find({goal_id: this._id}).fetch()[0].doubter_list;
      Meteor.call('payPeople', {
        doubter_list: temp_doubter_list,
        points_per_person: this.points_per_person,
        goal_owner: this.goal_owner,
        success: false,
        goal_id: this._id
      });
    },
    'click .play1': function() {
      var bad_doubters = Doubters.find({goal_id: this._id}).fetch()[0].believe2;
      var good_doubters = Doubters.find({goal_id: this._id}).fetch()[0].believe1;
      Meteor.call('payPeople', {
        doubter_list: bad_doubters,
        points_per_person: this.points_per_person,
        goal_owner: this.person1,
        success: true,
        goal_id: this._id
      });
      Meteor.call('payPeople', {
        doubter_list: good_doubters,
        points_per_person: this.points_per_person,
        goal_owner: this.person2,
        success: false,
        goal_id: this._id
      });
    },
    'click .play2': function() {
      var bad_doubters = Doubters.find({goal_id: this._id}).fetch()[0].believe1;
      var good_doubters = Doubters.find({goal_id: this._id}).fetch()[0].believe2;
      Meteor.call('payPeople', {
        doubter_list: bad_doubters,
        points_per_person: this.points_per_person,
        goal_owner: this.person2,
        success: true,
        goal_id: this._id
      });
      Meteor.call('payPeople', {
        doubter_list: good_doubters,
        points_per_person: this.points_per_person,
        goal_owner: this.person1,
        success: false,
        goal_id: this._id
      });
    },
    'click .believe1': function(){
      var temp_user_id = Meteor.user()._id;
      var believe_list1 = Doubters.find({goal_id: this._id}).fetch()[0].believe1;
      var believe_list2 = Doubters.find({goal_id: this._id}).fetch()[0].believe2;
      var believe_list = believe_list1.concat(believe_list2);
      if (believe_list.indexOf(temp_user_id) == -1) {
        Meteor.call('comp_believe1', {
          goal_id: this._id,
          user_id: temp_user_id
        });
      } else {
        alert("You can only vote once!");
      }
    },
    'click .believe2': function(){
      var temp_user_id = Meteor.user()._id;
      var believe_list1 = Doubters.find({goal_id: this._id}).fetch()[0].believe1;
      var believe_list2 = Doubters.find({goal_id: this._id}).fetch()[0].believe2;
      var believe_list = believe_list1.concat(believe_list2);
      if (believe_list.indexOf(temp_user_id) == -1) {
        Meteor.call('comp_believe2', {
          goal_id: this._id,
          user_id: temp_user_id
        });
      } else {
        alert("You can only vote once!");
      }
    },
  });

  Template.goal.goal_doubters = function() {
    var doubters = Doubters.find({goal_id: this._id}).fetch()[0];
    if (doubters) {
      return doubters.doubter_list;
    } else {
      return null;
    }
  };

  Template.goal.believers1 = function() {
    var doubters = Doubters.find({goal_id: this._id}).fetch()[0];
    if (doubters) {
      return doubters.believe1.length;
    } else {
      return 0;
    }
  };
  Template.goal.believers2 = function() {
    var doubters = Doubters.find({goal_id: this._id}).fetch()[0];
    if (doubters) {
      return doubters.believe2.length;
    } else {
      return 0;
    }
  };
  Template.forms.showForms = function () {
    return Boolean(!Meteor.user());
  };
  Template.register.events({
    'submit #register-form' : function(e, t) {
      e.preventDefault();
      var email = t.find('#account-email').value
        , password = t.find('#account-password').value;

      // Trim and validate the input
        email = trimInput(email);

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
          Session.set('errorMessage', 'Password is too short')
          return false; 
          console.log("fail");
          return false;
        }
    },
    'submit #register-form2' : function(e, t) {
      e.preventDefault();
      var email = t.find('#account-email2').value
        , password = t.find('#account-password2').value;

      // Trim and validate the input
        email = trimInput(email);

        if (isValidPassword(password)) {
          Accounts.createUser({email: email, password : password}, function(err){
            if (err) {
              console.log("reg")
              // Inform the user that account creation failed
            } else {
              console.log("reg");
              // Success. Account has been created and the user
              // has logged in successfully.
            }

          });

          return false;
        } else {
          Session.set('errorMessage', 'Password is too short')
          return false; 
          console.log("fail");
          return false;
        }
    },

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
    return Meteor.users.find({}, {fields: {points: 1, emails: 1}});
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
      accepted: true,
      title: options.title,
      description: options.description,
      points_per_person: options.points_per_person,
      creator: options.creator,
      done: false,
      goal_owner: Meteor.user()._id
    });
    Doubters.insert(
      {
      goal_id: temp_goal_id,
      doubter_list: []
    });
  },
  createCompetition: function(options) {
    var temp_goal_id = Goals.insert(
      {
      accepted: true,
      title: options.title,
      description: options.description,
      points_per_person: options.points_per_person,
      person1: options.person_1,
      person2: options.person_2,
      competition: true
    });
    Doubters.insert(
      {
      goal_id: temp_goal_id,
      believe1: [],
      believe2: []
    });
  },
  removeAllGoals: function() {
    return Goals.remove({});
  },
  doubtGoal: function(options) {
    var temp_goal_id = options.goal_id;
    var new_doubter = options.user_id;
    return Doubters.update({goal_id: temp_goal_id}, {$push: {doubter_list: new_doubter}});
  },
  comp_believe1: function(options){
    var temp_goal_id = options.goal_id;
    var new_believer = options.user_id;
    return Doubters.update({goal_id: temp_goal_id}, {$push: {believe1: new_believer}});
  },
  comp_believe2: function(options){
    var temp_goal_id = options.goal_id;
    var new_believer = options.user_id;
    return Doubters.update({goal_id: temp_goal_id}, {$push: {believe2: new_believer}});
  },

  payPeople : function(options) {
    var to_be_paid = options.doubter_list;
    var temp_goal_id = options.goal_id;
    var increment_value = parseInt(options.points_per_person);
    var decrement_value = -1* increment_value;
    var big_increment = increment_value * to_be_paid.length;
    var big_decrement = decrement_value * to_be_paid.length;
    var goal_owner = options.goal_owner;
    var success = options.success;
    console.log(to_be_paid, increment_value, goal_owner, success);
    if (!success) {
      for (var user_id in to_be_paid) {
        Meteor.users.update({_id: to_be_paid[user_id]}, {$inc: {points: increment_value}});
      }
      Meteor.users.update({_id: goal_owner}, {$inc: {points: big_decrement}});
    } else {
      for (var user_id in to_be_paid) {
        Meteor.users.update({_id: to_be_paid[user_id]}, {$inc: {points: decrement_value}});
      }
      Meteor.users.update({_id: goal_owner}, {$inc: {points: big_increment}});
    }
  }
});

