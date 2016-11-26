/* eslint-env browser */

const revealTenArticles = () => {
  const articles = document.querySelectorAll('li.hidden');
  for (let i = 0; i < 10; i += 1) {
    articles[i].classList.remove('hidden');
  }
};

const setRequestingToFalse = () => {
  const appState = JSON.parse(window.localStorage.getItem('kaladesh'));
  appState.requesting = false;
  window.localStorage.setItem('kaladesh', JSON.stringify(appState));
};

const sortsModule = {
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
    const authorA = a.children[1].children[1].innerHTML;
    const authorB = b.children[1].children[1].innerHTML;
    if (authorA > authorB) {
      return 1;
    }
    if (authorA < authorB) {
      return -1;
    }
    return 0;
  },
  sortByAuthorDesc(a, b) {
    const authorA = a.children[1].children[1].innerHTML;
    const authorB = b.children[1].children[1].innerHTML;
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
    document.querySelector('ul').insertAdjacentHTML('beforeend', this.responseText);
    revealTenArticles();
    setRequestingToFalse();
  });
  request.open('GET', 'http://localhost:3000/api/articles');
  request.send();
};

const once = (fn) => {
  let called = false;
  return () => {
    if (called) {
      setRequestingToFalse();
      return;
    }
    called = true;
    fn();
  };
};

const revealArticles = (fetch) => {
  if (document.querySelector('li.hidden')) {
    revealTenArticles();
    setRequestingToFalse();
  } else {
    fetch();
  }
};

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

const assignListeners = () => {
  const [wordCountButton, authorButton] = document.querySelectorAll('button');
  wordCountButton.addEventListener('click', () => {
    const revealedArticlesCount = document.querySelectorAll('li:not(.hidden)').length;
    const appState = JSON.parse(window.localStorage.getItem('kaladesh'));

    if (!appState.sort || appState.sort === 'sortByWordCountDesc') {
      appState.sort = 'sortByWordCountAsc';
    } else {
      appState.sort = 'sortByWordCountDesc';
    }
    window.localStorage.setItem('kaladesh', JSON.stringify(appState));
    sortArticles(revealedArticlesCount, sortsModule[appState.sort]);
  });

  authorButton.addEventListener('click', () => {
    const revealedArticlesCount = document.querySelectorAll('li:not(.hidden)').length;
    const appState = JSON.parse(window.localStorage.getItem('kaladesh'));

    if (!appState.sort || appState.sort === 'sortByAuthorDesc') {
      appState.sort = 'sortByAuthorAsc';
    } else {
      appState.sort = 'sortByAuthorDesc';
    }
    window.localStorage.setItem('kaladesh', JSON.stringify(appState));
    sortArticles(revealedArticlesCount, sortsModule[appState.sort]);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const prevState = window.localStorage.getItem('kaladesh');
  if (!prevState) {
    const appState = { requesting: false, sort: null };
    window.localStorage.setItem('kaladesh', JSON.stringify(appState));
    revealTenArticles();
  } else if (prevState.sort) {
    const sortFunc = sortsModule[prevState.sort];
    sortArticles(10, sortFunc);
  } else {
    revealTenArticles();
  }
  const requestArticlesOnce = once(requestArticles);
  assignListeners();

  const infiniteScroll = () => {
    const appState = JSON.parse(window.localStorage.getItem('kaladesh'));
    if (appState.requesting) return null;

    const scrollPos = window.innerHeight + window.scrollY;
    const scrollBottom = document.body.offsetHeight;

    if (scrollPos > scrollBottom) {
      appState.requesting = true;
      window.localStorage.setItem('kaladesh', JSON.stringify(appState));
      revealArticles(requestArticlesOnce);
    }
  };

  window.addEventListener('scroll', infiniteScroll);
});
