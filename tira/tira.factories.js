angular.module('tira.factories', [])

.factory('Runners', function($firebase, fbURL_runners) {
  return $firebase(new Firebase(fbURL_runners)).$asArray() ;
})
.factory('Races', function($firebase, fbURL_races) {
  return $firebase(new Firebase(fbURL_races)).$asArray();
})
.factory('Finishers', function($firebase, fbURL_finishers) {
  return $firebase(new Firebase(fbURL_finishers)).$asArray();
});