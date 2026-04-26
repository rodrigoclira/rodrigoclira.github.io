(() => {
  // ns-hugo-params:<stdin>
  var slides = { branding: { footer: { position: "bottom-center", text: "\xA9 2026 HugoBlox" }, logo: { filename: "slides-logo.svg", position: "top-right", width: "50px" }, title: { position: "bottom-left", show: true } }, diagram: true, highlight_style: "dracula", reveal_options: { controls: true, hash: true, progress: true, slidenumber: true }, theme: "black" };

  // <stdin>
  var slides2 = slides || {};
  var enabledPlugins = [RevealMarkdown, RevealSearch, RevealNotes, RevealMath.KaTeX, RevealZoom];
  var isObject = (o) => o === Object(o) && !isArray(o) && typeof o !== "function";
  var isArray = (a) => Array.isArray(a);
  var toCamelCase = (s) => s.replace(/([-_][a-z])/gi, (term) => term.toUpperCase().replace("-", "").replace("_", ""));
  var keysToCamelCase = (o) => {
    if (isObject(o)) {
      const n = {};
      Object.keys(o).forEach((k) => {
        n[toCamelCase(k)] = keysToCamelCase(o[k]);
      });
      return n;
    } else if (isArray(o)) {
      return o.map((i) => keysToCamelCase(i));
    }
    return o;
  };
  var pluginOptions = {};
  if (typeof slides2.reveal_options !== "undefined") {
    pluginOptions = slides2.reveal_options;
  }
  pluginOptions = keysToCamelCase(pluginOptions);
  if (typeof pluginOptions.menu_enabled === "undefined") {
    pluginOptions.menu_enabled = false;
  }
  if (pluginOptions.menu_enabled) {
    enabledPlugins.push(RevealMenu);
  }
  pluginOptions.plugins = enabledPlugins;
  Reveal.initialize(pluginOptions);
  var applySlideState = (event) => {
    const body = document.body;
    if (!body) return;
    body.classList.remove("no-branding", "no-header", "no-footer");
    const currentSlide = event?.currentSlide || Reveal.getCurrentSlide();
    if (currentSlide) {
      const state = currentSlide.getAttribute("data-state");
      if (state) {
        state.split(" ").forEach((s) => {
          body.classList.add(s);
        });
      }
    }
  };
  Reveal.on("ready", applySlideState);
  Reveal.on("slidechanged", applySlideState);
  if (typeof slides2.diagram === "undefined") {
    slides2.diagram = false;
  }
  if (slides2.diagram) {
    let mermaidOptions = {};
    if (typeof slides2.diagram_options !== "undefined") {
      mermaidOptions = slides2.diagram_options;
    }
    mermaidOptions.startOnLoad = false;
    mermaid.initialize(mermaidOptions);
    const renderMermaidDiagrams = function renderMermaidDiagrams2(event) {
      const mermaidDivs = event.currentSlide.querySelectorAll(".mermaid:not(.done)");
      const indices = Reveal.getIndices();
      const pageno = `${indices.h}-${indices.v}`;
      mermaidDivs.forEach((mermaidDiv, i) => {
        const insertSvg = (svgCode) => {
          mermaidDiv.innerHTML = svgCode;
          mermaidDiv.classList.add("done");
        };
        const graphDefinition = mermaidDiv.textContent;
        mermaid.mermaidAPI.render(`mermaid${pageno}-${i}`, graphDefinition, insertSvg);
      });
      Reveal.layout();
    };
    Reveal.on("ready", (event) => renderMermaidDiagrams(event));
    Reveal.on("slidechanged", (event) => renderMermaidDiagrams(event));
  }
})();
