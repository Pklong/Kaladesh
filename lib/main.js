/* eslint-env browser */

const revealTenArticles = () => {
  const articles = document.querySelectorAll('li.hidden');
  for (let i = 0; i < 10; i += 1) {
    articles[i].classList.remove('hidden');
  }
};

const requestArticles = () => {
  const request = new XMLHttpRequest();
  request.addEventListener('load', function loadArticles() {
    const articleContainer = document.querySelector('ul');
    articleContainer.insertAdjacentHTML('beforeend', this.responseText);
    revealTenArticles();

    const appState = JSON.parse(window.localStorage.getItem('kaladesh'));
    appState.requesting = false;
    window.localStorage.setItem('kaladesh', JSON.stringify(appState));
  });
  request.open('GET', 'http://localhost:3000/api/articles');
  request.send();
};

const once = (fn) => {
  let called = false;
  return () => {
    if (called) { return; }
    called = true;
    fn();
  };
};

const revealArticles = (fetch) => {
  if (document.querySelector('li.hidden')) {
    revealTenArticles();
    const appState = JSON.parse(window.localStorage.getItem('kaladesh'));
    appState.requesting = false;
    window.localStorage.setItem('kaladesh', JSON.stringify(appState));
  } else {
    fetch();
  }
};
const sortByWordCount = (a, b) => {
  if (+a.children[1].children[0].innerHTML > +b.children[1].children[0].innerHTML) {
    return 1;
  }
  if (+a.children[1].children[0].innerHTML < +b.children[1].children[0].innerHTML) {
    return -1;
  }
  return 0;
};
const sortByAuthor = (a, b) => {
  if (a.children[1].children[1].innerHTML > b.children[1].children[1].innerHTML) {
    return 1;
  }
  if (a.children[1].children[1].innerHTML < b.children[1].children[1].innerHTML) {
    return -1;
  }
  return 0;
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

document.addEventListener('DOMContentLoaded', () => {
  revealTenArticles();
  const kaladesh = { requesting: false };
  window.localStorage.setItem('kaladesh', JSON.stringify(kaladesh));
  const requestArticlesOnce = once(requestArticles);

  const [wordCountButton, authorButton] = document.querySelectorAll('button');
  wordCountButton.addEventListener('click', () => {
    const appState = JSON.parse(window.localStorage.getItem('kaladesh'));
    appState.sort = 'wordCountAsc';
    window.localStorage.setItem('kaladesh', JSON.stringify(appState));

    const revealedArticlesCount = document.querySelectorAll('li:not(.hidden)').length;
    sortArticles(revealedArticlesCount, sortByWordCount);
  });
  authorButton.addEventListener('click', () => {
    const appState = JSON.parse(window.localStorage.getItem('kaladesh'));
    appState.sort = 'authorAsc';
    window.localStorage.setItem('kaladesh', JSON.stringify(appState));

    const revealedArticlesCount = document.querySelectorAll('li:not(.hidden)').length;
    sortArticles(revealedArticlesCount, sortByAuthor);
  });

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
