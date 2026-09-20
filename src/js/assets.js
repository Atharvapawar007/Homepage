import { placeholder } from "./placeholder.js";

/* ==========================================================================
   Images
   ========================================================================== */

import profilePic from "../assets/profile-pic.png";
import footerProfile from "../assets/footer-profile.jpg";

import calculator from "../assets/projects/calculator.png";
import library from "../assets/projects/library.png";
import rockPaperScissors from "../assets/projects/rock-paper-scissors.png";
import ticTacToe from "../assets/projects/tic-tac-toe.png";
import weatherApp from "../assets/projects/weatherApp.png";

/* ==========================================================================
   SVG icons
   ========================================================================== */

import emailIcon from "../assets/svgs/email.svg";
import githubIcon from "../assets/svgs/github.svg";
import linkedinIcon from "../assets/svgs/linkedin.svg";
import locationIcon from "../assets/svgs/location.svg";
import phoneIcon from "../assets/svgs/phone.svg";
import twitterIcon from "../assets/svgs/twitter.svg";
import visitIcon from "../assets/svgs/visit.svg";

/* ==========================================================================
   Asset map
   ========================================================================== */

const assets = {
    "profile-pic.png": profilePic,
    "footer-profile.jpg": footerProfile,
};

/* ==========================================================================
   Icon map
   ========================================================================== */

const icons = {
    email: emailIcon,
    github: githubIcon,
    linkedin: linkedinIcon,
    location: locationIcon,
    phone: phoneIcon,
    twitter: twitterIcon,
    visit: visitIcon,
};

/* ==========================================================================
   Public functions
   ========================================================================== */

/**
 * Returns the webpack-generated URL for an asset.
 */
export function asset(path) {
    return assets[path] ?? null;
}

/**
 * Returns the webpack-generated URL for an SVG icon.
 */
export function icon(name) {
    return icons[name] ?? null;
}

/**
 * Returns an asset URL.
 * If the asset doesn't exist, a generated placeholder is returned.
 */
export function assetOrPlaceholder(path, label, width = 600, height = 400) {
    const url = asset(path);

    if (!url) {
        console.warn(`[assets] "${path}" not found in src/assets - using placeholder.`);
    }

    return url || placeholder(label, width, height);
}

/**
 * Binds static images and icons from template.html.
 *
 * Example:
 *
 * <img data-asset="profile-pic.png">
 *
 * <img data-icon="github">
 */
export function bindStaticAssets(root = document) {
    /* ---------- Normal images ---------- */

    root.querySelectorAll("img[data-asset]").forEach((img) => {
        const width = Number(img.getAttribute("width")) || 600;
        const height = Number(img.getAttribute("height")) || 400;

        const path = img.dataset.asset;
        const fallback = img.dataset.fallback || path;

        img.src = assetOrPlaceholder(path, fallback, width, height);
    });

    /* ---------- SVG icons ---------- */

    root.querySelectorAll("img[data-icon]").forEach((img) => {
        const name = img.dataset.icon;
        const url = icon(name);

        if (url) {
            img.src = url;
        } else {
            console.warn(`[assets] icon "${name}" not found in src/assets/svgs`);
        }
    });
}
