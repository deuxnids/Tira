angular.module('tira.controllers', ['smart-table'])

.controller('RunnerCtrl', function($scope, Runners, Firebase, Races,SyncFb,$filter,$rootScope) 
{
  $scope.runners       = Runners;
  $scope.today         = new Date() ;
  $scope.nbreOfRunners = 0 ;   
  this.detailRunner    = false;
  this.show_edit       = false;
  this.add_new         = false;
  this.runnersRef      = new Firebase('run.firebaseio.com/runners');


  $scope.$watch('runners', function() 
  {
  	$scope.nbreOfRunners = $scope.runners.length;
  }, true);

  this.save = function() 
  {
    //this.detailRunner.date = new Date( this.detailRunner.date  ).getTime();
    if(this.add_new)
    {
      var newRunner = this.runnersRef.push();
      newRunner.set(this.detailRunner, SyncFb.alert);
      newRunner.setPriority(Number(this.detailRunner.bib));
    }
    else
    {
      var ref = this.runnersRef.child(this.detailRunner.$id);

      $scope.runners.$save(this.detailRunner);


      ref.setPriority(Number(this.detailRunner.bib) );
    }

    this.detailRunner = {};
    this.show_edit    = false;
    this.add_new      = false;
  };

  this.showEdit = function(runner) 
  {
    this.detailRunner 		 = runner;
   // console.log(runner.date);
   // this.detailRunner.date = new Date( runner.date  );
    this.show_edit 				 = true;
    $rootScope.toggle('overlay1', 'on');
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
		var ref = this.runnersRef.child(this.detailRunner.$id);
		ref.remove(SyncFb.alert);
    this.detailRunner = {};
    this.show_edit    = false;
    this.add_new      = false; 
  };

})

.controller('TimerCtrl', function($scope, Races,Finishers,SyncFb) 
{
  $scope.races     = Races;
  $scope.finishers = Finishers;

  $scope.$watch('runners', function() 
  {
  	$scope.nbreOfFinishers=$scope.finishers.length;
  }, true);

  this.add = function()
  {
  	Races.$add(this.detailRace).then(SyncFb.alert);
  };

  this.start = function(race) 
  {
	  race.start_time = new Date( ).getTime();
	  $scope.races.$save(race).then(SyncFb.alert);
  };
  this.stop = function(race) 
  {
	  race.start_time = null;
	  $scope.races.$save(race).then(SyncFb.alert);
  };
  this.remove = function(race) 
  {
		$scope.races.$remove(race).then(SyncFb.alert);
  };
})






.controller('FinishCtrl', function($scope,Finishers,SyncFb) 
{
  $scope.finishers 	= Finishers;
  $scope.today 			= new Date();
  this.finish 			= {}; 
  this.finishersRef = new Firebase('run.firebaseio.com/finishers');

  this.add = function()
  {
	  var timestamp = new Date(); 
	  this.finish 	= {time:timestamp.toISOString(), runner:false};
	  var newFinish = this.finishersRef.push();
	  newFinish.set(this.finish,SyncFb.alert);
	  newFinish.setPriority(timestamp.getTime());
  };

  this.remove = function(notAssi)
  {
    $scope.finishers.$remove(notAssi).then(SyncFb.alert);
  };
})

.controller('StatsCtrl', function($scope) 
{

})

.controller('RankingCtrl', function($scope, Runners,Firebase,Races,$filter) 
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

  this.print = function()
  {





    var content = [
        { text: 'Marchethon 2014', style: 'header' },
       // { text: [ 'Catégorie: KF2' ], color: 'black', italics: true },
       // { style: 'tableExample',table: { headerRows: 1,body: res_body} },      
        ]

    $scope.categories.forEach(function(cat) {
        content.push({ text: [ 'Catégorie: '+cat.km+" km "+cat.name ], color: 'black', italics: true } );
        var res_body = [
                [{ text: 'Rang', style: 'tableHeader' }, 
                  { text: 'Nom,Prénom', style: 'tableHeader' }, 
                  { text: 'Temps', style: 'tableHeader' }]    
            ];
        var res = $filter('categoryFilter')($scope.runners, cat);
        res = $filter('orderBy')(res, 'time') ;
        var rank = 0;
        res.forEach(function(runner)
        {
          rank = rank + 1; 
          var time ;
          if (runner.time == undefined)
          {
              time = "DNS";
          }
          else
          {
            time = $filter('race_time')(runner, cat.km);
          }

        var runner_res = [{ text: rank.toString()       }, 
                          { text: runner.lastName}, 
                          { text: time   }];
        res_body.push(runner_res);
        });
      content.push( { style: 'tableExample',table: { headerRows: 1,body: res_body} });

    });

  	var docDefinition = { content: 'This is an sample PDF printed with pdfMake' };

  	var dd = {
	content: content,
	styles: {
		header: {
			fontSize: 18,
			bold: true,
			margin: [0, 0, 0, 10]
		},
		subheader: {
			fontSize: 16,
			bold: true,
			margin: [0, 10, 0, 5]
		},
		tableExample: {
			margin: [0, 5, 0, 15]
		},
		tableHeader: {
			bold: true,
			fontSize: 13,
			color: 'black',
			margin: [10, 10, 30, 10]

		}
	},
	defaultStyle: {
		// alignment: 'justify'
	}
	
}
 		pdfMake.createPdf(dd).download('results.pdf');
  }
})

.controller('ScanCtrl', function($scope,Finishers,Runners,Firebase,SyncFb) 
{
  $scope.time = false; 
  $scope.finishers  = Finishers;
  $scope.showList     = true;
  $scope.showDetail   = false;
  $scope.finishersRef      = new Firebase('run.firebaseio.com/finishers');




  this.edit = function(finisher)
  {
    $scope.showList     = false;
    $scope.showDetail   = true;
    $scope.finisher     = finisher;
  }

  this.assign = function(finisher)
  {
    $scope.finisher = finisher;
    $scope.runner = false; 
    new Firebase("https://run.firebaseio.com/runners").startAt(Number($scope.bib) )
                                                      .endAt(Number($scope.bib) )
                                                      .once('value', function(snap2) 
    {
      snap2.forEach(function(runnerSnap) 
      {

        var obj = runnerSnap.val();
        console.log('runner matching bib time', obj.time );
        $scope.runner = runnerSnap.val();
        if (obj.time == ""  || obj.time == undefined  )
        {
          obj.time = $scope.finisher.time;
          runnerSnap.ref().update(obj,SyncFb.alert);
          //finisherSnap.ref().setPriority( -1,SyncFb.alert );

          var ref = $scope.finishersRef.child($scope.finisher.$id);
          ref.setPriority(-1, SyncFb.alert );

  $scope.showDetail = false;
  $scope.showList = true;

        }
        else 
        {
          SyncFb.alert(" a deja un temps attribue");
        }
                
      });
    });
  };


  this.scan = function()
  {
	  $scope.runner = false; 
	  //console.log("scanning");
	  new Firebase("https://run.firebaseio.com/finishers").startAt(0).limit(1).once('value', function(snap) 
	  {
	    snap.forEach(function(finisherSnap) 
	    {
	      console.log("finishers");
	      $scope.time=finisherSnap.val().time; 
	      //console.log($scope.bib);
	      new Firebase("https://run.firebaseio.com/runners").startAt(Number($scope.bib) ).endAt(Number($scope.bib) ).once('value', function(snap2) 
	      {
	        console.log(snap2);
					snap2.forEach(function(runnerSnap) 
					{
						//console.log("runner");
						//console.log('runner matching bib', runnerSnap.val() );
						//console.log('runner matching bib', $scope.bib   );
						var obj = runnerSnap.val();
            console.log('runner matching bib time', obj.time );

	          $scope.runner = runnerSnap.val();
	          if (obj.time == ""  || obj.time == undefined  )
	          {
              obj.time = $scope.time;
              runnerSnap.ref().update(obj,SyncFb.alert);
              finisherSnap.ref().setPriority( -1,SyncFb.alert );
              console.log("AAAA");
              //runnerSnap.ref().setPriority(Number($scope.bib));
	          }
	          else 
	          {
              //$scope.runner.comment = " a deja un temps attribue";
              SyncFb.alert(" a deja un temps attribue");
	          }
	          
          });
        });
      });
    });
		$scope.bib = "";
  };
})



;
