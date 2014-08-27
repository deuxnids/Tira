angular.module('tira.directives', [])


.directive('addRunner', function(){
 return { 
  restrict:'E',
  templateUrl:'html/detail_runner.html'
 };
})
.directive('listRunners', function(){
 return { 
  restrict:'E',
  templateUrl:'html/list_runners.html'
 };
})
.directive('detailFinisher', function(){
 return { 
  restrict:'E',
  templateUrl:'html/detail_finisher.html'
 };
});