/* ==========================================================================
   Visual effects: boot -> matrix rain -> scramble text -> reveals -> tilt.
   Call initEffects() AFTER the DOM (incl. dynamic project cards) exists.
   ========================================================================== */
import { placeholder } from "./placeholder.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const root = document.documentElement;

/* ---------- helpers ---------- */

/* Missing image? Swap in a generated terminal-style placeholder. */
function imageFallbacks() {
    $$("img[data-fallback]").forEach((img) => {
        const w = +img.getAttribute("width") || 600;
        const h = +img.getAttribute("height") || 400;
        const apply = () => {
            img.src = placeholder(img.dataset.fallback, w, h);
        };
        img.addEventListener("error", apply, { once: true });
        if (img.complete && img.naturalWidth === 0) apply();
    });
}

/* ---------- boot sequence ---------- */
async function boot() {
    const el = $("#boot");
    if (!el) return;

    let seen = false;
    try {
        seen = sessionStorage.getItem("booted") === "1";
    } catch (e) {
        /* storage blocked */
    }
    if (reduceMotion || seen) {
        el.remove();
        return;
    }

    const log = $("#bootLog");
    const fill = $("#bootFill");
    let skipped = false;
    const skip = () => {
        skipped = true;
    };
    addEventListener("keydown", skip, { once: true });
    addEventListener("pointerdown", skip, { once: true });

    const lines = [
        "[  ok  ] mounting /dev/portfolio",
        "[  ok  ] loading neural-net.ko",
        "[  ok  ] spawning matrix.service",
        "[ warn ] coffee level critical",
        "[  ok  ] establishing secure channel",
        "> access granted. welcome, visitor.",
    ];

    for (let i = 0; i < lines.length && !skipped; i++) {
        for (const ch of lines[i]) {
            if (skipped) break;
            log.textContent += ch;
            await sleep(9);
        }
        log.textContent += "\n";
        fill.parentElement.style.setProperty("--p", (i + 1) / lines.length);
        fill.style.setProperty("--p", (i + 1) / lines.length);
        await sleep(skipped ? 0 : 130);
    }
    if (!skipped) await sleep(350);

    try {
        sessionStorage.setItem("booted", "1");
    } catch (e) {
        /* ignore */
    }
    el.classList.add("done");
    await sleep(650);
    el.remove();
}

/* ---------- matrix rain ---------- */
function matrix() {
    const canvas = $("#matrix");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const glyphs =
        "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>{}[]/\\=+*#$%&;:".split(
            "",
        );
    const size = 16;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w,
        h,
        cols,
        drops,
        color,
        last = 0;

    const readColor = () => {
        color = getComputedStyle(root).getPropertyValue("--neon-rgb").trim() || "57,255,143";
    };

    const resize = () => {
        w = innerWidth;
        h = innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = "#020806";
        ctx.fillRect(0, 0, w, h);
        cols = Math.ceil(w / size);
        drops = Array.from({ length: cols }, () => -Math.random() * (h / size));
    };

    const draw = () => {
        ctx.fillStyle = "rgba(2, 8, 6, .09)";
        ctx.fillRect(0, 0, w, h);
        ctx.font = `${size}px "JetBrains Mono", monospace`;
        for (let i = 0; i < cols; i++) {
            const y = drops[i] * size;
            const ch = glyphs[(Math.random() * glyphs.length) | 0];
            const x = i * size;
            if (Math.random() > 0.96) {
                ctx.fillStyle = "#eafff3"; // bright head
            } else {
                ctx.fillStyle = `rgba(${color}, ${0.55 + Math.random() * 0.45})`;
            }
            ctx.fillText(ch, x, y);
            if (y > h && Math.random() > 0.975) drops[i] = 0;
            drops[i] += 1;
        }
    };

    const frame = (t) => {
        requestAnimationFrame(frame);
        if (t - last < 42) return; // ~24fps is plenty for rain
        last = t;
        draw();
    };

    readColor();
    resize();
    addEventListener("resize", resize);
    addEventListener("themechange", readColor);

    if (reduceMotion) {
        for (let i = 0; i < 40; i++) draw();
        return;
    }
    requestAnimationFrame(frame);
}

/* ---------- scramble / decrypt text ---------- */
const scrambleChars = "!<>-_\\/[]{}=+*^?#01";

function scramble(el, duration = 1100) {
    const finalText = el.dataset.final || (el.dataset.final = el.textContent.trim());
    if (reduceMotion) {
        el.textContent = finalText;
        return Promise.resolve();
    }
    cancelAnimationFrame(el._raf);
    const start = performance.now();
    const len = finalText.length;
    return new Promise((resolve) => {
        const step = (now) => {
            const p = Math.min(1, (now - start) / duration);
            let out = "";
            for (let i = 0; i < len; i++) {
                const ch = finalText[i];
                if (ch === " ") {
                    out += " ";
                    continue;
                }
                const resolveAt = (i / len) * 0.7 + 0.3;
                out +=
                    p >= resolveAt ? ch : scrambleChars[(Math.random() * scrambleChars.length) | 0];
            }
            el.textContent = out;
            if (p < 1) {
                el._raf = requestAnimationFrame(step);
            } else {
                el.textContent = finalText;
                resolve();
            }
        };
        el._raf = requestAnimationFrame(step);
    });
}

function scrambles() {
    const targets = $$("[data-scramble]");
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach(async (en) => {
                if (!en.isIntersecting) return;
                io.unobserve(en.target);
                await scramble(en.target);
                const glitchHost = en.target.closest(".glitch");
                if (glitchHost) {
                    glitchHost.classList.add("glitching");
                    setTimeout(() => glitchHost.classList.remove("glitching"), 650);
                }
            });
        },
        { threshold: 0.6 },
    );
    targets.forEach((t) => {
        t.dataset.final = t.textContent.trim();
        io.observe(t);
    });

    // re-scramble the hero name on hover
    const name = $(".profile-name [data-scramble]");
    if (name)
        name.closest(".profile-name").addEventListener("mouseenter", () => scramble(name, 700));
}

/* ---------- typewriter roles ---------- */
async function roles() {
    const el = $("#roleTyped");
    if (!el || reduceMotion) return;
    const list = [
        "Front-end developer",
        "AI/ML student",
        "Software engineer in the making",
        "Problem solver",
    ];
    let i = 0;
    el.textContent = "";
    while (true) {
        const word = list[i % list.length];
        for (let c = 1; c <= word.length; c++) {
            el.textContent = word.slice(0, c);
            await sleep(65);
        }
        await sleep(1600);
        for (let c = word.length; c >= 0; c--) {
            el.textContent = word.slice(0, c);
            await sleep(32);
        }
        await sleep(350);
        i++;
    }
}

/* ---------- scroll reveals ---------- */
function reveals() {
    const els = $$("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
        els.forEach((e) => e.classList.add("in"));
        return;
    }
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((en) => {
                if (en.isIntersecting) {
                    en.target.classList.add("in");
                    io.unobserve(en.target);
                }
            });
        },
        { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((e) => io.observe(e));
}

/* ---------- 3D tilt with glare ---------- */
function tilt() {
    if (!finePointer || reduceMotion) return;
    $$("[data-tilt]").forEach((el) => {
        const max = parseFloat(el.dataset.tilt) || 8;
        let tx = 0,
            ty = 0,
            cx = 0,
            cy = 0,
            raf = null;

        const loop = () => {
            cx += (tx - cx) * 0.12;
            cy += (ty - cy) * 0.12;
            el.style.setProperty("--rx", cx.toFixed(2) + "deg");
            el.style.setProperty("--ry", cy.toFixed(2) + "deg");
            const settling = Math.abs(tx - cx) > 0.02 || Math.abs(ty - cy) > 0.02;
            raf = settling ? requestAnimationFrame(loop) : null;
        };
        const kick = () => {
            if (!raf) raf = requestAnimationFrame(loop);
        };

        el.addEventListener("pointermove", (e) => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            ty = (px - 0.5) * 2 * max;
            tx = -(py - 0.5) * 2 * max;
            el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
            el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
            kick();
        });
        el.addEventListener("pointerleave", () => {
            tx = 0;
            ty = 0;
            kick();
        });
    });
}

/* ---------- magnetic buttons ---------- */
function magnetic() {
    if (!finePointer || reduceMotion) return;
    $$(".magnetic").forEach((el) => {
        el.addEventListener("pointermove", (e) => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - (r.left + r.width / 2);
            const y = e.clientY - (r.top + r.height / 2);
            el.style.translate = `${x * 0.35}px ${y * 0.35}px`;
        });
        el.addEventListener("pointerleave", () => {
            el.style.translate = "";
        });
    });
}

/* ---------- cursor spotlight + ring ---------- */
function cursor() {
    if (!finePointer) return;
    const ring = $("#cursorRing");
    let x = innerWidth / 2,
        y = innerHeight / 3,
        rx = x,
        ry = y,
        moved = false;

    addEventListener(
        "pointermove",
        (e) => {
            x = e.clientX;
            y = e.clientY;
            if (!moved) {
                moved = true;
                ring.classList.add("on");
            }
        },
        { passive: true },
    );

    document.addEventListener("pointerover", (e) => {
        ring.classList.toggle("hot", !!e.target.closest("a, button, [data-tilt]"));
    });
    document.addEventListener("pointerleave", () => ring.classList.remove("on"));
    document.addEventListener("pointerenter", () => moved && ring.classList.add("on"));

    const loop = () => {
        rx += (x - rx) * 0.2;
        ry += (y - ry) * 0.2;
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        root.style.setProperty("--mx", x + "px");
        root.style.setProperty("--my", y + "px");
        requestAnimationFrame(loop);
    };
    loop();
}

/* ---------- scroll progress, nav state, active link ---------- */
function scrollUI() {
    const bar = $("#progress");
    const nav = $("#nav");
    let ticking = false;

    const update = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        const p = max > 0 ? scrollY / max : 0;
        bar.style.transform = `scaleX(${p})`;
        nav.classList.toggle("scrolled", scrollY > 40);
        ticking = false;
    };
    addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        },
        { passive: true },
    );
    update();

    const links = $$("[data-nav]");
    const sections = ["about", "work", "contact"]
        .map((id) => document.getElementById(id))
        .filter(Boolean);
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((en) => {
                if (!en.isIntersecting) return;
                links.forEach((l) => l.classList.toggle("active", l.dataset.nav === en.target.id));
            });
        },
        { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
}

/* ---------- IST clock ---------- */
function clock() {
    const el = $("#clock");
    if (!el) return;
    const fmt = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
    });
    const tick = () => {
        el.textContent = fmt.format(new Date()) + " IST";
    };
    tick();
    setInterval(tick, 1000);
}

/* ---------- toast + copy email ---------- */
let toastTimer;
function toast(msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

function copyButtons() {
    $$("[data-copy]").forEach((btn) => {
        btn.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(btn.dataset.copy);
                toast("email copied to clipboard");
            } catch (e) {
                toast("copy failed - select the address manually");
            }
        });
    });
}

/* ---------- konami code easter egg ---------- */
function konami() {
    const seq = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "b",
        "a",
    ];
    let pos = 0;
    addEventListener("keydown", (e) => {
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        pos = key === seq[pos] ? pos + 1 : key === seq[0] ? 1 : 0;
        if (pos === seq.length) {
            pos = 0;
            const amber = root.dataset.theme === "amber";
            if (amber) delete root.dataset.theme;
            else root.dataset.theme = "amber";
            dispatchEvent(new Event("themechange"));
            toast(
                amber ? "root access revoked. back to green." : "root access granted. theme: amber",
            );
        }
    });
}

/* ---------- init ---------- */
export async function initEffects() {
    try {
        imageFallbacks();
        clock();
        matrix();
        cursor();
        scrollUI();
        tilt();
        magnetic();
        copyButtons();
        konami();
        console.log(
            "%c> hello, curious human. try the konami code.",
            "color:#39ff8f;background:#020806;padding:6px 10px;font:14px monospace",
        );
        await boot();
        document.body.classList.add("ready");
        reveals();
        scrambles();
        roles();
    } catch (err) {
        console.error(err);
        document.body.classList.add("ready");
        $$("[data-reveal]").forEach((e) => e.classList.add("in"));
        const bootEl = $("#boot");
        if (bootEl) bootEl.remove();
    }
}
