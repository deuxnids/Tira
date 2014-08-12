angular.module('tira.factories', [])

.factory('Runners', function($firebase, fbURL_runners) {
  return $firebase(new Firebase(fbURL_runners)).$asArray() ;
})
.factory('Races', function($firebase, fbURL_races) {
  return $firebase(new Firebase(fbURL_races)).$asArray();
})
.factory('Finishers', function($firebase, fbURL_finishers) {
  return $firebase(new Firebase(fbURL_finishers)).$asArray();
})

.service('SyncFb', function() 
{
	this.alert = function(error)
	{
	  if (error || error == null) 
	  {
	    alertify.log("Sync FB ok",1000);
	  } 
	  else 
	  {
			alertify.error("Error syncing FB "+error,1000);
	  }
	}
})

;

