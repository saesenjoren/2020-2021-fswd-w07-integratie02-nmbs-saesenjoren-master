'use strict';
let currentDestinationID; // is geen DOM reference maar globale variabele

//#region ***  DOM references                           ***********
let htmlDestination, htmlRoute, htmlSelectedCity, htmlDestinationSelect, htmlAdaptTrain;
//#endregion

//#region ***  Callback-Visualisation - show___         ***********
const showDestinations = function (jsonObject) {
  //Toon menu
  console.log(jsonObject);
  let htmlstring_bestemming = '';
  let htmlstring_options = '';
  for (const bestemming of jsonObject.bestemmingen) {
    htmlstring_bestemming += `<li class="c-sidebar-item"><button class="c-sidebar-button js-station" data-destination-id="${bestemming.idbestemming}">${bestemming.stad}</button></li>`;
    htmlstring_options += `<option value="${bestemming.idbestemming}">${bestemming.stad}</option>`;
  }
  htmlDestination.innerHTML = htmlstring_bestemming;

  //Toon dropdownbox
  if (htmlDestinationSelect) {
    htmlDestinationSelect.innerHTML += htmlstring_options;
  }
  listenToClickDestination();
};

const showTrainsOnDestinations = function (jsonObject) {
  if (jsonObject.length === 0) {
    htmlRoute.innerHTML = 'Geen treinen.';
    return;
  }

  htmlRoute.innerHTML = '';
  let htmlstring = '';
  console.log(jsonObject);
  for (const trein of jsonObject.trein) {
    console.log(trein);
    htmlstring += `
			<div class="c-traject">
				<div class="c-traject__info">
					<h2 class="c-traject__name">${trein.stad}</h2>
					<p class="c-traject__train-id">Trein ${trein.idtrein}</p>
				</div>
				<div class="c-traject__departure">${trein.vertrek}</div>
				<div class="c-traject__track">${trein.spoor}</div>
				<div class="c-traject__delay">${trein.vertraging ? trein.vertraging : '-'}</div>
				<div class="c-traject__cancelled">${trein.afgeschaft ? '<span class="c-traject__cancelled-label">afgeschaft</span>' : ''}
        </div>
        <div class="c-traject__updatevertraging">
						<a href="vertraging.html?TreinID=${trein.idtrein}">
							<svg class="c-traject__updatevertraging-symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="arcs">
                <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
							</svg>
						</a>
					</div>
        <div class="c-traject__update">
          <a href="aanpassen.html?TreinID=${trein.idtrein}">
						<svg class="c-traject__update-symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="arcs">
							<polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
            </svg>
          </a>
				</div>
				<div class="c-traject__delete">
					<svg class="c-traject__delete-symbol" data-train-id=${trein.idtrein} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="arcs">
						<polyline points="3 6 5 6 21 6"></polyline>
						<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
						<line x1="10" y1="11" x2="10" y2="17"></line>
						<line x1="14" y1="11" x2="14" y2="17"></line>
					</svg>
				</div>
			</div>`;
  }

  htmlRoute.innerHTML = htmlstring;
  listenToClickRemoveTrain();
};

const showCleanTrains = function () {
  htmlRoute.innerHTML = 'Maak een keuze in de linkerkolom';
};

//#endregion

//#region ***  Callback-No Visualisation - callback___  ***********
const callbackAddTrain = function (data) {
  console.log('ADD antw van server ');
  if (data.treinid > 0) {
    console.log('ADD gelukt');
    console.log(data);
    getTrainsOnDestinations(document.querySelector('.js-add-bestemming').value);
    currentDestinationID = document.querySelector('.js-add-bestemming').value;
    htmlSelectedCity.innerText = document.querySelector('.js-add-bestemming').options[document.querySelector('.js-add-bestemming').selectedIndex].innerText;
    document.querySelector('.js-add-afgeschaft').checked = false;
    document.querySelector('.js-add-bestemming').selectedIndex = 0;
    document.querySelector('.js-add-spoor').value = '';
    document.querySelector('.js-add-vertraging').value = '';
    document.querySelector('.js-add-vertrek').value = '';
  }
};
const callbackRemoveTrain = function (data) {
  console.log(data);
  getTrainsOnDestinations(currentDestinationID);
};
//#endregion

//#region ***  Data Access - get___                     ***********
const getDestinations = function () {
  handleData('http://127.0.0.1:5000/api/v1/bestemmingen', showDestinations);
};

const getTrainsOnDestinations = function (idDestination) {
  handleData(`http://127.0.0.1:5000/api/v1/treinen/bestemming/${idDestination}`, showTrainsOnDestinations);
};
//#endregion

//#region ***  Event Listeners - listenTo___            ***********
const listenToClickDestination = function () {
  const buttons = document.querySelectorAll('.js-station');
  for (const btn of buttons) {
    btn.addEventListener('click', function () {
      htmlSelectedCity.innerText = btn.innerText;
      const id = btn.getAttribute('data-destination-id');
      currentDestinationID = id;
      getTrainsOnDestinations(id);
    });
  }
};

const listenToClickAddTrain = function () {
  const button = document.querySelector('.js-add-train');
  button.addEventListener('click', function () {
    console.log('toevoegen nieuwe trein');
    const jsonobject = {
      afgeschaft: document.querySelector('.js-add-afgeschaft').checked,
      bestemmingID: document.querySelector('.js-add-bestemming').value,
      spoor: document.querySelector('.js-add-spoor').value,
      vertraging: document.querySelector('.js-add-vertraging').value == '' ? null : document.querySelector('.js-add-vertraging').value,
      vertrek: document.querySelector('.js-add-vertrek').value,
    };
    console.log(jsonobject);
    handleData('http://127.0.0.1:5000/api/v1/treinen', callbackAddTrain, null, 'POST', JSON.stringify(jsonobject));
  });
};

const listenToClickRemoveTrain = function () {
  const buttons = document.querySelectorAll('.c-traject__delete-symbol');
  for (const b of buttons) {
    b.addEventListener('click', function () {
      const id = b.getAttribute('data-train-id');
      console.log('verwijder ' + id);
      handleData(`http://127.0.0.1:5000/api/v1/treinen/${id}`, callbackRemoveTrain, null, 'DELETE');
    });
  }
};
//#endregion

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
  console.log('🚂', 'https://www.youtube.com/watch?v=8oVTXSntnA0');

  // Get some DOM, we created empty earlier.
  htmlDestination = document.querySelector('.js-destinations');
  htmlRoute = document.querySelector('.js-trajects');
  htmlSelectedCity = document.querySelector('.js-departure');
  htmlDestinationSelect = document.querySelector('.js-add-bestemming');
  htmlAdaptTrain = document.querySelector('.js-adapttrain');

  //deze code wordt gestart vanaf index.html
  getDestinations();
  showCleanTrains();
  listenToClickAddTrain();
};

document.addEventListener('DOMContentLoaded', init);
//#endregion
