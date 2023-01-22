import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import CounriesApiServer from './components/countries-service';

const DEBOUNCE_DELAY = 300;

const refs = {
  countryEntryField: document.querySelector('input#search-box'),
  countriesList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const counriesApiServer = new CounriesApiServer();

const renderCountriesToHtml = data => {
  console.log(data);
  let renderData = '';
  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  } else if (data.length > 1 && data.length <= 10) {
    data.map(country => {
      console.log(country);
      renderData += `<li><img src="${country.flags.svg}" alt="flag of ${country.name.official}" width="30"><span>${country.name.official}</span></li>`;
    });

    refs.countriesList.innerHTML = renderData;
  } else {
    let languages = '';
    for (const lang in data[0].languages) {
      languages += data[0].languages[lang] + ', ';
    }
    renderData = `
    <div class="country-info--header">
  <img class="country-info--flag" src="${data[0].flags.svg}" alt="flag of ${
      data[0].name.official
    }" />
  <h1 class="country-info--name">${data[0].name.official}</h1>
  <ul class="country-info--description-list">
    <li class="country-info--description-list-item"><span>Capital<span>: ${
      data[0].capital
    }</li>
    <li class="country-info--description-list-item"><span>Population</span>:v${
      data[0].population
    }</li>
    <li class="country-info--description-list-item"><span>Languages</span>:v${languages.slice(
      0,
      -2
    )}</li>
  </ul>
</div>`;
    refs.countryInfo.innerHTML = renderData;
  }
};

const onTypeCountry = e => {
  refs.countriesList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  const country = e.target.value;
  if (!country) {
    return;
  }
  counriesApiServer.query = country.trim().toLowerCase();
  counriesApiServer.fetchCountries().then(data => renderCountriesToHtml(data));
};

const debounceFun = debounce(onTypeCountry, DEBOUNCE_DELAY);

refs.countryEntryField.addEventListener('input', debounceFun);
