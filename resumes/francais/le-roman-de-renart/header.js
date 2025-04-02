const navigationItems =  [
    { href: "index.html", text: "Accueil" },
    { href: "analyses.html", text: "Analyses",
        chapters:[
            {href:"analyses-l-amour-courtois.html", text:"L'amour courtois"},
            {href:"analyses-la-chevalerie.html", text:"La chevalerie"},
            {href:"analyses-anthropomorphismes.html", text:"Les anthropomorphismes"},
            {href:"analyses-comique.html", text:"Les comiques"},
            {href:"analyses-exemple-commentaire-compose.html", text:"Commentaire composé"},
            {href:"analyses-personnages.html", text:"Les personnages"},
        ]
     },
    { href: "scans.html", text: "Scans" },
    {
        href: "chapitres.html",
        text: "Chapitres",
        chapters: [
            { href: "chap-preface.html", text: "Préface" },
            { href: "chap-intro.html", text: "Intro" },
            { href: "la-naissance-des-heros.html", text: "Branche XXIV : La naissance des héros" },
            { href: "#", text: "--Les méfaits du goupil--" },
            { href: "lmdg-chantecler.html", text: "LMDG: Renart et Chantecler" },
            { href: "lmdg-mesange.html", text: "LMDG: Renart et la mésange" },
            { href: "lmdg-tibert.html", text: "LMDG: Renart et Tibert" },
            { href: "lmdg-tiecelin.html", text: "LMDG: Renart et Tiécelin" },
            { href: "lmdg-hersent.html", text: "LMDG: Renart et Hersent" },
            { href: "lmdg-peche.html", text: "LMDG: La pêche à la queue" },
            { href: "lmdg-puits.html", text: "LMDG: Renart et Ysengrin dans le puits" },
            { href: "lmdg-andouille.html", text: "LMDG: Renart, Tibert et l'andouille" },
            { href: "#", text: "--Le jugement de Renart--" },
            { href: "ljdr-plainte.html", text: "LJDR: La plainte VS Renart" },
            { href: "ljdr-arrivee.html", text: "LJDR: L'arrivée du corps de Coupée" },
            { href: "ljdr-ambassades.html", text: "LJDR: Ambassades de Brun et de Tibert" },
            { href: "ljdr-cour.html", text: "LJDR: Ambassade de Grimbert et arrivée du goupil à la cour" },
            { href: "ljdr-condamnation-et-salut-du-goupil.html", text: "LJDR: Condamnation et salut du goupil" },
            { href: "ljdr-defi-final.html", text: "LJDR: Défi final" },
            { href: "#", text: "--Le siège de Maupertuis--" },
            { href: "lsdm-presentation-du-chateau.html", text: "LSDM: Présentation du château" },
            { href: "lsdm-les-assauts-inutiles.html", text: "LSDM: Les assauts inutiles" },
            { href: "lsdm-capture-de-renart.html", text: "LSDM: Capture de Renart" },
            { href: "lsdm-l-intervention-d-hermeline.html", text: "LSDM: L'intervention d'Hermeline" },
            { href: "#", text: "--Le combat singulier de Renart et d'Ysengrin--" },
            { href: "lcsry-intervention.html", text: "LCSRY: Dernière intervention des barons" },
            { href: "lcsry-combat.html", text: "LCSRY: Le combat" },
            { href: "lcsry-renart-sauve-une-fois-de-plus.html", text: "LCSRY: Renart sauvé une fois de plus" }
        ]
    },
    {href:"legal.html", text:"Légal"}
];

function getCurrentPageInfo() {
    const url = window.location.href.split('#')[0];
    let index = navigationItems.findIndex(item =>
        url.endsWith(item.href) || (url.endsWith('/') && item.href === 'index.html')
    );

    if (index === -1) {
        const chapterItem = navigationItems.find(item => item.chapters);
        if (chapterItem) {
            const chapterIndex = chapterItem.chapters.findIndex(chapter =>
                url.endsWith(chapter.href) && chapter.href !== "#"
            );
            if (chapterIndex !== -1) {
                return {
                    index: -1,
                    item: null,
                    chapterItem: chapterItem.chapters[chapterIndex]
                };
            }
        }
    }

    return {
        index,
        item: index !== -1 ? navigationItems[index] : null,
        chapterItem: null
    };
}

function injectCSS() {
const style = document.createElement('style');
style.innerHTML = `
.nav-item,.nav-list{position:relative}.custom-nav,.nav-link,.nav-link.active,.nav-link\:hover{border-radius:10px}.custom-nav,.dropdown{box-shadow:0 4px 6px rgba(0,0,0,.1)}body{margin:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f4f9}.custom-nav{overflow:visible;background-color:#2c3e50;margin:10px;font-family:Arial,sans-serif}.nav-list{margin:0;padding:0;list-style:none;display:flex}.dropdown-item,.nav-link{display:block;text-decoration:none;color:#fff}.nav-link{padding:16px 20px;text-align:center;transition:background-color .3s;white-space:nowrap}.nav-link\:hover{background-color:#16a085}.nav-link.active{background-color:#1abc9c}.nav-item.has-dropdown>.nav-link::after{content:'▼';font-size:10px;margin-left:8px}.dropdown{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(-10px);background:#2c3e50;min-width:250px;opacity:0;visibility:hidden;transition:.3s;border-radius:0 0 8px 8px;z-index:1000}.nav-item.has-dropdown\:hover .dropdown{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}.dropdown-item{padding:12px 20px;transition:background-color .3s;border-bottom:1px solid rgba(255,255,255,.1);text-align:left}.dropdown-item\:hover{background-color:#16a085}.dropdown-item\:last-child{border-bottom:none;border-radius:0 0 8px 8px}.mobile-header{display:none;background-color:#1abc9c;color:#fff;border-radius:10px}.menu-icon{display:none}#content{padding:20px}@media screen and (max-width:768px){.dropdown,.nav-item.has-dropdown\:hover .dropdown{transform:none}.dropdown,.dropdown-item{background-color:#243442}.nav-item{flex:none}.mobile-header{display:flex;justify-content:space-between;align-items:center;padding:10px 18px}.menu-icon,.nav-item.has-dropdown .dropdown{display:block}.custom-nav .dont-stabilo-me{padding:0!important}.menu-icon{font-size:24px;cursor:pointer}.nav-list{display:none;flex-direction:column}.nav-list.show{display:flex}.nav-link{text-align:left;padding:14px 20px}.dropdown{position:static;opacity:1;visibility:visible;display:none;min-width:100%;box-shadow:none}.dropdown-item{padding-left:40px}}
`;
document.head.appendChild(style);
}

function createNavHTML() {
const { item: currentItem, chapterItem } = getCurrentPageInfo();
const currentTitle = chapterItem ? chapterItem.text : (currentItem ? currentItem.text : document.title);


let navItems = navigationItems.map(item => {
    const isActive = item === currentItem || (chapterItem && item.chapters?.some(ch => ch === chapterItem));
    const hasDropdown = item.chapters && item.chapters.length > 0;

    let html = `<li class="nav-item${hasDropdown ? ' has-dropdown' : ''}">`;
    html += `<a href="${item.href}" class="nav-link${isActive ? ' active' : ''}">${item.text}</a>`;

    if (hasDropdown) {
        html += '<div class="dropdown">';
        html += item.chapters.map(chapter =>
            `<a href="${chapter.href}" class="dropdown-item">${chapter.text}</a>`
        ).join('');
        html += '</div>';
    }

    html += '</li>';
    return html;
}).join('');

return `
    <nav class="custom-nav">
        <div class="mobile-header">
            <span class="dont-stabilo-me"style="padding: 0;">${currentTitle}</span>
            <span class="menu-icon" onclick="toggleMobileMenu()">☰</span>
        </div>
        <ul class="nav-list">
            ${navItems}
        </ul>
    </nav>
`;
}

window.toggleMobileMenu = function() {
const navList = document.querySelector('.nav-list');
navList.classList.toggle('show');
}

function injectNav() {
const navHTML = createNavHTML();
document.body.insertBefore(
new DOMParser().parseFromString(navHTML, 'text/html').body.firstChild,
document.body.firstChild
);
}

document.addEventListener('DOMContentLoaded', function() {
injectCSS();
injectNav();
}); 

const currentUrl = window.location.href.split('#')[0];
const currentPath = currentUrl.split('/').pop();

function getChapterNavigation() {
    
    const chapters = navigationItems
        .find(item => item.href === "chapitres.html")
        .chapters.filter(chapter => chapter.href !== "#");

    

    const currentIndex = chapters.findIndex(chapter =>
        currentPath === chapter.href || currentUrl.endsWith(chapter.href)
    );

    
    const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

    return {
        prev: prevChapter,
        next: nextChapter
    };
}

function addChapterNavigation() {
    const nav = getChapterNavigation();
    const navHTML = document.createElement('div');
        // Check if the current path is in the chapters array of navigation items
        const chapters = navigationItems.find(item => item.href === "chapitres.html").chapters;
        const isChapterPage = chapters.some(chapter =>
            currentPath === chapter.href || currentUrl.endsWith(chapter.href)
        );
    
        if (!isChapterPage) {
            return;
        }
    navHTML.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin: 20px 0;
        padding: 10px;
        gap: 10px;
    `;
    
    const buttonStyle = `
        display: inline-block;
        padding: 10px 20px;
        background-color: #2c3e50;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s;
        font-family: Arial, sans-serif;
        user-select:none;
    `;
    
    // Add navigation links
    navHTML.innerHTML = `
        ${nav.prev ? `<a href="${nav.prev.href}" style="${buttonStyle}"id="chapNavPrev">← ${nav.prev.text}</a>` : '<span></span>'}
        ${nav.next ? `<a href="${nav.next.href}" style="${buttonStyle}" id="chapNavNext">${nav.next.text} →</a>` : ''}
    `;
    
    // Add hover effect
    const links = navHTML.getElementsByTagName('a');
    Array.from(links).forEach(link => {
        link.onmouseover = () => link.style.backgroundColor = '#1abc9c';
        link.onmouseout = () => link.style.backgroundColor = '#2c3e50';
    });
    
    const content = document.getElementById('content');
    if (content) {
        content.appendChild(navHTML);
    }
}

window.addEventListener('load', function() {
    addChapterNavigation();
        document.querySelectorAll('a').forEach(anchor => {
            anchor.addEventListener('click', async function(event) {
                event.preventDefault();
    
                const href = anchor.getAttribute('href');
                if (!href) return; 
    
                try {
                    const response = await fetch(href);
                    if (response.ok) {
                        window.location.href = href;
                    } else {
                        window.location.href = '/404.html';
                    }
                } catch (error) {
                    window.location.href = '/404.html';
                }
            });
        });
});