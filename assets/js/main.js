/* ==========================================================================
   main.js — rejestr modułów strony.

   Tu wpinasz przyszłe animacje/wizualizacje (np. graf wiedzy). Każdy moduł
   deklaruje selektor; uruchamia się tylko gdy element istnieje na stronie.
   Moduły mogą poczekać na koniec druku przez window.__typewriter.
   ========================================================================== */

(function () {
  "use strict";

  const modules = [
    // Przykład (do uzupełnienia w przyszłości):
    // {
    //   selector: "#skills-graph",
    //   init: (el) => import("/js/skills-graph.js").then((m) => m.default(el)),
    // },
  ];

  function boot() {
    for (const mod of modules) {
      const el = document.querySelector(mod.selector);
      if (el) {
        try {
          mod.init(el);
        } catch (e) {
          console.error("[main] module failed:", mod.selector, e);
        }
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
