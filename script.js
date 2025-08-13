// script.js

function buildEmbedUrl(type, id) {
  const base = 'https://vidsrc.xyz/embed/movie';
  const url = new URL(base);

  if (type === 'imdb') {
    url.searchParams.set('imdb', id);
  } else if (type === 'tmdb') {
    url.searchParams.set('tmdb', id);
  }

  url.searchParams.set('autoplay', '1');
  return url.toString();
}

document.getElementById('load-btn').addEventListener('click', () => {
  const type = document.getElementById('id-type').value;
  const id = document.getElementById('movie-id').value.trim();

  if (!id) {
    alert('Please enter a valid ID.');
    return;
  }

  const iframe = document.getElementById('movie-player');
  iframe.src = buildEmbedUrl(type, id);
});

// ----------------- Latest Movies -----------------

let currentPage = 1;
const latestContainer = document.getElementById('latest-movies');
const pageNumberDisplay = document.getElementById('page-number');

async function fetchLatestMovies(page) {
  try {
    const res = await fetch(`https://vidsrc.xyz/movies/latest/page-${page}.json`);
    const data = await res.json();

    latestContainer.innerHTML = '';

    data.result.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';

      const img = document.createElement('img');
      img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      img.alt = movie.title;

      const title = document.createElement('div');
      title.className = 'movie-title';
      title.textContent = movie.title;

      card.appendChild(img);
      card.appendChild(title);

      card.addEventListener('click', () => {
        const iframe = document.getElementById('movie-player');
        iframe.src = buildEmbedUrl('tmdb', movie.id);
      });

      latestContainer.appendChild(card);
    });

    pageNumberDisplay.textContent = page;
  } catch (err) {
    console.error('Error fetching latest movies:', err);
  }
}

document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchLatestMovies(currentPage);
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  currentPage++;
  fetchLatestMovies(currentPage);
});

// Initial load
fetchLatestMovies(currentPage);
