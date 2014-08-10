
var app = angular.module('app', ['race'])
.config(function($routeProvider) {
  $routeProvider
    .when('/check_in', {
      controller:'RunnerCtrl',
      templateUrl:'check_in.html'
    })
    .when('/timer', {
      controller:'TimerCtrl',
      templateUrl:'timer.html'
    })
    .when('/finish', {
      controller:'FinishCtrl',
      templateUrl:'finish.html'
    })
    .when('/scan', {
      controller:'ScanCtrl',
      templateUrl:'scan.html'
    })
    .when('/ranking', {
      controller:'RankingCtrl',
      templateUrl:'ranking.html'
    })
    .otherwise({
      redirectTo:'/'
    });
});


angular.module('race', ['ngRoute', 'firebase'])
.value('fbURL_runners', 'https://run.firebaseio.com/runners')
.value('fbURL_races', 'https://run.firebaseio.com/races')
.value('fbURL_finishers', 'https://run.firebaseio.com/finishers')

.factory('Runners', function($firebase, fbURL_runners) {
  return $firebase(new Firebase(fbURL_runners)).$asArray() ;
})
.factory('Races', function($firebase, fbURL_races) {
  return $firebase(new Firebase(fbURL_races)).$asArray();
})
.factory('Finishers', function($firebase, fbURL_finishers) {
  return $firebase(new Firebase(fbURL_finishers)).$asArray();
})


 

.filter('race_time', function() {

  findRace = function(input) {
    var time    = false;
    var _start  = false;
    var ref = new Firebase("https://run.firebaseio.com/races"); 
    ref.once('value', function(snap) {
      snap.forEach(function(raceSnap) {
        if (Number(input.km) == Number(raceSnap.val().km)) {
              _start  = new Date(raceSnap.val().start_time );
              _final = new Date(input.time);
              var diff =  _final.getTime()- _start.getTime();
              var msec = diff;
              var hh = Math.floor(msec / 1000 / 60 / 60);
              msec -= hh * 1000 * 60 * 60;
              var mm = Math.floor(msec / 1000 / 60);
              msec -= mm * 1000 * 60;
              var ss = Math.floor(msec / 1000);
              msec -= ss * 1000;
              time = hh.toString()+":"+mm.toString()+":"+ss.toString()+":"+msec.toString();
        }
      })
    });
    return time;
  };
  return function(input) {
    return  findRace(input);    
  };
})


.directive('addRunner', function(){
 return { 
  restrict:'E',
  templateUrl:'detail_runner.html'
 };
})
.directive('listRunners', function(){
 return { 
  restrict:'E',
  templateUrl:'list_runners.html'
 };
})

.controller('RunnerCtrl', function($scope, Runners,Firebase,Races) {
  $scope.runners = Runners;
  this.detailRunner = false;
  this.show_edit = false;
  this.add_new = false;
  $scope.today = new Date() ;
  this.runnersRef = new Firebase('run.firebaseio.com/runners');

  $scope.nbreOfRunners = 0 ;   

  $scope.$watch('runners', function() {
        // do something here
        $scope.nbreOfRunners=$scope.runners.length;
    }, true);

 // $scope.races.forEach(function(raceSnap) {console.log("aa");});


  this.save = function() {
    this.detailRunner.date = new Date( this.detailRunner.date  ).getTime();
    if(this.add_new){
      var newRunner = this.runnersRef.push();
      newRunner.set(this.detailRunner);
      newRunner.setPriority(Number(this.detailRunner.bib));
    }
    else{
      console.log(this.detailRunner);
      var ref = this.runnersRef.child(this.detailRunner.$id);
      //ref.set(this.detailRunner);
      $scope.runners.$save(this.detailRunner);
      ref.setPriority(Number(this.detailRunner.bib));
    }

    this.detailRunner = {};
    this.show_edit    = false;
    this.add_new      = false;
  };
  this.showEdit = function(runner) {

      this.detailRunner = runner;
      this.detailRunner.date = new Date(runner.date);
      this.show_edit = true;
  };

  this.addNew = function() {
    this.add_new = true; 
    this.showEdit({});

  };

  this.hideEdit = function() {
    this.show_edit = false;
    this.detailRunner = false;
    this.add_new = false; 

  };


  this.destroy = function() {
      $scope.runners.$remove(this.detailRunner);
      this.detailRunner = {};
      this.show_edit = false;
            this.add_new = false; 


    };

})

.controller('TimerCtrl', function($scope, Races,Finishers) {
  $scope.races     = Races;
  $scope.finishers = Finishers;


  $scope.$watch('runners', function() {
        // do something here
        $scope.nbreOfFinishers=$scope.finishers.length;
    }, true);

  this.add = function(){
      Races.$add(this.detailRace);
  };

  this.start = function(race) {
      race.start_time = new Date( ).getTime();
      $scope.races.$save(race);

    };
  this.stop = function(race) {
      race.start_time = null;
      $scope.races.$save(race);
    };
  this.remove = function(race) {
      $scope.races.$remove(race);
    };
})

.controller('FinishCtrl', function($scope,Finishers) {
  $scope.finishers = Finishers;
  this.finish = {}
  this.finishersRef = new Firebase('run.firebaseio.com/finishers');

  $scope.$watch('finishers', function() {
        // do something here
        $scope.nbreOfFinishersAssigned = 0; 
        $scope.nbreOfFinishersNotAssigned = 0; 

        $scope.finishers.forEach(function(fi){
          if (fi.$priority>0){
            $scope.nbreOfFinishersNotAssigned ++; 
          }
          else {
            $scope.nbreOfFinishersAssigned ++; 
          }
        });
    }, true);


  this.add = function(){
      var timestamp = new Date().getTime(); 
      this.finish = {time:timestamp, runner:false};

      var newFinish = this.finishersRef.push();
      newFinish.set(this.finish);
      newFinish.setPriority(timestamp);


  };
})

.controller('RankingCtrl', function($scope, Runners,Firebase,Races) {
  $scope.races       = Races;
  $scope.runners     = Runners;

  $scope.categories = [
                    {mindate:new Date(1811,1,1), maxdate:new Date(2911,1,1),name:"senior", km:20} ,
                    {mindate:new Date(1811,1,1), maxdate:new Date(2911,1,1),name:"senior", km:10} 

                ];



})

.filter('categoryFilter', function () {
  return function (items, cat) {
    var filtered = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.km == cat.km && item.date > cat.mindate && item.date<cat.maxdate) {
        filtered.push(item);
      }
    }
    return filtered;

    //
  };
})

.controller('ScanCtrl', function($scope,Finishers,Runners,Firebase) {

  $scope.time = false; 

  this.scan = function(){
      $scope.runner = false; 

      console.log("scanning");
      new Firebase("https://run.firebaseio.com/finishers").startAt(0).limit(1).once('value', function(snap) {
        snap.forEach(function(finisherSnap) {
          console.log("finishers");
          finisherSnap.ref().setPriority( -1 );
          $scope.time=finisherSnap.val().time; 
          console.log($scope.bib);
          new Firebase("https://run.firebaseio.com/runners").startAt(Number($scope.bib) ).endAt(Number($scope.bib) ).once('value', function(snap2) {
            console.log(snap2);
            snap2.forEach(function(runnerSnap) {
              console.log("runner");
              console.log('runner matching bib', runnerSnap.val() );
              console.log('runner matching bib', $scope.bib   );
              console.log('runner matching bib', $scope.time );
              var obj = runnerSnap.val();
              $scope.runner = runnerSnap.val();
              if (obj.time){
                  $scope.runner.comment = " a deja un temps attribue";
              }
              else {
                  obj.time = $scope.time;
                  runnerSnap.ref().update(obj);
                 // runnerSnap.ref().setPriority(Number($scope.bib));
              }
              

            });
          });
        });
    });
$scope.bib = "";
  };
})


;