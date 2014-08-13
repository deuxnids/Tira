
var app = angular.module('tira', ['ngRoute',
                                  'firebase',
                                  'tira.filters'    ,
                                  'tira.controllers',
                                  'tira.directives' , 
                                  'tira.factories'   ])
.config(function($routeProvider) {
  $routeProvider
    .when('/check_in', {
      //controller:'RunnerCtrl',
      templateUrl:'html/check_in.html'
    })
    .when('/timer', {
     // controller:'TimerCtrl',
      templateUrl:'html/timer.html'
    })
    .when('/finish', {
     // controller:'FinishCtrl',
      templateUrl:'html/finish.html'
    })
    .when('/scan', {
     // controller:'ScanCtrl',
      templateUrl:'html/scan.html'
    })
    .when('/ranking', {
    //  controller:'RankingCtrl',
      templateUrl:'html/ranking.html'
    })
    .when('/stats', {
     // controller:'StatsCtrl',
      templateUrl:'html/stats.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})
.value('fbURL_runners', 'https://run.firebaseio.com/runners')
.value('fbURL_races', 'https://run.firebaseio.com/races')
.value('fbURL_finishers', 'https://run.firebaseio.com/finishers')
;