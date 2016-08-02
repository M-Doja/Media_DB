pl.view.listMovies = {
 setupUserInterface: function () {
   var tableBodyEl = document.querySelector("table#movies>tbody");
   var keys=[], key="", row={};
   // load all book objects
   Movie.loadAll();
   keys = Object.keys( Movie.instances);
   // for each movei, create a table row with cells for the 3 attributes
   for (i=0; i < keys.length; i++) {
     key = keys[i];
     row = tableBodyEl.insertRow();
     row.insertCell(-1).textContent = Movie.instances[key].summary;
     row.insertCell(-1).textContent = Movie.instances[key].genre;
     row.insertCell(-1).textContent = Movie.instances[key].director;
     row.insertCell(-1).textContent = Movie.instances[key].poster;
     row.insertCell(-1).textContent = Movie.instances[key].title;
     row.insertCell(-1).textContent = Movie.instances[key].released;
   }
 }
};
