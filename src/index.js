/* ==========================================================================
   Webpack entry point.
   1. import styles  -> bundled by css-loader / MiniCssExtractPlugin
   2. render dynamic content (project cards, images, icons)
   3. start the visual effects (they need the final DOM to exist)
   ========================================================================== */
import "./styles/style.css";

import projects from "./data/projects.js";
import { bindStaticAssets } from "./js/assets.js";
import { renderProjects } from "./js/projects.js";
import { initEffects } from "./js/effects.js";

function start() {
    renderProjects(document.getElementById("projects"), projects);
    bindStaticAssets();
    initEffects();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
} else {
    start();
}
