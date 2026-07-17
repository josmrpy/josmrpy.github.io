// ===================== CAR MENU =====================
(function () {
    const trigger = document.getElementById("carTrigger");
    const menu = document.getElementById("carMenu");
    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && e.target !== trigger) {
            menu.classList.remove("open");
        }
    });
})();

// ===================== BINARY COUNTER =====================
(function () {
    const bitValues = [128, 64, 32, 16, 8, 4, 2, 1];
    const byteRow = document.getElementById("byteRow");
    const decimalOut = document.getElementById("decimalOut");
    const binaryOut = document.getElementById("binaryOut");
    let value = 0;

    bitValues.forEach((v, i) => {
        const el = document.createElement("div");
        el.className = "bit";
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
})();

// ===================== NOTE CARDS =====================
(function () {
    const STORAGE_KEY = "jasiel-note-cards";
    const cardGrid = document.getElementById("cardGrid");
    const emptyHint = document.getElementById("emptyHint");
    const sharedBanner = document.getElementById("sharedBanner");
    const titleInput = document.getElementById("noteTitle");
    const bodyInput = document.getElementById("noteBody");

    function loadCards() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveCards(cards) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }

    function encodeNote(title, body) {
        const payload = JSON.stringify({ t: title, b: body });
        return btoa(unescape(encodeURIComponent(payload)));
    }

    function decodeNote(encoded) {
        const payload = decodeURIComponent(escape(atob(encoded)));
        return JSON.parse(payload);
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

    // check for a shared note in the URL
    const params = new URLSearchParams(window.location.search);
    const sharedParam = params.get("note");
    if (sharedParam) {
        try {
            const shared = decodeNote(sharedParam);
            const banner = document.createElement("div");
            banner.className = "shared-banner";
            banner.innerHTML =
                '<div class="tag">shared with you</div>' +
                '<h3 style="margin-top:0.4rem;"></h3><p style="white-space:pre-wrap;margin:0 0 0.7rem;"></p>' +
                '<button class="btn-ghost" id="saveSharedBtn">Save to my cards</button>';
            banner.querySelector("h3").textContent = shared.t || "Untitled";
            banner.querySelector("p").textContent = shared.b;
            sharedBanner.appendChild(banner);

            document.getElementById("saveSharedBtn").addEventListener("click", () => {
                const cards = loadCards();
                cards.unshift({ id: Date.now(), title: shared.t, body: shared.b });
                saveCards(cards);
                renderCards();
                banner.remove();
            });
        } catch (e) {
            // ignore malformed note param
        }
    }

    renderCards();
})();

// ===================== TOWER OF HANOI =====================
(function () {
    const board = document.getElementById("hanoiBoard");
    const status = document.getElementById("hanoiStatus");
    const discCountSelect = document.getElementById("discCount");
    const resetBtn = document.getElementById("hanoiReset");

    let discCount = parseInt(discCountSelect.value, 10);
    let pegs, selected, moves;

    function setup() {
        discCount = parseInt(discCountSelect.value, 10);
        pegs = [Array.from({ length: discCount }, (_, i) => discCount - i), [], []];
        selected = null;
        moves = 0;
        render();
    }

    function render() {
        board.innerHTML = "";
        pegs.forEach((peg, i) => {
            const pegEl = document.createElement("div");
            pegEl.className = "peg" + (selected === i ? " selected" : "");
            peg.forEach((discSize) => {
                const discEl = document.createElement("div");
                discEl.className = "disc";
                const widthPct = 35 + (discSize / discCount) * 65;
                discEl.style.width = widthPct + "%";
                discEl.textContent = discSize;
                pegEl.appendChild(discEl);
            });
            pegEl.addEventListener("click", () => handlePegClick(i));
            board.appendChild(pegEl);
        });

        const won = pegs[2].length === discCount;
        status.textContent = "Moves: " + moves + (won ? " — solved!" : "");
        status.classList.toggle("win", won);
    }

    function handlePegClick(i) {
        if (pegs[2].length === discCount) return; // already solved
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
            }
            selected = null;
        }
        render();
    }

    discCountSelect.addEventListener("change", setup);
    resetBtn.addEventListener("click", setup);
    setup();
})();

// ===================== SUBNETTING CHEAT SHEET =====================
(function () {
    function maskFromCidr(cidr) {
        return cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
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

    // reference table
    const tableBody = document.getElementById("cidrTableBody");
    for (let cidr = 0; cidr <= 32; cidr++) {
        const mask = maskFromCidr(cidr);
        const blockSize = Math.pow(2, 32 - cidr);
        const usable = cidr >= 31 ? (cidr === 32 ? 1 : 2) : blockSize - 2;
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

    // calculator
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
            '</span><span class="value">' +
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

        let first, last, usableCount;
        if (cidr === 32) {
            first = last = network;
            usableCount = 1;
        } else if (cidr === 31) {
            first = network;
            last = broadcast;
            usableCount = 2;
        } else {
            first = network + 1;
            last = broadcast - 1;
            usableCount = blockSize - 2;
        }

        resultsEl.innerHTML =
            resultBlock("Network", intToIp(network)) +
            resultBlock("Broadcast", intToIp(broadcast)) +
            resultBlock("Subnet mask", intToIp(mask)) +
            resultBlock("Wildcard mask", intToIp(wildcard)) +
            resultBlock("First usable", intToIp(first)) +
            resultBlock("Last usable", intToIp(last)) +
            resultBlock("Usable hosts", usableCount) +
            resultBlock("Block size", blockSize);
    }

    document.getElementById("calcBtn").addEventListener("click", calculate);
    calculate();
})();

// ===================== ROBLOX GAMES CAROUSEL =====================
// To add a new game later, just add another object to this array —
// the carousel and dots update automatically, no other code to touch.
const ROBLOX_GAMES = [
    {
        title: "Towers of Hanoi",
        url: "https://www.roblox.com/games/6371131171/Towers-of-Hanoi",
        image:
            "https://tr.rbxcdn.com/180DAY-c85c510949dd697e8ea94155b4f3d8f9/500/280/Image/Jpeg/noFilter",
    },
    {
        title: "Robloxian Physics Binary Counter",
        url: "https://www.roblox.com/games/130931703960435/Robloxian-Physics-Binary-Counter",
        image:
            "https://tr.rbxcdn.com/180DAY-4fa857881bc56e768c405f049664e4f4/500/280/Image/Jpeg/noFilter",
    },
    // { title: "Next Game", url: "https://www.roblox.com/games/.../Name", image: "https://tr.rbxcdn.com/..." },
];

(function () {
    const link = document.getElementById("carouselLink");
    const img = document.getElementById("carouselImg");
    const titleEl = document.getElementById("carouselTitle");
    const dotsWrap = document.getElementById("carouselDots");
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");
    let index = 0;

    function render() {
        const game = ROBLOX_GAMES[index];
        link.href = game.url;
        img.src = game.image;
        img.alt = game.title;
        titleEl.textContent = game.title;
        [...dotsWrap.children].forEach((d, i) =>
            d.classList.toggle("active", i === index),
        );
    }

    function buildDots() {
        dotsWrap.innerHTML = "";
        ROBLOX_GAMES.forEach((_, i) => {
            const dot = document.createElement("div");
            dot.className = "dot";
            dot.addEventListener("click", () => {
                index = i;
                render();
            });
            dotsWrap.appendChild(dot);
        });
    }

    prevBtn.addEventListener("click", () => {
        index = (index - 1 + ROBLOX_GAMES.length) % ROBLOX_GAMES.length;
        render();
    });
    nextBtn.addEventListener("click", () => {
        index = (index + 1) % ROBLOX_GAMES.length;
        render();
    });

    buildDots();
    render();
})();
