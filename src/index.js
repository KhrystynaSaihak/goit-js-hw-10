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

const messages = {
  error: 'Oops, there is no country with that name',
  notify: 'Too many matches found. Please enter a more specific name.',
};

const counriesApiServer = new CounriesApiServer();

const markupForManyCountries = data => {
  let renderData = '';
  data.map(country => {
    renderData += `<li><img src="${country.flags.svg}" alt="flag of ${country.name.official}"><span>${country.name.official}</span></li>`;
  });
  return renderData;
};

const markupForOneCountry = data => {
  let renderData = '';
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
  </div>
  <ul class="country-info--description-list">
    <li class="country-info--description-list-item"><span>Capital: </span>${
      data[0].capital
    }</li>
    <li class="country-info--description-list-item"><span>Population: </span>${
      data[0].population
    }</li>
    <li class="country-info--description-list-item"><span>Languages: </span>${languages.slice(
      0,
      -2
    )}</li>
  </ul>
`;
  return renderData;
};

const renderCountriesToHtml = data => {
  refs.countriesList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  if (data.length > 10) {
    Notify.info(messages.notify);
    return;
  } else if (data.length > 1 && data.length <= 10) {
    refs.countriesList.innerHTML = markupForManyCountries(data);
  } else {
    refs.countryInfo.innerHTML = markupForOneCountry(data);
  }
};

const onTypeCountry = e => {
  const country = e.target.value;
  if (!country) {
    return;
  }
  counriesApiServer.query = country.trim().toLowerCase();
  counriesApiServer
    .fetchCountries()
    .then(data => renderCountriesToHtml(data))
    .catch(error => {
      console.log(error);
      Notify.failure(messages.error);
    });
};

const debounceFun = debounce(onTypeCountry, DEBOUNCE_DELAY);

refs.countryEntryField.addEventListener('input', debounceFun);
