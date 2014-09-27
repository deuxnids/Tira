
var app = angular.module('tira', ['ngRoute',
                                  'firebase','xeditable',
                                  'tira.filters'    ,
                                  'tira.controllers',
                                  'tira.directives' , 
                                  'tira.factories'  ,
                                  'smart-table',
                                  'mobile-angular-ui'  ])

.config(function($routeProvider) {
  $routeProvider
    .when('/check_in', {
      //controller:'RunnerCtrl',
      templateUrl:'html/check_in.html'
    })
    .when('/login', {
      //controller:'RunnerCtrl',
      templateUrl:'html/login.html'
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
      templateUrl:'html/home.html'
    });
})
.value('fbURL_runners', 'https://run.firebaseio.com/runners')
.value('fbURL_races', 'https://run.firebaseio.com/races')
.value('fbURL_finishers', 'https://run.firebaseio.com/finishers')
.value('cats', [
                          {mindate:new Date(1811,1,1), maxdate:new Date(1960,1,1),name:"senior", km:20} ,
                          {mindate:new Date(1811,1,1), maxdate:new Date(1960,1,1),name:"senior", km:10} ,
                          {mindate:new Date(1960,1,1), maxdate:new Date(1996,1,1),name:"adulte", km:20} ,
                          {mindate:new Date(1960,1,1), maxdate:new Date(1996,1,1),name:"adulte", km:10} ,
                          {mindate:new Date(1996,1,1), maxdate:new Date(2020,1,1),name:"jeune", km:20} ,
                          {mindate:new Date(1996,1,1), maxdate:new Date(2020,1,1),name:"jeune", km:10} 
                        ])
;

var myRef       = new Firebase("https://run.firebaseio.com");