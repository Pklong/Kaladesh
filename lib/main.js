/* eslint-env browser */
/* eslint no-unused-expressions: ["error", { "allowTernary": true }] */

const revealTenArticles = () => {
  const articles = document.querySelectorAll('li.hidden');
  for (let i = 0; i < 10; i += 1) {
    articles[i].classList.remove('hidden');
  }
};

const setInitialState = () => {
  const appState = { requesting: false, sort: null };
  window.localStorage.setItem('kaladesh', JSON.stringify(appState));
  revealTenArticles();
};

const numRevealedArticles = () =>
  document.querySelectorAll('li:not(.hidden)').length;

const isReturnVisit = () =>
  Boolean(window.localStorage.getItem('kaladesh'));

const sortPreference = () =>
  JSON.parse(window.localStorage.getItem('kaladesh')).sort;

const setRequesting = (bool) => {
  const appState = JSON.parse(window.localStorage.getItem('kaladesh'));
  appState.requesting = bool;
  window.localStorage.setItem('kaladesh', JSON.stringify(appState));
};

const isRequesting = () =>
  JSON.parse(window.localStorage.getItem('kaladesh')).requesting;

const sortArticles = (numArticlesRevealed, sortFunction) => {
  const articles = document.querySelectorAll('li');
  const container = document.querySelector('ul');
  const sorted = Array.from(articles).sort(sortFunction);
  container.innerHTML = '';

  for (let i = 0; i < sorted.length; i += 1) {
    if (i >= numArticlesRevealed) {
      sorted[i].classList.add('hidden');
    } else {
      sorted[i].classList.remove('hidden');
    }
    container.appendChild(sorted[i]);
  }
};

const sorts = {
  sortByWordCountAsc(a, b) {
    const wordCountA = +a.children[1].children[0].innerHTML;
    const wordCountB = +b.children[1].children[0].innerHTML;
    return wordCountA - wordCountB;
  },
  sortByWordCountDesc(a, b) {
    const wordCountA = +a.children[1].children[0].innerHTML;
    const wordCountB = +b.children[1].children[0].innerHTML;
    return wordCountB - wordCountA;
  },
  sortByAuthorAsc(a, b) {
    const authorA = a.children[1].children[1].innerHTML.trim();
    const authorB = b.children[1].children[1].innerHTML.trim();
    if (authorA > authorB) {
      return 1;
    }
    if (authorA < authorB) {
      return -1;
    }
    return 0;
  },
  sortByAuthorDesc(a, b) {
    const authorA = a.children[1].children[1].innerHTML.trim();
    const authorB = b.children[1].children[1].innerHTML.trim();
    if (authorA > authorB) {
      return -1;
    }
    if (authorA < authorB) {
      return 1;
    }
    return 0;
  },
};

const requestArticles = () => {
  const request = new XMLHttpRequest();
  request.addEventListener('load', function loadArticles() {
    document.querySelector('ul')
            .insertAdjacentHTML('beforeend', this.responseText);
    revealTenArticles();
    setRequesting(false);
    if (sortPreference()) {
      sortArticles(numRevealedArticles(), sorts[sortPreference()]);
    }
  });
  request.open('GET', 'http://localhost:3000/api/articles');
  request.send();
};

const requestOnce = (fn) => {
  let called = false;
  return () => {
    if (called) {
      setRequesting(false);
      return;
    }
    called = true;
    fn();
  };
};

const revealArticles = (fetch) => {
  if (document.querySelector('li.hidden')) {
    revealTenArticles();
    setRequesting(false);
  } else {
    fetch();
  }
};

const configureSortListener = (sortType) => {
  const appState = JSON.parse(window.localStorage.getItem('kaladesh'));

  if (appState.sort === `sortBy${sortType}Asc`) {
    appState.sort = `sortBy${sortType}Desc`;
  } else {
    appState.sort = `sortBy${sortType}Asc`;
  }
  window.localStorage.setItem('kaladesh', JSON.stringify(appState));
  sortArticles(numRevealedArticles(), sorts[appState.sort]);
};

const assignListeners = () => {
  const [wordCountButton, authorButton] = document.querySelectorAll('button');
  wordCountButton.addEventListener('click', () => {
    configureSortListener('WordCount');
  });

  authorButton.addEventListener('click', () => {
    configureSortListener('Author');
  });
};

const initializeSortPreference = () => {
  sortPreference() ?
    sortArticles(10, sorts[sortPreference()]) :
    revealTenArticles();
};

const initializeApp = () => {
  isReturnVisit() ? initializeSortPreference() : setInitialState();
  assignListeners();
};

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  const fetchArticlesOnce = requestOnce(requestArticles);

  const infiniteScroll = () => {
    if (!isRequesting()) {
      const scrollPos = window.innerHeight + window.scrollY;
      const scrollBottom = document.body.offsetHeight;

      if (scrollPos > scrollBottom) {
        setRequesting(true);
        revealArticles(fetchArticlesOnce);
      }
    }
  };

  window.addEventListener('scroll', infiniteScroll);
});
