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
	  if (error==false || error == null) 
	  {
	    alertify.log("Sync FB ok",10000);
	  } 
	  else 
	  {
			alertify.error("Error syncing FB "+error,10000);
	  }
	}
})

;

