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


.service('BibValidation', function() 
{
	this.validateBib = function( allRunners, runnerId, bib){
				var valid = true;
				allRunners.forEach(function(runner){
					if (bib == runner.bib && runnerId != runner.$id  ) {
						valid = false;
           }
				});
				return valid;

	}
})

.service('AuthService', ['$location' , function ($location) {
	var AuthService = {};

	AuthService.client =  new FirebaseSimpleLogin(myRef, function(error, user) 
 		{
		  if (error) {
		    console.log(error);
		  } else if (user) {
		  	AuthService.user = user;
		    console.log("User ID: " + user.uid + ", Provider: " + user.provider);
		  } else {
		    console.log("not logged");
		  }
		});

  AuthService.login = function (email, password) {
		AuthService.client.login("password",{email:email, password:password}).when( $location.path('/check_in') );
				    

  };
  AuthService.logout = function () {
		AuthService.client.logout();
		AuthService.user = null;
		$location.path('/login');


  };

  return AuthService;
}])
;

