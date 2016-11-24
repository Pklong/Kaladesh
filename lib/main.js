const revealTenArticles = () => {
  const articles = document.querySelectorAll('li.hidden')
  for (let i = 0; i < 10; i++) {
    articles[i].classList.remove('hidden');
  }
};

const addArticles = (data) => {
  const articles = JSON.parse(data);
  const articleList = document.querySelector('ul');

  for (let i = 0; i < articles.length; i += 1) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const title = document.createTextNode(`${articles[i].title}`);
    const wordCount = document.createElement('span');
    wordCount.classList.add('words');
    wordCount.appendChild(document.createTextNode(`${articles[i].words}`));
    const author = document.createElement('span');
    author.classList.add('author');
    author.appendChild(document.createTextNode(`${articles[i].profile.last_name}`));
    const detailContainer = document.createElement('p');
    detailContainer.appendChild(wordCount);
    detailContainer.appendChild(author);
    a.appendChild(title);
    a.setAttribute('href', `${articles[i].url}`);
    li.appendChild(a);
    li.appendChild(detailContainer);
    li.classList.add('hidden');
    articleList.appendChild(li);
  }
};

const requestArticles = () => {
  const request = new XMLHttpRequest();
  request.addEventListener('load', function () {
    addArticles(this.responseText);
    revealTenArticles();
    const appState = JSON.parse(window.localStorage.getItem('kaladesh'));
    appState.requesting = false;
    window.localStorage.setItem('kaladesh', JSON.stringify(appState));
  })
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

const sortArticles = (numArticles) => {
  const articles = document.querySelectorAll('li');
  const container = document.querySelector('ul');

  const sortWordCount = (a, b) => {
    if (+a.children[2].children[0].innerHTML > +b.children[2].children[0].innerHTML) {
      return 1;
    }
    if (+a.children[2].children[0].innerHTML < +b.children[2].children[0].innerHTML) {
      return -1;
    }
    return 0;
  };

  const sorted = Array.from(articles).sort(sortWordCount);
  container.innerHTML = '';

  for (let i = 0; i < sorted.length; i += 1) {
    if (i >= numArticles) {
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
  const fetchArticles = once(requestArticles);
  document.querySelector('button').addEventListener('click', function (e) {
    e.preventDefault();
    const revealedArticles = document.querySelectorAll('li:not(.hidden)').length;
    sortArticles(revealedArticles);
  });


  const infiniteScroll = () => {
    const appState = JSON.parse(window.localStorage.getItem('kaladesh'));
    if (appState.requesting) return null;

    const scrollPos = window.innerHeight + window.scrollY;
    const scrollBottom = document.body.offsetHeight;

    if (scrollPos > scrollBottom) {
      appState.requesting = true;
      window.localStorage.setItem('kaladesh', JSON.stringify(appState));
      revealArticles(fetchArticles);
    }
  };

  window.addEventListener('scroll', infiniteScroll);
});
