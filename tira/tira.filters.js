angular.module('tira.filters', [])

.filter('race_time', function() {

  findRace = function(input) {
    var time    = false;
    var _start  = false;
    var ref = new Firebase("https://run.firebaseio.com/races"); 
    ref.once('value', function(snap) {
      snap.forEach(function(raceSnap) {
        if (Number(input.km) == Number(raceSnap.val().km)) {
              _start  = new Date(raceSnap.val().start_time );
              _final = new Date(input.time);
              var diff =  _final.getTime()- _start.getTime();
              var msec = diff;
              var hh = Math.floor(msec / 1000 / 60 / 60);
              msec -= hh * 1000 * 60 * 60;
              var mm = Math.floor(msec / 1000 / 60);
              msec -= mm * 1000 * 60;
              var ss = Math.floor(msec / 1000);
              msec -= ss * 1000;
              time = hh.toString()+":"+mm.toString()+":"+ss.toString()+":"+msec.toString();
        }
      })
    });
    return time;
  };
  return function(input) {
    return  findRace(input);    
  };
})

.filter('assignedFilter', function () {
  return function (items) {
    var filtered = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.$priority>0 ) {
        filtered.push(item);
      }
    }
    return filtered;
  };
})

.filter('categoryFilter', function () {
  return function (items, cat) {
    var filtered = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.km == cat.km && item.date >= cat.mindate && item.date<cat.maxdate) {
        filtered.push(item);
      }
    }
    return filtered;

    //
  };
})
  ;