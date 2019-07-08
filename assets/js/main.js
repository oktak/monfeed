G = {};
G['data'] = [];

function checkFirst () {
    let isReturn = window.localStorage.getItem('isReturn');
    console.log(`isReturn: ${!isReturn}`);

    return !isReturn;
}

function loadDefault () {
    let data = [
        "https://www.facebook.com/facebook",
        "https://www.facebook.com/Disney",
        "https://www.facebook.com/apple/",
        "https://www.facebook.com/Google",
        "Nike",
        "netflix",
        "microsoft",
        "govnews.hk",
    ]
    localStorage.setItem('pageData', JSON.stringify(data));
    return data;
}

function loadPrevious () {
    let dataStr = localStorage.getItem('pageData');
    let data = [];
    if (dataStr) {
        data = JSON.parse(dataStr);
    } else {
        data = loadDefault();
    }
    return data;
}

function genDom (data) {
    let trackHtml = ''
    data.map(o => {
        let id = o.replace(/https?:\/\/www\.facebook\.com/g, '')
        .replace('www.facebook.com', '')
        .replace('facebook.com', '')
        .replace(/https?:\/\//g, '')
        .replace(/\//g, '');

        console.log(id);

        let ihtml = `<div id="ifr_${o}"><iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F${id}&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false&appId" width="340" height="500" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe></div>\n`;
        trackHtml += ihtml;
    })
    let trackEl = document.getElementById('track');
    trackEl.innerHTML = trackHtml;
}

function genOption (data) {
    let itemHtml = ''
    data.map(o => {
        let ihtml = `<li class="py-2 border-b border-grey-400">
            <p>
                <button id="rmv_${o}" class="itemRemove bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick="javascript:recordRemove('${o}');">X</button>
                <span class="item">${o}</span>
            </p>
        </li>`;
        itemHtml += ihtml;
    });
    let itemListEl = document.getElementById('itemList');
    itemListEl.innerHTML = itemHtml;
}

// =====
function recordDisplay () {
    if (window.localStorage) {
    } else {
        console.log('localStorage is required. Your browser does not support')
    }
}

function recordAdd () {
    if (window.localStorage) {
        let userInpEl = document.getElementById('userInp');
        let o = userInpEl.value;

        if (-1 != G['data'].indexOf(o)) {
            console.log('Record already exists.')
            return false;
        }

        G['data'].unshift(o);
        localStorage.setItem('pageData', JSON.stringify(G['data']));

        let ihtml = `
            <p>
                <button id="rmv_${o}" class="itemRemove itemRemove bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick="javascript:recordRemove('${o}');">X</button>
                <span class="item">${o}</span>
            </p>
        `;
        let newChild = document.createElement('li');
        newChild.className = "py-2 border-b border-grey-400";
        newChild.innerHTML = ihtml;
        let itemListEl = document.getElementById('itemList');
        itemListEl.insertBefore(newChild, itemListEl.firstChild);

        let ifrhtml = `<iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F${o}&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false&appId" width="340" height="500" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>\n`;
        let newifrChild = document.createElement('div');
        newifrChild.id = `ifr_${o}`;
        newifrChild.innerHTML = ifrhtml;
        let trackEl = document.getElementById('track');
        trackEl.insertBefore(newifrChild, trackEl.firstChild);
    } else {
        console.log('localStorage is required. Your browser does not support')
    }
}

function recordRemove (item) {
    if (window.localStorage) {
        let index = G['data'].indexOf(item);
        let newData;
        if (-1 !== index) {
            G['data'].splice(index, 1);
            localStorage.setItem('pageData', JSON.stringify(G['data']));
            document.getElementById(`ifr_${item}`).remove();
            reconstruct(G['data']);
        }
    } else {
        console.log('localStorage is required. Your browser does not support')
    }
}

// Re-construct
function reconstruct (data, alldom) {
    if (data.length) {
        if (alldom) genDom(data);
        genOption(data);
    }
}

function resetDefault () {
    window.localStorage.setItem('isReturn', false);
    G['data'] = loadDefault();
    reconstruct(G['data'], true);
}

// Entry Point
if (window.localStorage) {
    if (checkFirst()) {
        G['data'] = loadDefault();
        window.localStorage.setItem('isReturn', true);
    } else {
        G['data'] = loadPrevious();
    }

    reconstruct(G['data'], true);
} else {
    console.log('localStorage is required. Your browser does not support')
}

let toggleContEl = document.getElementById('toggleCont');
let toggleTargetEl = document.getElementById('toggleTarget');
toggleContEl.addEventListener('click', function (e) {
    toggleTargetEl.classList.toggle('hide');
}, false);


