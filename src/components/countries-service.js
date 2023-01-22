import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';

export default class CounriesApiServer {
  constructor() {
    this.searchQuery = '';
    this.errorText = 'Oops, there is no country with that name';
  }

  fetchCountries() {
    const url = `https://restcountries.com/v3.1/name/${this.searchQuery}?fields=name,capital,population,flags,languages`;
    return fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.status === 404) {
          Promise.reject(data);
          throw new Error(this.errorText);
        } else {
          return data;
        }
      })
      .catch(error => {
        Notify.failure(this.errorText);
      });
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
