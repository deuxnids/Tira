angular.module('tira.controllers', ['smart-table'])


.controller('UserCtrl', function($scope, Firebase,AuthService) 
{
  $scope.AuthService = AuthService;
})

.controller('RunnerCtrl', function($scope, Runners, Firebase, Races,SyncFb,$filter,$rootScope,cats,AuthService,BibValidation) 
{
  $scope.runners       = Runners;
  $scope.today         = new Date() ;
  $scope.nbreOfRunners = 0 ;   
  $scope.totalAmount = 0 ;   
  this.show_doubloons = false;
  $scope.categories    = cats;
  this.detailRunner    = false;
  this.show_edit       = false;
  this.show_import     = false;
  $scope.json_import_file = {};

  this.add_new         = false;
  this.runnersRef      = new Firebase('run.firebaseio.com/runners');
  $scope.AuthService   = AuthService;

  $scope.$watch('runners', function() 
  {
  	$scope.nbreOfRunners = $scope.runners.length;
    $scope.totalAmount = 0; 
    $scope.runners.forEach(function(runner){
        $scope.totalAmount += runner.amount;
    });

  }, true);

  $scope.addRunners = function($fileContent, runCtrl){
    $scope.content = angular.fromJson( $fileContent);
    $scope.content.forEach(function(runner)
    {

      for (var name in runner) {
          if (runner.hasOwnProperty(name) && name[0]=="$") {
            delete runner[name];
          }
      }

      runCtrl.detailRunner = runner;
      runCtrl.add_new=true;
      runCtrl.save();
    });
  };

this.deleteAll = function(){
var ctrl = this;
if (confirm("You are going to delete ALL runners! Sure?") == true) {
    $scope.runners.forEach(function(runner){
        ctrl.detailRunner=runner;
        console.log(ctrl.detailRunner);

        ctrl.destroy();
    });
    } else {
    }
};

  this.importJson = function(){
 $rootScope.toggle('overlay_import', 'on');

  };

  this.exportJson = function(){
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify($scope.runners));
    var date = new Date();
    var name = "runners_"+date.toString();

    $('<a href="data:' + data + '" download="'+name+'.json">download JSON</a>').appendTo('#dowloadJson');
    // window.location.href="data:" + data + " download=runners.json" ;
    // window.location.download="runners.json" ;

  };



  this.print = function(file){
    console.log(file);
  };

  this.save = function() 
  {
    var error = {};
    //bib_exists = $filter('bibFilter')(this.detailRunner.bib);

    var validBib =  BibValidation.validateBib( $scope.runners , this.detailRunner.$id, this.detailRunner.bib);
    if (validBib){
    if(this.add_new )
    {
      var newRunner = this.runnersRef.push();
      newRunner.set(this.detailRunner);
      newRunner.setPriority(Number(this.detailRunner.bib));
    }
    else    
    {
      var ref = this.runnersRef.child(this.detailRunner.$id);
      $scope.runners.$save(this.detailRunner);
      ref.setPriority(Number(this.detailRunner.bib) );
    }
    }
    this.detailRunner = {};
    this.show_edit    = false;
    this.add_new      = false;
    $rootScope.toggle('overlay1', 'off');
  };

  this.showEdit = function(runner) 
  {
    this.detailRunner 		 = runner;
    this.show_edit 				   = true;
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
    $scope.detailRunner = {};
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
    console.log("add");
    var timestamp = new Date(); 
    this.detailRace.start_time = timestamp.toISOString();
  	Races.$add(this.detailRace);//.then(SyncFb.alert);
  };

  this.save = function(race) 
  {
    console.log(race);
	  $scope.races.$save(race);//.then(SyncFb.alert);
  };

  this.remove = function(race) 
  {
		$scope.races.$remove(race);//.then(SyncFb.alert);
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
	  newFinish.set(this.finish);
	  newFinish.setPriority(timestamp.getTime());
  };

  this.remove = function(notAssi)
  {
    console.log(notAssi);
    $scope.finishers.$remove(notAssi);//.then(SyncFb.alert);
  };
})

.controller('StatsCtrl', function($scope) 
{

})

.controller('RankingCtrl', function($scope, Runners,Firebase,Races,$filter,cats) 
{
  $scope.races       = Races;
  $scope.runners     = Runners;
  $scope.categories  = cats;
                        console.log(cats);

  this.print = function()
  {





    var content = [
        { text: 'Marchethon 2014', style: 'header' },

       // { text: [ 'Catégorie: KF2' ], color: 'black', italics: true },
       // { style: 'tableExample',table: { headerRows: 1,body: res_body} },      
        ]

    $scope.categories.forEach(function(cat) {
        content.push({ text: [ 'Catégorie: '+cat.km+" km "+cat.name+"\n" ], color: 'black', italics: true ,pageBreak: 'before'} );


        var res_body = [
                [{ text: 'Rang', style: 'rank' }, 
                  { text: 'Nom, Prénom', style: 'name' }, 
                  { text: 'Temps', style: 'time' }]    
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
              time = "no time";
          }
          else
          {
            time = $filter('race_time')(runner, cat.km);
          }

        var runner_res = [{ text: rank.toString()       }, 
                          { text: runner.lastName+" "+runner.firstName}, 
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

    logo: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10],
      alignment: 'right'
    },


		subheader: {
			fontSize: 16,
			bold: true,
			margin: [0, 10, 0, 5]
		},
		tableExample: {
			margin: [0, 5, 0, 5],

		},

    rank: {
            bold: true,
      fontSize: 13,
      color: 'black',
      margin: [10, 5, 10, 5],
      alignment:'left'
    },
    name:{
            bold: true,
      fontSize: 13,
      color: 'black',
      margin: [60, 5, 60, 5]
    },
        time:{
                bold: true,
      fontSize: 13,
      color: 'black',
      margin: [10, 5, 30, 5]
    },
	},
	defaultStyle: {
		// alignment: 'justify'
	}
	
}
 		pdfMake.createPdf(dd).download('results.pdf');
  }
})

.controller('ScanCtrl', function($scope,Finishers,Runners,Firebase,SyncFb,$filter) 
{
  $scope.time = false; 
  $scope.finishers  = Finishers;
  $scope.showList     = true;
  $scope.showDetail   = false;
  $scope.finishersRef      = new Firebase('run.firebaseio.com/finishers');

  // $('#reader').html5_qrcode(
  //   function(data)
  //   {
  //     $('#read').html(data);
  //     $scope.bib = data;
  //     console.log(data);
  //     var notAssi = $filter('assignedFilter')($scope.finishers);
  //     var last = $filter("orderBy")( notAssi , 'time')[0] ;
      
  //       $scope.Scan.assign(last);
 
  //   },
  //   function(error)
  //   {
  //     $('#read_error').html(error);
  //     console.log(error);
  //   }, 
  //   function(videoError)
  //   {
  //     $('#vid_error').html(videoError);
  //     console.log(videoError);
  //   }
  // );

  this.edit = function(finisher)
  {
    $scope.showList     = false;
    $scope.showDetail   = true;
    $scope.finisher     = finisher;
  }


  this.showList = function()
  {
    $scope.showList     = true;
    $scope.showDetail   = false;
    $scope.bib = {}
  }

  this.assignLast = function(){
    var notAssi = $filter('assignedFilter')($scope.finishers);
    var last = $filter("orderBy")( notAssi , 'time')[0] ;    
    $scope.Scan.assign(last);
  }

  this.assign = function(finisher)
  {
    $scope.finisher = finisher;
    $scope.runner   = false; 
    new Firebase("https://run.firebaseio.com/runners").startAt(Number($scope.bib) )
                                                      .endAt(Number($scope.bib) )
                                                      .once('value', function(runnerSnaps) 
    {
      runnerSnaps.forEach(function(runnerSnap) 
      {
        $scope.runner = runnerSnap.val();
        console.log('runner matching bib ', $scope.runner.bib );
        //if (obj.time == ""  || obj.time == undefined  )
       // {
        $scope.runner.time = $scope.finisher.time;
        runnerSnap.ref().update($scope.runner);
        //finisherSnap.ref().setPriority( -1,SyncFb.alert );

        var refFinisher = $scope.finishersRef.child($scope.finisher.$id);
        refFinisher.setPriority(-1);
        refFinisher.update({bib_runner:$scope.runner.bib} );


        $scope.showDetail = false;
        $scope.showList   = true;
        $scope.bib        ={};   
      });
    });
  };
});
