angular.module('tira.controllers', [])

.controller('RunnerCtrl', function($scope, Runners, Firebase, Races) 
{
  $scope.runners       = Runners;
  this.detailRunner    = false;
  this.show_edit       = false;
  this.add_new         = false;
  $scope.today         = new Date() ;
  this.runnersRef      = new Firebase('run.firebaseio.com/runners');
  $scope.nbreOfRunners = 0 ;   

  $scope.$watch('runners', function() 
  {
  	$scope.nbreOfRunners = $scope.runners.length;
  }, true);

  this.save = function() 
  {
    this.detailRunner.date = new Date( this.detailRunner.date  ).getTime();
    if(this.add_new)
    {
      var newRunner = this.runnersRef.push();
      newRunner.set(this.detailRunner);
      newRunner.setPriority(Number(this.detailRunner.bib));
    }
    else
    {
      var ref = this.runnersRef.child(this.detailRunner.$id);
      //ref.set(this.detailRunner);
      $scope.runners.$save(this.detailRunner);
      ref.setPriority(Number(this.detailRunner.bib));
    }

    this.detailRunner = {};
    this.show_edit    = false;
    this.add_new      = false;
  };
  this.showEdit = function(runner) 
  {
    this.detailRunner 		 = runner;
    this.detailRunner.date = new Date(runner.date);
    this.show_edit 				 = true;
  };

  this.addNew = function() 
  {
    this.add_new = true; 
    this.showEdit({});
  };

  this.hideEdit = function() 
  {
    this.show_edit    = false;
    this.detailRunner = false;
    this.add_new      = false; 
  };

  this.destroy = function() 
  {
      $scope.runners.$remove(this.detailRunner);
      this.detailRunner = {};
      this.show_edit    = false;
      this.add_new      = false; 
  };
})

.controller('TimerCtrl', function($scope, Races,Finishers) 
{
  $scope.races     = Races;
  $scope.finishers = Finishers;
  $scope.$watch('runners', function() 
  {
  	$scope.nbreOfFinishers=$scope.finishers.length;
  }, true);

  this.add = function()
  {
  	Races.$add(this.detailRace);
  };

  this.start = function(race) 
  {
	  race.start_time = new Date( ).getTime();
	  $scope.races.$save(race);
  };
  this.stop = function(race) 
  {
	  race.start_time = null;
	  $scope.races.$save(race);
  };
  this.remove = function(race) 
  {
		$scope.races.$remove(race);
  };
})

.controller('FinishCtrl', function($scope,Finishers) 
{
  $scope.finishers 	= Finishers;
  $scope.today 			= new Date();
  this.finish 			= {}; 
  this.finishersRef = new Firebase('run.firebaseio.com/finishers');

  this.add = function()
  {
	  var timestamp = new Date().getTime(); 
	  this.finish 	= {time:timestamp, runner:false};
	  var newFinish = this.finishersRef.push();
	  newFinish.set(this.finish);
	  newFinish.setPriority(timestamp);
  };

  this.remove = function(notAssi)
  {
    $scope.finishers.$remove(notAssi);
  };
})

.controller('StatsCtrl', function($scope) 
{

})

.controller('RankingCtrl', function($scope, Runners,Firebase,Races) 
{
  $scope.races       = Races;
  $scope.runners     = Runners;
  $scope.categories  = [
			                    {mindate:new Date(1811,1,1), maxdate:new Date(1960,1,1),name:"senior", km:20} ,
			                    {mindate:new Date(1811,1,1), maxdate:new Date(1960,1,1),name:"senior", km:10} ,
			                    {mindate:new Date(1960,1,1), maxdate:new Date(1996,1,1),name:"adulte", km:20} ,
			                    {mindate:new Date(1960,1,1), maxdate:new Date(1996,1,1),name:"adulte", km:10} ,
			                    {mindate:new Date(1996,1,1), maxdate:new Date(2020,1,1),name:"jeune", km:20} ,
			                    {mindate:new Date(1996,1,1), maxdate:new Date(2020,1,1),name:"jeune", km:10} 
                				];
})

.controller('ScanCtrl', function($scope,Finishers,Runners,Firebase) 
{
  $scope.time = false; 

  this.scan = function()
  {
	  $scope.runner = false; 
	  console.log("scanning");
	  new Firebase("https://run.firebaseio.com/finishers").startAt(0).limit(1).once('value', function(snap) 
	  {
	    snap.forEach(function(finisherSnap) 
	    {
	      console.log("finishers");
	      finisherSnap.ref().setPriority( -1 );
	      $scope.time=finisherSnap.val().time; 
	      console.log($scope.bib);
	      new Firebase("https://run.firebaseio.com/runners").startAt(Number($scope.bib) ).endAt(Number($scope.bib) ).once('value', function(snap2) 
	      {
	        console.log(snap2);
					snap2.forEach(function(runnerSnap) 
					{
						console.log("runner");
						console.log('runner matching bib', runnerSnap.val() );
						console.log('runner matching bib', $scope.bib   );
						console.log('runner matching bib', $scope.time );
						var obj = runnerSnap.val();
	          $scope.runner = runnerSnap.val();
	          if (obj.time)
	          {
            	$scope.runner.comment = " a deja un temps attribue";
	          }
	          else 
	          {
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
