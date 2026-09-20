/* ==========================================================================
   Builds the project cards from an array of project objects.
   ========================================================================== */

import { icon } from "./assets.js";

/* ==========================================================================
   Project images
   ========================================================================== */

import calculatorImage from "../assets/projects/calculator.png";
import libraryImage from "../assets/projects/library.png";
import rockPaperScissorsImage from "../assets/projects/rock-paper-scissors.png";
import ticTacToeImage from "../assets/projects/tic-tac-toe.png";
import weatherAppImage from "../assets/projects/weatherApp.png";

/* ==========================================================================
   Project image map
   ========================================================================== */

const projectImages = {
    "calculator.png": calculatorImage,
    "library.png": libraryImage,
    "rock-paper-scissors.png": rockPaperScissorsImage,
    "tic-tac-toe.png": ticTacToeImage,
    "weatherApp.png": weatherAppImage,
};

/* ==========================================================================
   Tiny hyperscript helper
   ========================================================================== */

function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);

    for (const [key, value] of Object.entries(attrs)) {
        if (value === false || value == null) continue;

        if (key === "class") {
            el.className = value;
        } else if (key === "style") {
            el.setAttribute("style", value);
        } else {
            el.setAttribute(key, value === true ? "" : value);
        }
    }

    children.flat().forEach((child) => {
        if (child == null || child === false) return;

        el.append(child.nodeType ? child : document.createTextNode(child));
    });

    return el;
}

/* ==========================================================================
   Create a filename-friendly slug
   ========================================================================== */

const slug = (text) =>
    String(text)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "") || "project";

/* ==========================================================================
   Create GitHub / live-site links
   ========================================================================== */

function iconLink(kind, href, label) {
    if (!href) return null;

    const src = icon(kind);

    if (!src) return null;

    const external = !href.startsWith("#");

    return h(
        "a",
        {
            href,
            class: "icon-btn icon-btn-sm magnetic",
            "aria-label": label,
            target: external ? "_blank" : null,
            rel: external ? "noopener noreferrer" : null,
        },

        h("img", {
            src,
            alt: "",
            "aria-hidden": "true",
        }),
    );
}

/* ==========================================================================
   Create one project card
   ========================================================================== */

function createCard(project, index) {
    const { title, description, image, repo, live, tags = [], file } = project;

    const name = slug(title);

    /* --------------------------------------------------------------
       Get the actual imported project image
       -------------------------------------------------------------- */

    const imageSrc = image ? projectImages[image] : null;

    /* --------------------------------------------------------------
       Create project image
       -------------------------------------------------------------- */

    const img = h("img", {
        class: "project-img",
        alt: `${title} screenshot`,
        width: 600,
        height: 400,
        loading: "lazy",
    });

    if (imageSrc) {
        img.src = imageSrc;
    } else {
        console.warn(`[projects] Image "${image}" not found for "${title}".`);

        /*
         * Keep the old placeholder behavior if an image
         * is missing.
         */
        const canvas = document.createElement("canvas");

        canvas.width = 600;
        canvas.height = 400;

        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#020807";
        ctx.fillRect(0, 0, 600, 400);

        ctx.fillStyle = "#00ff88";
        ctx.font = "20px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(`${name}.png`, 300, 200);

        img.src = canvas.toDataURL("image/png");
    }

    /* --------------------------------------------------------------
       Project links
       -------------------------------------------------------------- */

    const links = [
        iconLink("github", repo, `View source code of ${title} on GitHub`),

        iconLink("visit", live, `Visit live ${title}`),
    ].filter(Boolean);

    /* --------------------------------------------------------------
       Project card
       -------------------------------------------------------------- */

    return h(
        "article",
        {
            class: "project-card",
            "data-tilt": 7,
            "data-reveal": true,
            style: `--i:${index % 3}`,
        },

        h("span", {
            class: "card-glare",
            "aria-hidden": "true",
        }),

        /* Card top bar */
        h(
            "div",
            { class: "card-bar" },

            h(
                "span",
                {
                    class: "dots",
                    "aria-hidden": "true",
                },

                h("i"),
                h("i"),
                h("i"),
            ),

            h("span", { class: "card-file" }, file || `${name}.md`),
        ),

        /* Project image */
        h(
            "div",
            {
                class: "project-image-wrapper",
            },
            img,
        ),

        /* Project information */
        h(
            "div",
            {
                class: "project-details",
            },

            h(
                "div",
                {
                    class: "project-header",
                },

                h(
                    "h3",
                    {
                        class: "project-title",
                    },
                    title,
                ),

                links.length
                    ? h(
                          "div",
                          {
                              class: "project-links",
                          },
                          links,
                      )
                    : null,
            ),

            h(
                "p",
                {
                    class: "project-desc",
                },
                description,
            ),

            tags.length
                ? h(
                      "ul",
                      {
                          class: "tags",
                          "aria-label": "Tech stack",
                      },

                      tags.map((tag) => h("li", {}, tag)),
                  )
                : null,
        ),
    );
}

/* ==========================================================================
   Render all projects
   ========================================================================== */

export function renderProjects(container, projects) {
    if (!container) return;

    container.replaceChildren();

    if (!projects.length) {
        container.append(
            h(
                "p",
                {
                    class: "projects-empty",
                },
                "$ ls ./projects  ->  (empty) nothing here yet",
            ),
        );

        return;
    }

    const fragment = document.createDocumentFragment();

    projects.forEach((project, index) => {
        fragment.append(createCard(project, index));
    });

    container.append(fragment);
}
