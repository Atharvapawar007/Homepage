import { placeholder } from "./placeholder.js";

// Images
import profilePic from "../assets/profile-pic.png";
import footerProfile from "../assets/footer-profile.jpg";

// SVG icons
import githubIcon from "../assets/svgs/github.svg";
import linkedinIcon from "../assets/svgs/linkedin.svg";
import twitterIcon from "../assets/svgs/twitter.svg";
import locationIcon from "../assets/svgs/location.svg";
import phoneIcon from "../assets/svgs/phone.svg";
import emailIcon from "../assets/svgs/email.svg";
import visitIcon from "../assets/svgs/visit.svg";

/*
 * Static assets used directly in template.html.
 */
const assets = {
    "profile-pic.png": profilePic,
    "footer-profile.jpg": footerProfile,
};

/*
 * SVG icons used throughout the website.
 */
const icons = {
    github: githubIcon,
    linkedin: linkedinIcon,
    twitter: twitterIcon,
    location: locationIcon,
    phone: phoneIcon,
    email: emailIcon,
    visit: visitIcon,
};

/**
 * Return a normal image asset.
 */
export function asset(name) {
    return assets[name] ?? null;
}

/**
 * Return an SVG icon.
 */
export function icon(name) {
    return icons[name] ?? null;
}

/**
 * Return an image or generate a placeholder when it doesn't exist.
 */
export function assetOrPlaceholder(name, label, width = 600, height = 400) {
    const url = asset(name);

    return url || placeholder(label || name, width, height);
}

/**
 * Add actual src attributes to images in template.html.
 */
export function bindStaticAssets(root = document) {
    root.querySelectorAll("img[data-asset]").forEach((img) => {
        const name = img.dataset.asset;
        const width = Number(img.getAttribute("width")) || 600;
        const height = Number(img.getAttribute("height")) || 400;

        img.src = assetOrPlaceholder(name, img.dataset.fallback || name, width, height);
    });

    root.querySelectorAll("img[data-icon]").forEach((img) => {
        const name = img.dataset.icon;
        const url = icon(name);

        if (url) {
            img.src = url;
        } else {
            console.warn(`Icon "${name}" does not exist.`);
        }
    });
}
