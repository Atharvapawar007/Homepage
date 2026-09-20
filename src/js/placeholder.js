/* Generates a terminal-style SVG data-URI used when an image is missing. */
export function placeholder(label, w, h) {
    const size = Math.round(Math.min(w, h) / (label.length > 4 ? 12 : 3));
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
        `<defs><pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse">` +
        `<path d="M30 0H0V30" fill="none" stroke="#39ff8f" stroke-opacity=".18"/></pattern>` +
        `<linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a2418"/>` +
        `<stop offset="1" stop-color="#03100a"/></linearGradient></defs>` +
        `<rect width="100%" height="100%" fill="url(#v)"/><rect width="100%" height="100%" fill="url(#g)"/>` +
        `<text x="50%" y="50%" fill="#39ff8f" font-family="monospace" font-size="${size}" ` +
        `text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
