import { icon } from "./assets.js";
import { placeholder } from "./placeholder.js";

/**
 * Small helper for creating HTML elements.
 */
function h(tag, attrs = {}, ...children) {
    const element = document.createElement(tag);

    for (const [key, value] of Object.entries(attrs)) {
        if (value === false || value == null) continue;

        if (key === "class") {
            element.className = value;
        } else if (key === "style") {
            element.setAttribute("style", value);
        } else {
            element.setAttribute(key, value === true ? "" : value);
        }
    }

    children.flat().forEach((child) => {
        if (child == null || child === false) return;

        element.append(child.nodeType ? child : document.createTextNode(child));
    });

    return element;
}

/**
 * Convert a project title into a filename-friendly string.
 */
function slug(text) {
    return (
        String(text)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "") || "project"
    );
}

/**
 * Create GitHub / live-site icon links.
 */
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

/**
 * Create one project card.
 */
function createCard(project, index) {
    const { title, description, repo, live, tags = [], file } = project;

    const name = slug(title);

    /*
     * Project screenshots have not been added yet,
     * so use the generated placeholder.
     */
    const imageUrl = placeholder(`${name}.png`, 600, 400);

    const image = h("img", {
        class: "project-img",
        src: imageUrl,
        alt: `${title} screenshot`,
        width: 600,
        height: 400,
        loading: "lazy",
    });

    const links = [
        iconLink("github", repo, `View source code of ${title} on GitHub`),

        iconLink("visit", live, `Visit live ${title}`),
    ].filter(Boolean);

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

        h("div", { class: "project-image-wrapper" }, image),

        h(
            "div",
            { class: "project-details" },

            h(
                "div",
                { class: "project-header" },

                h("h3", { class: "project-title" }, title),

                links.length ? h("div", { class: "project-links" }, links) : null,
            ),

            h("p", { class: "project-desc" }, description),

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

/**
 * Render all project cards.
 */
export function renderProjects(container, projects) {
    if (!container) return;

    container.replaceChildren();

    if (!projects.length) {
        container.append(
            h("p", { class: "projects-empty" }, "$ ls ./projects -> (empty) nothing here yet"),
        );

        return;
    }

    const fragment = document.createDocumentFragment();

    projects.forEach((project, index) => {
        fragment.append(createCard(project, index));
    });

    container.append(fragment);
}
