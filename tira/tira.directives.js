angular.module('tira.directives', [])


.directive('addRunner', function(){
 return { 
  restrict:'E',
  templateUrl:'html/detail_runner.html'
 };
})
.directive('importRunner', function(){
 return { 
  restrict:'E',
  templateUrl:'html/import_runner.html'
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
})


.directive('ensureUnique', function() {
  return {
    require: 'ngModel',
    link: function(scope, ele, attrs, c) 
    {
    	scope.$watch(function () 
    	{
	    	var bib_exists = false;
		    var ref        = new Firebase("https://run.firebaseio.com/runners");
		    ref.once('value', function(snap) 
		    {
		    	c.$setValidity('unique', true);
		      snap.forEach(function(raceSnap) 
		      {
		        if (raceSnap.val().bib == c.$modelValue  || bib_exists )
		        {
		          bib_exists = true;
		          c.$setValidity('unique', false);
		        } 
		      })
		    })
		  })
		}
	}
})


.directive('onReadFile', function ($parse) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) 
		{
     var fn = $parse(attrs.onReadFile);
     element.on('change', function(onChangeEvent) 
     {
				var reader = new FileReader();      
				reader.onload = function(onLoadEvent) 
				{
					scope.$apply(function() 
					{
						fn(scope, {$fileContent:onLoadEvent.target.result});
					});
				};
				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
			});
		}
	}
})



.directive('duplicate',['BibValidation' ,function (BibValidation) {
    return {
        restrict: 'A',
		    require: 'ngModel',
        link: function(scope,elm,attrs, ctrl){
            ctrl.$parsers.unshift(function (viewValue) {
                var allRunners = scope[attrs.duplicate];
								var runnerId = scope[attrs.runnerid];
								var valid =  BibValidation.validateBib( allRunners, runnerId, viewValue);
								console.log(valid);
                ctrl.$setValidity('duplicate', valid);
                return viewValue;
            });

				}
    };
}])


;