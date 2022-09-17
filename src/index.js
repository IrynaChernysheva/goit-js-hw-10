import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const markupEl = ref => (ref.innerHTML = '');
const onCountres = e => {
    const inputEl = e.target.value.trim();
    if (!inputEl) {
        markupEl(countryList);
        markupEl(countryInfo);
        return;
    } else {
        fetchCountries(inputEl)
            .then(data => {
                console.log(data);
                if (data.length > 9) {
                    Notify.info(
                        'Too many matches found. Please enter a more specific name.'
                    );
                    return;
                }
                countryMarup(data);
            })
            .catch(err => {
                markupEl(countryInfo);
                markupEl(countryList);
                Notify.failure('Oops, there is no country with that name');
            });
    }
};
const countryMarup = data => { 
  if (data.length === 1) {
      markupEl(countryList);
      const infoEl = infoMarkup(data);
      countryInfo.innerHTML = infoEl;
  } else {
      markupEl(countryInfo);
      const listEl = listMarkup(data);
      countryList.innerHTML = listEl;
  }
}

const listMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
};

const infoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<img src="${flags.png}" alt="${name.official}" width="200" height="200">
      <h1>${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};
searchEl.addEventListener('input', debounce(onCountres, DEBOUNCE_DELAY));