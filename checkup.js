function drawChart() {
  // 5 charts

  // TPS
  // --
  // Heart rate
  // Skin 
  // Temperature

  // OpenBCI
  // --
  // Occipital
  // Frontal

  var heartData = {
    labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    datasets: [
        {
            label: "Heart rate",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]
};

  var ctx = $('#heartChart').get(0).getContext("2d");
  var heartChart = new Chart(ctx).Line(heartData);
  

var skinData = {
    labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    datasets: [
        {
            label: "Skin conductance",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]
};

  var ctx = $('#skinChart').get(0).getContext("2d");
  var skinChart = new Chart(ctx).Line(skinData);

var tempData = {
    labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    datasets: [
        {
            label: "Temperature",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]
};

  var ctx = $('#tempChart').get(0).getContext("2d");
  var tempChart = new Chart(ctx).Line(tempData);


var occipitalData = {
    labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    datasets: [
        {
            label: "Occipital",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]
};

  var ctx = $('#occipitalChart').get(0).getContext("2d");
  var occipitalChart = new Chart(ctx).Line(occipitalData);
  
  var frontalData = {
    labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    datasets: [
        {
            label: "Frontal",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]
};

  var ctx = $('#frontalChart').get(0).getContext("2d");
  var frontalChart = new Chart(ctx).Line(frontalData);
}

function updateChart() {
  console.log(heartChart.datasets[0]);
}

OpenBCI = new Mongo.Collection("openbci");
TPS = new Mongo.Collection("tps");

Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound'
});

Iron.Router.hooks.isLoggedin = function() {
  if (!Meteor.userId()) {
    this.render('login');
  } else {
    return this.next();
  }
};

Router.route('/api/openbci', function() {
    var request = this.request;
    var response = this.response;

    // var valueToSplit = this.request.headers.openbci;
    // var arrayOfValues = valueToSplit.split(" ");

    // Parse the OpenBCI string.
    // OpenBCI.insert({
     // occipital_waves: arrayOfValues[0],
     // frontal_waves: arrayOfValues[1]
    // });

    response.end('hello');
}, {where: 'server'});

Router.route('/api/tps', function() {
    var request = this.request;
    var response = this.response;

    var valueToSplit = this.request.headers.tps;
    var arrayOfValues = valueToSplit.split(" ");

    TPS.insert({
      skin_conductance: arrayOfValues[0],
      heart_rate: arrayOfValues[1],
      temperature: arrayOfValues[2]
    });

    response.end(request.headers.test);
}, {where: 'server'});


if (Meteor.isClient) {


  Deps.autorun(function() {
    Meteor.subscribe('openbci', function() {
      console.log('subscribe');
    });
  });

  Router.route('/', {
    name: 'index',
    action: function() {
      this.render();
    }
  });

  Router.route('/login', {
    name: 'login',
    action: function() {
      this.render();
    }
  });

  Router.route('/register', {
    name: 'register',
    action: function() {
      this.render();
    }
  });

  Router.route('/contact', {
    name: 'contact',
    action: function() {
      this.render();
    }
  });

  Router.route('/dashboard', {
    name: 'dashboard',
    waitOn: function() {
      return [
        Meteor.subscribe('openbci'),
        Meteor.subscribe('tps')
      ]
    },
    data: function() {
      return {
        openbci: OpenBCI.find().fetch().reverse(),
        tps: TPS.find().fetch().reverse()
      }
    },
    action: function() {
      this.render();
    }
  });

  Template.register.events({
    'submit #register-form': function(e, t) {
      e.preventDefault();
    
      var email = t.find('#register-email').value
        , password = t.find('#register-password').value;

      Accounts.createUser({
        email: email,
        password: password 
      }, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('success in registration');
          Router.go('/dashboard');
        }
      });
      return false;
    }
  });
  
  Template.login.events({
    'submit #login-form': function(e, t) {
      e.preventDefault();

      var email = t.find('#login-email').value
        , password = t.find('#login-password').value;

      // Check values...

      Meteor.loginWithPassword(email, password, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('logged in.');
          Router.go('/dashboard'); // Go back to the dashboard.
        }
      });
      return false;
    }
  });

  Template.layout.events({
    'click a#logout': function(e, t) {
      Meteor.logout(function() {
        Router.go('/');
      });
    }
  });
 
  Template.dashboard.rendered = function() {
   Deps.autorun(function () { 
    drawChart(); 
   });
  };

  Template.dashboard.helpers({
    tps1: function() {
      return Session.get('tps1');
    }
  });
}

if (Meteor.isServer) {
 TPS.find().observeChanges({
    added: function(id, doc) {
      console.log(doc);
    }
  });

  OpenBCI.find().observeChanges({
    added: function(id, doc) {
      console.log(doc);
    }
  });


  Meteor.startup(function () {
    // code to run on server at startup
  });
}