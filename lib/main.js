const requestArticles = () => {
  const request = new XMLHttpRequest();
  request.addEventListener("load", function() {
    addArticles(this.responseText);
    revealTenArticles();
    window.requesting = false;
  })
  request.open('GET', 'http://localhost:3000/api/articles');
  request.send();
};

const revealTenArticles = () => {
  const articles = document.querySelectorAll("li.hidden")
    for (let i = 0; i < 10; i++) {
      articles[i].classList.remove("hidden");
    }
};

const addArticles = (data) => {
  const articles = JSON.parse(data);
  const articleList = document.querySelector("ul");

  for (let i = 0; i < articles.length; i++) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const title = document.createTextNode(`${articles[i]["title"]}`);
    a.appendChild(title);
    a.setAttribute("href", `${articles[i]["url"]}`);
    li.appendChild(a);
    li.classList.add("hidden");
    articleList.appendChild(li);
  }
}

const once = (fn) => {
  let called = false;
  return () => {
      if (called) { return; }
      called = true;
      fn();
  }
}

const revealArticles = (fetch) => {
  if (document.querySelector("li.hidden")) {
    revealTenArticles();
    window.requesting = false;
  } else {
    fetch();
  }
};

const sortArticles = (numArticles) => {
  const articles = document.querySelectorAll("li");
  const container = document.querySelector("ul");

  const sortWordCount = (a, b) => {
    if (+a.children[2].children[0].innerHTML > +b.children[2].children[0].innerHTML) {
      return 1;
    }
    if (+a.children[2].children[0].innerHTML < +b.children[2].children[0].innerHTML) {
      return -1;
    }
    return 0;
  }

  const sorted = Array.from(articles).sort(sortWordCount);
  container.innerHTML = "";

  for (let i = 0; i < sorted.length; i++) {
    i >= numArticles ? sorted[i].classList.add("hidden") : sorted[i].classList.remove("hidden")
    container.appendChild(sorted[i])
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.requesting = false;
  const fetchArticles = once(requestArticles);

  document.querySelector("button").addEventListener("click", function(e) {
    e.preventDefault();
    const revealedArticles = document.querySelectorAll("li:not(.hidden)").length;
    sortArticles(revealedArticles);
  });


  const infiniteScroll = () => {
    if (window.requesting) return null;

    const scrollPos = window.innerHeight + window.scrollY;
    const scrollBottom = document.body.offsetHeight;

    if (scrollPos > scrollBottom) {
      window.requesting = true;
      revealArticles(fetchArticles);
    }
  }

  window.onscroll = infiniteScroll;
});
