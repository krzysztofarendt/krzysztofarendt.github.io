/* ==========================================================================
   Typewriter — strumieniuje stronę chunkami, kursor podąża za tekstem.

   Zasady:
   - Treść jest w HTML od startu (SEO/dostępność); JS ją tylko odsłania.
   - Druk chunkami (kilka znaków na krok) — szybko, jak streaming w Codex/Claude.
   - Na starcie czyścimy WSZYSTKIE węzły tekstowe (nie tylko elementy), żeby nic
     nie wyprzedzało kursora w blokach z wieloma fragmentami (tekst + linki).
   - Bloki atomowe (tabele, <pre>, obrazki) pojawiają się w całości.
   - Animacja gra zawsze (także po powrocie na stronę).
   - Klik / Enter / Esc / Spacja = pomiń do końca.
   - prefers-reduced-motion = od razu, bez animacji.
   ========================================================================== */

(function () {
  "use strict";

  const ATOMIC = new Set(["TABLE", "PRE", "FIGURE", "IMG", "VIDEO"]);
  const SKIP = new Set(["SCRIPT", "STYLE"]);

  const SENTENCE_MS = 70; // bazowy (i maksymalny) odstęp między zdaniami
  const TARGET_MS = 2000; // docelowy łączny czas druku strony
  const MIN_SENTENCE_MS = 8; // dolny limit, by bardzo długie strony nie migały

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function makeCursor() {
    const c = document.createElement("span");
    c.className = "cursor is-typing";
    c.setAttribute("aria-hidden", "true");
    return c;
  }

  function inSkip(node) {
    for (let p = node.parentNode; p; p = p.parentNode) {
      if (p.nodeType === Node.ELEMENT_NODE && SKIP.has(p.tagName)) return true;
    }
    return false;
  }

  // Czy węzeł leży w bloku atomowym (tabela, <pre>, obrazek) — taki tekst
  // pojawia się w całości, więc nie liczymy go do tempa „pisania".
  function inAtomic(node) {
    for (let p = node.parentNode; p; p = p.parentNode) {
      if (p.nodeType === Node.ELEMENT_NODE && ATOMIC.has(p.tagName)) return true;
    }
    return false;
  }

  function Typewriter(roots) {
    this.roots = roots.filter(Boolean);
    this.cursor = makeCursor();
    this.skipped = false;
    this.texts = new Map(); // textNode -> pełny tekst
    this.sentenceMs = SENTENCE_MS;
  }

  // Ukryj elementy i opróżnij węzły tekstowe (zapamiętując ich treść).
  Typewriter.prototype.prep = function (root) {
    root.querySelectorAll("*").forEach((n) => {
      if (!SKIP.has(n.tagName)) n.classList.add("tw-hidden");
    });
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    for (const tn of nodes) {
      if (inSkip(tn)) continue;
      if (!tn.nodeValue.trim()) continue; // białe znaki zostawiamy
      this.texts.set(tn, tn.nodeValue);
      tn.nodeValue = "";
    }
  };

  Typewriter.prototype.placeCursorAfter = function (node) {
    const parent = node.parentNode;
    if (parent) parent.insertBefore(this.cursor, node.nextSibling);
  };

  Typewriter.prototype.typeTextNode = async function (tn) {
    const full = this.texts.get(tn);
    if (full == null) return;
    this.placeCursorAfter(tn);
    // tokeny: zdanie zakończone kropką (+ białe znaki) lub końcowy fragment
    const tokens = full.match(/[^.]*\.\s*|[^.]+$/g) || [full];
    let acc = "";
    for (const tok of tokens) {
      if (this.skipped) {
        tn.nodeValue = full;
        return;
      }
      acc += tok;
      tn.nodeValue = acc;
      await sleep(this.sentenceMs);
    }
  };

  // Odsłoń całe poddrzewo od razu (treść + elementy).
  Typewriter.prototype.revealSubtree = function (el) {
    el.classList.remove("tw-hidden");
    el.querySelectorAll(".tw-hidden").forEach((x) =>
      x.classList.remove("tw-hidden")
    );
    for (const [node, full] of this.texts) {
      if ((el === node.parentNode || el.contains(node)) && node.nodeValue !== full) {
        node.nodeValue = full;
      }
    }
  };

  Typewriter.prototype.revealAtomic = function (el) {
    this.revealSubtree(el);
    el.style.opacity = "0";
    el.style.transition = "opacity 200ms ease";
    void el.offsetWidth;
    el.style.opacity = "1";
    this.placeCursorAfter(el);
  };

  Typewriter.prototype.walk = async function (el) {
    el.classList.remove("tw-hidden");
    const children = Array.from(el.childNodes);
    for (const node of children) {
      if (this.skipped) return;
      if (node.nodeType === Node.TEXT_NODE) {
        if (this.texts.has(node)) await this.typeTextNode(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (SKIP.has(node.tagName)) continue;
        if (ATOMIC.has(node.tagName)) {
          this.revealAtomic(node);
          if (!this.skipped) await sleep(90);
        } else {
          await this.walk(node);
        }
      }
    }
  };

  Typewriter.prototype.cursorToEnd = function () {
    const last = this.roots[this.roots.length - 1];
    last.appendChild(this.cursor);
    this.cursor.classList.remove("is-typing");
  };

  Typewriter.prototype.instant = function () {
    for (const root of this.roots) this.revealSubtree(root);
    this.cursorToEnd();
  };

  // Dobierz tempo: policz wszystkie tokeny-zdania i tak ustaw odstęp, by całość
  // trwała ~TARGET_MS. Limit górny (SENTENCE_MS) nie spowalnia krótkich stron,
  // dolny (MIN_SENTENCE_MS) chroni bardzo długie przed miganiem.
  Typewriter.prototype.computeSpeed = function () {
    let total = 0;
    for (const [node, full] of this.texts) {
      if (inAtomic(node)) continue;
      total += (full.match(/[^.]*\.\s*|[^.]+$/g) || [full]).length;
    }
    this.sentenceMs =
      total > 0
        ? Math.min(SENTENCE_MS, Math.max(MIN_SENTENCE_MS, TARGET_MS / total))
        : SENTENCE_MS;
  };

  Typewriter.prototype.run = async function () {
    for (const root of this.roots) this.prep(root);
    this.computeSpeed();
    for (let i = 0; i < this.roots.length; i++) {
      if (this.skipped) break;
      await this.walk(this.roots[i]);
      if (i === 0 && this.roots.length > 1 && !this.skipped) {
        await sleep(240); // pauza po komendzie (jak Enter)
      }
    }
    this.cursorToEnd();
  };

  Typewriter.prototype.skip = function () {
    if (this.skipped) return;
    this.skipped = true;
    for (const root of this.roots) this.revealSubtree(root);
    this.cursorToEnd();
  };

  // ---- Bootstrap ----------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    const response = document.querySelector("[data-typewriter]");
    if (!response) return;

    const command = document.querySelector(".prompt-line .command");
    const tw = new Typewriter([command, response]);

    if (reduceMotion) {
      tw.instant();
      return;
    }

    const onSkip = (e) => {
      if (e.type === "keydown" && !["Enter", "Escape", " "].includes(e.key))
        return;
      tw.skip();
    };
    document.addEventListener("click", onSkip);
    document.addEventListener("keydown", onSkip);

    tw.run();
    window.__typewriter = tw; // hook dla przyszłych modułów (np. graf wiedzy)
  });
})();
