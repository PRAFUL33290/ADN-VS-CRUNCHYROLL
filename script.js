const ADN_ANIMES = [
  { title: "One Piece",         query: "One Piece" },
  { title: "Naruto Shippuden",  query: "Naruto Shippuden" },
  { title: "Boruto",            query: "Boruto Naruto Next Generations" },
  { title: "Bleach",            query: "Bleach" },
  { title: "D\u00e9tective Conan",   query: "Detective Conan" },
  { title: "City Hunter",       query: "City Hunter" },
];

const CR_ANIMES = [
  { title: "Demon Slayer",      query: "Kimetsu no Yaiba" },
  { title: "Jujutsu Kaisen",    query: "Jujutsu Kaisen" },
  { title: "Chainsaw Man",      query: "Chainsaw Man" },
  { title: "My Hero Academia",  query: "Boku no Hero Academia" },
  { title: "Solo Leveling",     query: "Solo Leveling" },
  { title: "Spy x Family",      query: "Spy x Family" },
];

function createSkeleton(title) {
  const card = document.createElement('div');
  card.className = 'anime-card';
  card.id = 'card-' + title.replace(/\s+/g, '-');
  card.innerHTML = `
    <div class="skeleton"></div>
    <div class="overlay"></div>
    <div class="top-bar"></div>
    <div class="info"><div class="title">${title}</div></div>
  `;
  return card;
}

function fillCard(card, title, data) {
  if (!data?.image) return;
  const img = document.createElement('img');
  img.src = data.image;
  img.alt = title;
  img.onload = () => {
    const skel = card.querySelector('.skeleton');
    if (skel) skel.replaceWith(img);
  };
  const scoreEl = card.querySelector('.score');
  if (data.score) {
    if (scoreEl) {
      scoreEl.textContent = `\u2605 ${data.score}${data.year ? ' \u00b7 ' + data.year : ''}`;
    } else {
      const info = card.querySelector('.info');
      const s = document.createElement('div');
      s.className = 'score';
      s.textContent = `\u2605 ${data.score}${data.year ? ' \u00b7 ' + data.year : ''}`;
      info.appendChild(s);
    }
  }
}

async function loadCovers(animes, gridId) {
  const grid = document.getElementById(gridId);
  for (const anime of animes) {
    grid.appendChild(createSkeleton(anime.title));
  }
  for (const anime of animes) {
    await new Promise(r => setTimeout(r, 380));
    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(anime.query)}&limit=1`
      );
      const json = await res.json();
      const entry = json.data?.[0];
      if (entry) {
        const card = document.getElementById('card-' + anime.title.replace(/\s+/g, '-'));
        if (card) fillCard(card, anime.title, {
          image: entry.images?.jpg?.large_image_url || entry.images?.jpg?.image_url,
          score: entry.score,
          year: entry.year,
        });
      }
    } catch (e) {
      console.warn('Erreur pour', anime.title, e);
    }
  }
}

loadCovers(ADN_ANIMES, 'grid-adn');
loadCovers(CR_ANIMES,  'grid-cr');