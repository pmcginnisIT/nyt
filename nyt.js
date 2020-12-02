const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'; 
const key = 'mjAu0AAZdUbtaxovGndXfzsv83GegrIN'; 
let url; 


//SEARCH FORM
const searchTerm = document.querySelector('.search');
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
const submitBtn = document.querySelector('.submit');

//RESULTS NAVIGATION
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');

//RESULTS SECTION
const section = document.querySelector('section');


let pageNumber = 0;
console.log('PageNumber:', pageNumber);
let displayNav = false;
nav.style.display = 'none';


searchForm.addEventListener('submit', submitSearch);
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click', previousPage);

function submitSearch(e){
  pageNumber = 0;
  fetchResults(e);
}

function fetchResults(e) {
  // Use preventDefault() to stop the form submitting
  e.preventDefault();

  // Assemble the full URL
  url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value;
  console.log("URL:", url);

  if(startDate.value !== '') {
    url += '&begin_date=' + startDate.value;
  };

  if(endDate.value !== '') {
    url += '&end_date=' + endDate.value;
  };

  // Use fetch() to make the request to the API
  fetch(url).then(function(result) {
    return result.json();
  }).then(function(json) {
    displayResults(json);
  });
}

function displayResults(json) {
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }

  const articles = json.response.docs;

  if(articles.length === 10) {
    nav.style.display = 'block';
  } else {
    nav.style.display = 'none';
  }

  if(articles.length === 0) {
    const para = document.createElement('p');
    para.textContent = 'No results returned.'
    section.appendChild(para);
  } else {
    for(let i = 0; i < articles.length; i++) {
      const article = document.createElement('article');
      const heading = document.createElement('h2');
      const link = document.createElement('a');
      const img = document.createElement('img');
      const para1 = document.createElement('p');
      const para2 = document.createElement('p');
      const clearfix = document.createElement('div');

      const current = articles[i];
      console.log(current);

      link.href = current.web_url;
      link.textContent = current.headline.main;
      para1.textContent = current.snippet;
      para2.textContent = 'Keywords: ';
      for(let j = 0; j < current.keywords.length; j++) {
        const span = document.createElement('span');
        span.textContent = current.keywords[j].value + ' ';
        para2.appendChild(span);
      }

      if(current.multimedia.length > 0) {
        img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
        img.alt = current.headline.main;
      }

      clearfix.setAttribute('class','clearfix');

      article.appendChild(heading);
      heading.appendChild(link);
      article.appendChild(img);
      article.appendChild(para1);
      article.appendChild(para2);
      article.appendChild(clearfix);
      section.appendChild(article);
    }
  }
};  

function nextPage(e) {
    pageNumber++;
    fetchResults(e);
  };

  function previousPage(e) {
    if(pageNumber > 0) {
      pageNumber--;
    } else {
      return;
    }
    fetchResults(e);
  };
  