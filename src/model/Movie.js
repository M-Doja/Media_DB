function Movie(slots) {
  this.title = slots.title;
  this.genre = slots.genre;
  this.summary = slots.summary;
  this.director = slots.director;
  this.poster = slots.plots;
  this.released = slots.released;
};

Movie.instances = {};

Movie.add = function(slots) {
  var movie = new Movie(slots);
  // add book to the Movie.instances collect
  Movie.instances[slots.title] = movie;
  console.log("Movie " + slots.title +" created!");
}

Movie.convertRow2Obj = function (movieRow) {
  var movie = new Movie( movieRow);
  return movie;
};

Movie.loadAll = function () {
  var key="", keys=[],
      moviesString="", movies={};
  try {
    if (localStorage["movies"]) {
      moviesString = localStorage["movies"];
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  if (moviesString) {
    movies = JSON.parse( moviesString);
    keys = Object.keys( movies);
    console.log( keys.length +" movies loaded.");
    for (i=0; i < keys.length; i++) {
      key = keys[i];
      Movie.instances[key] = Movie.convertRow2Obj( movies[key]);
    }
  }
};

Movie.update = function(slots) {
  var movie = Movie.instances[slot.title];
  var released = parseInt(slots.released);
  if(movie.title !== slots.title) {
    movie.title = slots.title
  }if(movie.releasd !== released) {
    movie.released = released;
  }console.log("Movie " + slots.title + " modified!");
};

Movie.destroy = function(title) {
  if (Movie.instances[title]) {
    console.log("Movie " + slots.title + " deleted!");
    delete Movie.instances[title];
  } else {
    console.log("There is no movie with title " + title + " in the database!");
  }
};

Movie.saveAll = function () {
  var moviesString="", error=false,
      nmrOfMovies = Object.keys( Movie.instances).length;
  try {
    moviesString = JSON.stringify( Movie.instances);
    localStorage["movies"] = moviesString;
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }
  if (!error) console.log( nmrOfMovies + " movies saved.");
};

Movie.createTestData = function () {
  Movie.instances["006251587X"] = new Movie(
      // {genre:"006251587X", title:"Weaving the Web", released:2000}
      {
        "title": "007 (#1) - Dr. No ",
        "summary": "A resourceful British government agent seeks answers in a case involving the disappearance of a colleague and the disruption of the American space program.",
        "genre": "Action",
        "director": "Terence Young",
        "release_date": "1962",
        "poster": "http://ia.media-imdb.com/images/M/MV5BOTU3NzExMTQ4N15BMl5BanBnXkFtZTcwMjkzNzQzNA@@._V1_UX182_CR0,0,182,268_AL_.jpg",
        "bigPic": "http://www.imdb.com/title/tt0055928/mediaviewer/rm43877632",
        "actors": ["Sean Connery", "Ursula Andress", "Joseph Wiseman"]
      }
    );
  Movie.instances["0465026567"] = new Movie(
      {genre:"0465026567", title:"Gödel, Escher, Bach", released:1999});
  Movie.instances["0465030793"] = new Movie(
      {genre:"0465030793", title:"I Am A Strange Loop", released:2008});
  Movie.saveAll();
};

Movie.clearData = function () {
  if (confirm("Do you really want to delete all book data?")) {
    localStorage["movies"] = "{}";
  }
};
