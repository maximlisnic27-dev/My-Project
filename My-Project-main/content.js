const nav = document.createElement("nav");
nav.classList.add("navbar");

const container = document.createElement("div");
["max-w-6xl", "mx-auto", "px-4", "py-4"].forEach(c => container.classList.add(c));

const flex = document.createElement("div");
["flex", "items-center", "justify-between"].forEach(c => flex.classList.add(c));

const logoWrap = document.createElement("div");
["flex", "items-center", "gap-2"].forEach(c => logoWrap.classList.add(c));

const logoSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
["w-8", "h-8", "text-[#FF6B35]"].forEach(c => logoSvg.classList.add(c));
logoSvg.setAttribute("viewBox", "0 0 24 24");
logoSvg.setAttribute("fill", "currentColor");

const logoPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
logoPath.setAttribute("d", "M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z");

logoSvg.appendChild(logoPath);

const logoText = document.createElement("span");
["text-xl", "font-bold", "text-white"].forEach(c => logoText.classList.add(c));
logoText.textContent = "Sport";

const logoSpan = document.createElement("span");
logoSpan.classList.add("gradient-text");
logoSpan.textContent = "Stats";

logoText.appendChild(logoSpan);
logoWrap.append(logoSvg, logoText);

const navDesktop = document.createElement("div");
["hidden", "md:flex", "items-center", "gap-6"].forEach(c => navDesktop.classList.add(c));

const dashLink = document.createElement("a");
["nav-link", "active", "font-medium"].forEach(c => dashLink.classList.add(c));
dashLink.href = "#";
dashLink.textContent = "Dashboard";

const profileLink = document.createElement("a");
["nav-link", "font-medium"].forEach(c => profileLink.classList.add(c));
profileLink.href = "#";
profileLink.textContent = "Profil";
profileLink.addEventListener("click", e => {
    e.preventDefault();
    console.log("Profil deschis");
});

navDesktop.append(dashLink, profileLink);

const userWrap = document.createElement("div");
["hidden", "md:flex", "items-center", "gap-3"].forEach(c => userWrap.classList.add(c));

const bellBtn = document.createElement("button");
["text-gray-400", "hover:text-[#FF6B35]", "transition"].forEach(c => bellBtn.classList.add(c));

const bellSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
["w-6", "h-6"].forEach(c => bellSvg.classList.add(c));
bellSvg.setAttribute("fill", "none");
bellSvg.setAttribute("stroke", "currentColor");
bellSvg.setAttribute("viewBox", "0 0 24 24");

const bellPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
bellPath.setAttribute("stroke-linecap", "round");
bellPath.setAttribute("stroke-linejoin", "round");
bellPath.setAttribute("stroke-width", "2");
bellPath.setAttribute("d", "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9");

bellSvg.appendChild(bellPath);
bellBtn.appendChild(bellSvg);

const avatar = document.createElement("div");
["w-10", "h-10", "rounded-full", "bg-gradient-to-br", "from-[#FF6B35]", "to-[#ff8555]", "flex", "items-center", "justify-center", "text-white", "font-bold"].forEach(c => avatar.classList.add(c));
avatar.id = "avatarInitial";
avatar.textContent = "A";

userWrap.append(bellBtn, avatar);

const mobileBtn = document.createElement("button");
["md:hidden", "text-white"].forEach(c => mobileBtn.classList.add(c));

const menuSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
["w-6", "h-6"].forEach(c => menuSvg.classList.add(c));
menuSvg.setAttribute("fill", "none");
menuSvg.setAttribute("stroke", "currentColor");
menuSvg.setAttribute("viewBox", "0 0 24 24");

const menuPaths = ["M4 6h16", "M4 12h16", "M4 18h16"];
for (let i = 0; i < menuPaths.length; i++) {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("stroke-linejoin", "round");
    p.setAttribute("stroke-width", "2");
    p.setAttribute("d", menuPaths[i]);
    menuSvg.appendChild(p);
}

mobileBtn.appendChild(menuSvg);

const mobileMenu = document.createElement("div");
["mobile-menu", "md:hidden", "hidden"].forEach(c => mobileMenu.classList.add(c));
mobileMenu.id = "mobileMenu";

mobileBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

const mobileInner = document.createElement("div");
["flex", "flex-col", "gap-4", "pt-4", "pb-2"].forEach(c => mobileInner.classList.add(c));

mobileInner.append(dashLink.cloneNode(true), profileLink.cloneNode(true));
mobileMenu.appendChild(mobileInner);

flex.append(logoWrap, navDesktop, userWrap, mobileBtn);
container.append(flex, mobileMenu);
nav.appendChild(container);
document.body.prepend(nav);

const dashboardPage = document.getElementById("dashboardPage");
const profilePage = document.getElementById("profilePage");

function showDashboard() {
    dashboardPage.classList.remove("hidden");
    profilePage.classList.add("hidden");
}

function showProfile() {
    dashboardPage.classList.add("hidden");
    profilePage.classList.remove("hidden");
    mobileMenu.classList.add("hidden");
}

const div = document.createElement("div");
div.className = "text-center mb-8";

const h1 = document.createElement("h1");
h1.className = "text-4xl md:text-5xl font-bold text-white mb-2";

const text1 = document.createTextNode("Statistici ");

const span = document.createElement("span");
span.className = "gradient-text";
span.textContent = "Sport";

h1.appendChild(text1);
h1.appendChild(span);

const p = document.createElement("p");
p.className = "text-gray-400";
p.textContent = "Urmărește-ți progresul zilnic";

div.appendChild(h1);
div.appendChild(p);

document.body.appendChild(div);
