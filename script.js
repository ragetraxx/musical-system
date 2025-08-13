/* ========= Helpers ========= */
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));
const grid = $("#grid");
const statusEl = $("#status");
const toast = $("#toast");
const drawer = $("#drawer");
const drawerClose = $("#drawer-close");
const drawerContent = $("#drawer-content");
const playerWrap = $("#player-wrap");
const player = $("#movie-player");
const nowPlaying = $("#now-playing");

let currentPage = 1;
let cache = [];          // holds the current page’s items for in-page search
let loading = false;

/* Build VidSrc embed URL. Uses path format unless subs/lang specified. */
function buildEmbedUrl(type, id, lang="", subUrl=""){
  const base = "https://vidsrc.xyz/embed/movie";
  if (lang || subUrl){
    const u = new URL(base);
    if (type === "imdb") u.searchParams.set("imdb", id);
    else u.searchParams.set("tmdb", id);
    if (lang) u.searchParams.set("ds_lang", lang);
    if (subUrl) u.searchParams.set("sub_url", subUrl);
    u.searchParams.set("autoplay", "1");
    return u.toString();
  }
  // path format
  return `${base}/${id}`;
}

/* Small UI helpers */
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(()=> toast.classList.remove("show"), 2200);
}
function setStatus(msg){ statusEl.textContent = msg || ""; }

/* ========= Player controls ========= */
function openPlayer({type, id, title}){
  const lang = $("#lang").value.trim();
  const subUrl = $("#sub-url").value.trim();
  const src = buildEmbedUrl(type, id, lang, subUrl);
  player.src = src;
  nowPlaying.textContent = title ? `Now Playing: ${title}` : "Now Playing";
  playerWrap.classList.remove("hidden");
  window.scrollTo({top:0, behavior:"smooth"});
}

$("#close-player").addEventListener("click", () => {
  playerWrap.classList.add("hidden");
  player.src = "";
});

/* ========= Load-by-ID bar ========= */
$("#load-btn").addEventListener("click", () => {
  const type = $("#id-type").value;
  const id = $("#movie-id").value.trim();
  if (!id) return showToast("Enter a valid ID.");
  openPlayer({type, id, title: id.toUpperCase()});
});
$("#movie-id").addEventListener("keydown", (e)=>{
  if (e.key === "Enter") $("#load-btn").click();
});

/* ========= Latest feed ========= */
function skeletonCards(count=12){
  grid.innerHTML = "";
  for(let i=0;i<count;i++){
    const s = document.createElement("div");
    s.className = "skeleton";
    grid.appendChild(s);
  }
}

async function fetchPage(page){
  loading = true;
  setStatus("Loading latest…");
  skeletonCards();

  try{
    const res = await fetch(`https://vidsrc.xyz/movies/latest/page-${page}.json`, {cache:"no-store"});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderGrid(data.result || []);
    $("#page-number").textContent = page;
    currentPage = page;
    setStatus("");
  }catch(err){
    console.error(err);
    grid.innerHTML = "";
    setStatus("Failed to load. Try again.");
  }finally{
    loading = false;
  }
}

function posterUrl(p){ return p ? `https://image.tmdb.org/t/p/w500${p}` : "https://via.placeholder.com/500x750?text=No+Image"; }

function renderGrid(items){
  cache = items.slice();
  grid.innerHTML = "";
  for(const m of items){
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img class="thumb" src="${posterUrl(m.poster_path)}" alt="${m.title || "Movie"}" loading="lazy">
      <div class="meta">
        <div class="title" title="${m.title || ""}">${m.title || "Untitled"}</div>
        <div class="badges">
          ${m.release_date ? `<span class="badge">${(m.release_date||"").slice(0,4)}</span>` : ""}
          ${m.original_language ? `<span class="badge">${m.original_language.toUpperCase()}</span>` : ""}
          ${typeof m.vote_average === "number" ? `<span class="badge">★ ${m.vote_average.toFixed(1)}</span>` : ""}
        </div>
      </div>
      <button class="play-mini">Play</button>
    `;

    // Open details drawer on poster/title click
    card.querySelector(".thumb").addEventListener("click", ()=> openDrawer(m));
    card.querySelector(".title").addEventListener("click", ()=> openDrawer(m));

    // Quick play
    card.querySelector(".play-mini").addEventListener("click", (e)=>{
      e.stopPropagation();
      openPlayer({type:"tmdb", id:String(m.id), title:m.title});
    });

    grid.appendChild(card);
  }
}

/* ========= Search within current page ========= */
const searchInput = $("#search-input");
let searchTimer = null;

searchInput.addEventListener("input", ()=>{
  clearTimeout(searchTimer);
  searchTimer = setTimeout(()=>{
    const q = searchInput.value.trim().toLowerCase();
    if (!q){ return renderGrid(cache); }
    const filtered = cache.filter(m =>
      (m.title||"").toLowerCase().includes(q) ||
      (m.original_title||"").toLowerCase().includes(q)
    );
    renderGrid(filtered);
    setStatus(filtered.length ? "" : "No matches on this page.");
  }, 120);
});

/* ========= Pager ========= */
$("#prev-page").addEventListener("click", ()=>{
  if (loading) return;
  if (currentPage > 1) fetchPage(currentPage-1);
});
$("#next-page").addEventListener("click", ()=>{
  if (loading) return;
  fetchPage(currentPage+1);
});

/* ========= Details drawer ========= */
function openDrawer(m){
  const year = m.release_date ? m.release_date.slice(0,4) : "—";
  drawerContent.innerHTML = `
    <img class="detail-poster" src="${posterUrl(m.poster_path)}" alt="${m.title||"Poster"}">
    <div class="detail-title">${m.title || "Untitled"} <span class="badge">${year}</span></div>
    <div class="detail-row">Original: ${m.original_title || "—"}</div>
    <div class="detail-row">Language: ${(m.original_language||"").toUpperCase() || "—"}</div>
    <div class="detail-row">TMDb ID: ${m.id}</div>
    ${typeof m.vote_average === "number" ? `<div class="detail-row">Rating: ★ ${m.vote_average.toFixed(1)} (${m.vote_count||0})</div>` : ""}
    ${m.overview ? `<div class="detail-row">${m.overview}</div>` : ""}
    <div class="detail-actions">
      <button class="btn primary" id="drawer-play">Play</button>
      <button class="btn subtle" id="copy-imdb">Copy IMDb/ TMDb ID</button>
    </div>
  `;
  $("#drawer-play").addEventListener("click", ()=> openPlayer({type:"tmdb", id:String(m.id), title:m.title}));
  $("#copy-imdb").addEventListener("click", async ()=>{
    try{
      await navigator.clipboard.writeText(`TMDb:${m.id}${m.imdb_id ? " IMDb:"+m.imdb_id : ""}`);
      showToast("Copied IDs to clipboard");
    }catch{ showToast("Couldn’t copy"); }
  });

  drawer.classList.add("open");
}
drawerClose.addEventListener("click", ()=> drawer.classList.remove("open"));
drawer.addEventListener("click",(e)=>{ if(e.target===drawer) drawer.classList.remove("open"); });

/* ========= Init ========= */
fetchPage(currentPage);
