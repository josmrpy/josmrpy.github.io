import { ROBLOX_GAMES } from "../data/roblox-games.js";

// Runs each feature on its own, so an error in one doesn't stop the others.
function init(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error("[" + name + "]", err);
  }
}

// Shared prev/next/dots logic for both carousels.
function createCarousel({ items, dotsEl, prevEl, nextEl, label, show }) {
  let index = 0;

  function render() {
    show(items[index]);
    [...dotsEl.children].forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-current", String(i === index));
    });
  }

  function go(i) {
    index = (i + items.length) % items.length;
    render();
  }

  items.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", `${label} ${i + 1}`);
    dot.addEventListener("click", () => go(i));
    dotsEl.appendChild(dot);
  });
  prevEl.addEventListener("click", () => go(index - 1));
  nextEl.addEventListener("click", () => go(index + 1));
  render();
}


// ===== playground tabs =====
init("tabs", function () {
  const tabs = [...document.querySelectorAll(".tab-btn")];
  const panels = document.querySelectorAll(".tab-panel");

  tabs.forEach((tab) => {
    const panel = document.getElementById(tab.dataset.tab);
    tab.id = "btn-" + tab.dataset.tab;
    tab.setAttribute("aria-controls", panel.id);
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
  });

  function select(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) =>
      p.classList.toggle("active", p.id === tab.dataset.tab),
    );
    if (focus) tab.focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      const target = {
        ArrowRight: i + 1,
        ArrowLeft: i - 1,
        Home: 0,
        End: tabs.length - 1,
      }[e.key];
      if (target === undefined) return;
      e.preventDefault();
      select(tabs[(target + tabs.length) % tabs.length], true);
    });
  });

  select(tabs.find((t) => t.classList.contains("active")) || tabs[0]);
});

// ===== sumo menu =====
init("sumo menu", function () {
  const trigger = document.getElementById("sumoTrigger");
  const menu = document.getElementById("sumoMenu");

  function setOpen(open) {
    menu.classList.toggle("open", open);
    trigger.setAttribute("aria-expanded", String(open));
  }

  trigger.addEventListener("click", () =>
    setOpen(!menu.classList.contains("open")),
  );
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !trigger.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      setOpen(false);
      trigger.focus();
    }
  });
});

// ===== binary counter =====
init("binary counter", function () {
  const bitValues = [128, 64, 32, 16, 8, 4, 2, 1];
  const byteRow = document.getElementById("byteRow");
  const decimalOut = document.getElementById("decimalOut");
  const binaryOut = document.getElementById("binaryOut");
  let value = 0;

  bitValues.forEach((v) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "bit";
    el.setAttribute("aria-label", "Bit " + v);
    el.dataset.value = v;
    el.addEventListener("click", () => {
      value ^= v;
      render();
    });
    byteRow.appendChild(el);
  });

  function render() {
    [...byteRow.children].forEach((el, i) => {
      const on = (value & bitValues[i]) !== 0;
      el.classList.toggle("on", on);
      el.textContent = on ? "1" : "0";
      el.setAttribute("aria-pressed", String(on));
    });
    decimalOut.textContent = value;
    binaryOut.textContent = value.toString(2).padStart(8, "0");
  }

  document.getElementById("incBtn").addEventListener("click", () => {
    value = (value + 1) % 256;
    render();
  });
  document.getElementById("decBtn").addEventListener("click", () => {
    value = (value + 255) % 256;
    render();
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    value = 0;
    render();
  });

  render();
});

// ===== note cards =====
init("note cards", function () {
  const STORAGE_KEY = "jasiel-note-cards";
  const cardGrid = document.getElementById("cardGrid");
  const emptyHint = document.getElementById("emptyHint");
  const sharedBanner = document.getElementById("sharedBanner");
  const titleInput = document.getElementById("noteTitle");
  const bodyInput = document.getElementById("noteBody");

  // In-memory copy, used when localStorage is blocked (e.g. private mode).
  let fallback = [];

  function loadCards() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveCards(cards) {
    fallback = cards;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      // storage unavailable: cards stay for this session only
    }
  }

  function encodeNote(title, body) {
    const bytes = new TextEncoder().encode(
      JSON.stringify({ t: title, b: body }),
    );
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  }

  function decodeNote(encoded) {
    const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
    const note = JSON.parse(new TextDecoder().decode(bytes));
    return { t: String(note.t || ""), b: String(note.b || "") };
  }

  function shareUrl(title, body) {
    const url = new URL(window.location.href);
    url.hash = "";
    url.searchParams.set("note", encodeNote(title, body));
    return url.toString();
  }

  function renderCards() {
    const cards = loadCards();
    cardGrid.innerHTML = "";
    emptyHint.style.display = cards.length ? "none" : "block";

    cards.forEach((card) => {
      const el = document.createElement("div");
      el.className = "note-card";
      el.innerHTML =
        '<h3></h3><p></p><div class="row">' +
        '<button class="btn-ghost share-btn">Copy link</button>' +
        '<button class="btn-ghost delete-btn">Delete</button></div>';
      el.querySelector("h3").textContent = card.title || "Untitled";
      el.querySelector("p").textContent = card.body;

      el.querySelector(".share-btn").addEventListener("click", async (e) => {
        const link = shareUrl(card.title, card.body);
        try {
          await navigator.clipboard.writeText(link);
          e.target.textContent = "Copied!";
          setTimeout(() => (e.target.textContent = "Copy link"), 1200);
        } catch (err) {
          prompt("Copy this link:", link);
        }
      });

      el.querySelector(".delete-btn").addEventListener("click", () => {
        const remaining = loadCards().filter((c) => c.id !== card.id);
        saveCards(remaining);
        renderCards();
      });

      cardGrid.appendChild(el);
    });
  }

  document.getElementById("addNoteBtn").addEventListener("click", () => {
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    if (!body) return;
    const cards = loadCards();
    cards.unshift({ id: Date.now(), title, body });
    saveCards(cards);
    titleInput.value = "";
    bodyInput.value = "";
    renderCards();
  });

  const params = new URLSearchParams(window.location.search);
  const sharedParam = params.get("note");
  if (sharedParam) {
    try {
      const shared = decodeNote(sharedParam);
      const banner = document.createElement("div");
      banner.className = "shared-banner";
      banner.innerHTML =
        '<div class="tag">shared with you</div>' +
        "<h3></h3><p></p>" +
        '<button class="btn-ghost" id="saveSharedBtn">Save to my cards</button>';
      banner.querySelector("h3").textContent = shared.t || "Untitled";
      banner.querySelector("p").textContent = shared.b;
      sharedBanner.appendChild(banner);

      // Open the notes tab and bring the shared note into view.
      document.querySelector('[data-tab="tab-notes"]').click();
      window.addEventListener("load", () =>
        document.getElementById("playground").scrollIntoView(),
      );

      document.getElementById("saveSharedBtn").addEventListener("click", () => {
        const cards = loadCards();
        cards.unshift({ id: Date.now(), title: shared.t, body: shared.b });
        saveCards(cards);
        renderCards();
        banner.remove();
      });
    } catch (e) {
      // malformed note param, ignore
    }
  }

  renderCards();
});

// ===== tower of hanoi =====
init("hanoi", function () {
  const board = document.getElementById("hanoiBoard");
  const status = document.getElementById("hanoiStatus");
  const discCountSelect = document.getElementById("discCount");
  const resetBtn = document.getElementById("hanoiReset");

  let discCount, pegs, selected, moves, message;

  function setup() {
    discCount = parseInt(discCountSelect.value, 10);
    pegs = [Array.from({ length: discCount }, (_, i) => discCount - i), [], []];
    selected = null;
    moves = 0;
    message = "";
    render();
  }

  function render() {
    board.innerHTML = "";
    pegs.forEach((peg, i) => {
      const pegEl = document.createElement("button");
      pegEl.type = "button";
      pegEl.className = "peg" + (selected === i ? " selected" : "");
      pegEl.setAttribute("aria-pressed", String(selected === i));
      pegEl.setAttribute(
        "aria-label",
        "Peg " +
          (i + 1) +
          ", " +
          peg.length +
          (peg.length === 1 ? " disc" : " discs"),
      );
      peg.forEach((discSize) => {
        const discEl = document.createElement("span");
        discEl.className = "disc";
        discEl.style.width = 35 + (discSize / discCount) * 65 + "%";
        discEl.textContent = discSize;
        pegEl.appendChild(discEl);
      });
      pegEl.addEventListener("click", () => handlePegClick(i));
      board.appendChild(pegEl);
    });

    const won = pegs[2].length === discCount;
    status.textContent =
      "Moves: " + moves + (won ? " — solved!" : message ? " — " + message : "");
    status.classList.toggle("win", won);
  }

  function handlePegClick(i) {
    if (pegs[2].length === discCount) return;
    message = "";
    if (selected === null) {
      if (pegs[i].length > 0) selected = i;
    } else if (selected === i) {
      selected = null;
    } else {
      const fromPeg = pegs[selected];
      const toPeg = pegs[i];
      const moving = fromPeg[fromPeg.length - 1];
      const top = toPeg[toPeg.length - 1];
      if (top === undefined || moving < top) {
        toPeg.push(fromPeg.pop());
        moves++;
      } else {
        message = "a bigger disc can’t go on a smaller one";
      }
      selected = null;
    }
    render();
    board.children[i].focus();
  }

  discCountSelect.addEventListener("change", setup);
  resetBtn.addEventListener("click", setup);
  setup();
});

// ===== subnetting cheat sheet =====
init("subnetting", function () {
  function maskFromCidr(cidr) {
    return cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  }
  function usableHosts(cidr) {
    if (cidr === 32) return 1;
    if (cidr === 31) return 2;
    return Math.pow(2, 32 - cidr) - 2;
  }
  function intToIp(int) {
    return [24, 16, 8, 0].map((s) => (int >>> s) & 255).join(".");
  }
  function ipToInt(ip) {
    const parts = ip.trim().split(".");
    if (parts.length !== 4) return null;
    let int = 0;
    for (const p of parts) {
      if (!/^\d+$/.test(p)) return null;
      const n = parseInt(p, 10);
      if (n < 0 || n > 255) return null;
      int = (int << 8) | n;
    }
    return int >>> 0;
  }

  const tableBody = document.getElementById("cidrTableBody");
  for (let cidr = 0; cidr <= 32; cidr++) {
    const mask = maskFromCidr(cidr);
    const blockSize = Math.pow(2, 32 - cidr);
    const usable = usableHosts(cidr);
    const row = document.createElement("tr");
    row.innerHTML =
      "<td>/" +
      cidr +
      "</td>" +
      "<td>" +
      intToIp(mask) +
      "</td>" +
      "<td>" +
      blockSize +
      "</td>" +
      "<td>" +
      usable +
      "</td>";
    tableBody.appendChild(row);
  }

  const cidrSelect = document.getElementById("calcCidr");
  for (let cidr = 0; cidr <= 32; cidr++) {
    const opt = document.createElement("option");
    opt.value = cidr;
    opt.textContent = "/" + cidr;
    cidrSelect.appendChild(opt);
  }
  cidrSelect.value = 24;

  const ipInput = document.getElementById("calcIp");
  const errorEl = document.getElementById("calcError");
  const resultsEl = document.getElementById("calcResults");

  function resultBlock(label, value) {
    return (
      '<div><span class="label">' +
      label +
      "</span>" +
      '<span class="value">' +
      value +
      "</span></div>"
    );
  }

  function calculate() {
    errorEl.textContent = "";
    resultsEl.innerHTML = "";
    const ipInt = ipToInt(ipInput.value);
    if (ipInt === null) {
      errorEl.textContent =
        "That IP doesn\u2019t look valid — use four octets 0-255, like 192.168.1.10.";
      return;
    }
    const cidr = parseInt(cidrSelect.value, 10);
    const mask = maskFromCidr(cidr);
    const wildcard = ~mask >>> 0;
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;
    const blockSize = Math.pow(2, 32 - cidr);

    let first, last;
    if (cidr === 32) {
      first = last = network;
    } else if (cidr === 31) {
      first = network;
      last = broadcast;
    } else {
      first = network + 1;
      last = broadcast - 1;
    }
    const usableCount = usableHosts(cidr);

    resultsEl.innerHTML =
      resultBlock("Network", intToIp(network)) +
      resultBlock("Broadcast", intToIp(broadcast)) +
      resultBlock("Subnet mask", intToIp(mask)) +
      resultBlock("Wildcard mask", intToIp(wildcard)) +
      resultBlock("First usable", intToIp(first)) +
      resultBlock("Last usable", intToIp(last)) +
      resultBlock("Usable hosts", usableCount) +
      resultBlock("Total addresses", blockSize);
  }

  document.getElementById("calcBtn").addEventListener("click", calculate);
  ipInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") calculate();
  });
  calculate();
});

// ===== featured articles carousel =====
init("articles", function () {
  const link = document.getElementById("articleLink");
  const source = document.getElementById("articleSource");
  const date = document.getElementById("articleDate");
  const image = document.getElementById("articleImage");
  const title = document.getElementById("articleTitle");
  const summary = document.getElementById("articleSummary");

  createCarousel({
    items: JSON.parse(document.getElementById("articles-data").textContent),
    dotsEl: document.getElementById("articleDots"),
    prevEl: document.getElementById("articlePrev"),
    nextEl: document.getElementById("articleNext"),
    label: "Show article",
    show(article) {
      link.href = article.url;
      source.textContent = article.source;
      date.textContent = article.date;
      image.src = article.image;
      title.textContent = article.title;
      title.lang = article.lang || "en";
      summary.textContent = article.summary;
    },
  });
});

// ===== roblox games carousel =====
init("roblox carousel", function () {
  const link = document.getElementById("carouselLink");
  const img = document.getElementById("carouselImg");
  const titleEl = document.getElementById("carouselTitle");

  createCarousel({
    items: ROBLOX_GAMES,
    dotsEl: document.getElementById("carouselDots"),
    prevEl: document.getElementById("carouselPrev"),
    nextEl: document.getElementById("carouselNext"),
    label: "Show game",
    show(game) {
      link.href = game.url;
      img.src = game.image;
      titleEl.textContent = game.title;
    },
  });
});
