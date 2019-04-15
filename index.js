/* Create handles to manipulate parts of the interface
=====================================================*/
const searchBox = document.getElementById('search');
const pokeID = document.getElementById('pokeID');
const pokePic = document.getElementById('pokePic');
const pokeMoves = document.getElementById('pokeMoves');
const pokeEvo = document.getElementById('pokeEvo');
const rawData = document.getElementById('rawData');

searchBox.addEventListener('keyup', doSearch);

function doSearch(e) {
  if (e.which === 13 && e.target.value.length > 0) {
    let target = 'https://pokeapi.co/api/v2/pokemon/' + e.target.value;
    console.log('xhr to ' + target);
    doXhrGetJson(target)
      .then(function(result) {
        console.log('Result: ' + result);
        rawData.innerHTML = '<pre>' + JSON.stringify(result, null, 5) + '</pre>';

        /* Show ID and name
        ===================*/
        pokeID.innerText = result.id + ', ' + result.name;

        /* Show picture
        ===============*/
        console.log('pic: ' + JSON.stringify(result.sprites.front_shiny, null, 5));
        pokePic.innerHTML =
          '<img src=' + result.sprites.front_shiny + '>';

        /* Show moves
        ==============*/
        //Console.log('moves: ' + JSON.stringify(result.moves, null, 5));
        let moves = [];
        for (move of result.moves) {
          moves.push(move.move.name);
        }
        // Console.log(move.move.name);
        // pokeMoves.innerHTML += '<a href=\'' + move.move.url + '\'>' + move.move.name + '</a>';
        // Moves.push(move.name);
        // moves.join(move.name,', ');
        // pokeMoves.innerHTML += '<pre>' + JSON.stringify(result.moves, null, 5) + '</pre>'
        pokeMoves.innerHTML = moves.join(', ');
        // PokeMoves.innerHTML = moves;

        /* Show previous evolution(s)
        =============================*/
        // Implemented with a Promise as we don't wait for the next ajax call to get back
        getEvolutions(result);

      })
      .catch(function() {
        pokeID.innerText = 'Not found ...'
        pokePic.innerHTML = '';
        pokeMoves.innerText = '';
        pokeEvo.innerText = '';

      });
  }
}

function getEvolutions(result) {
  doXhrGetJson(result.species.url)
    .then(function(result) {
      pokeEvo.innerText = result.evolves_from_species.name;
    })
    .catch(function() {
      pokeEvo.innerText = 'None found.';
    });
}


/* Function to get an ajax json response
=======================================*/
function doXhrGetJson(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(this.response);
    };
    xhr.onerror = reject;
    xhr.responseType = 'json';
    xhr.open('GET', url);
    xhr.send();
  });
}
