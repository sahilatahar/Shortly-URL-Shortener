const hamburgerBtn = document.querySelector('.hamburger__btn');
const navList = document.querySelector('.nav__list');
const urlForm = document.querySelector('.url__form');
const urlInput = document.getElementById('url__input');
const shortedContainer = document.querySelector('.shorted__container');
const errorMsg = document.querySelector('.input__error__msg');

let shortedLinks = [];

/* ========== Fetching Shorted Links from browser ========= */
shortedLinks = JSON.parse(localStorage.getItem('shortedLinks')) ?? [];

shortedLinks.forEach((shortLink) => appendShortedBox(shortLink));

/* ========== Toggle Navbar ========= */
hamburgerBtn.addEventListener('click', () => {
    navList.classList.toggle('show');
});

/* ========== Copy to clipboard function ========= */
function copyToClipboard(event, full_short_link) {
    const btn = event.target;
    btn.textContent = 'Copied!';
    btn.style.backgroundColor = 'var(--dark-violet)';

    navigator.clipboard.writeText(full_short_link);
}

/* ========== Function to append a short link box ========= */
function appendShortedBox(result) {
    const { full_short_link, short_link, original_link } = result;

    let shortedBox = document.createElement('div');
    shortedBox.className = 'shorted__box';

    let originalLink = document.createElement('a');
    originalLink.className = 'original__link';
    originalLink.href = original_link;
    originalLink.textContent = original_link;
    originalLink.target = '_blank';

    let shortLink = document.createElement('a');
    shortLink.className = 'shorted__link';
    shortLink.href = full_short_link;
    shortLink.textContent = short_link;
    shortLink.target = '_blank';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy__link__btn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', (e) => copyToClipboard(e, full_short_link));

    shortedBox.appendChild(originalLink);
    shortedBox.appendChild(shortLink);
    shortedBox.appendChild(copyBtn);

    shortedContainer.appendChild(shortedBox);
}

/* ========== On Form Submit ========= */
urlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (urlInput.value <= 0) {
        urlForm.classList.add('error');
        errorMsg.textContent = 'Please add a link';
        return;
    } else {
        urlForm.classList.remove('error');
    }

    try {
        const respond = await fetch(`https://api.shrtco.de/v2/shorten?url=${urlInput.value}`);
        let data = await respond.json();
        console.log(data);
        if (!data.ok) {
            urlForm.classList.add('error');
            if (data.error_code === 10) {
                errorMsg.textContent = 'Not allowed, try other link';
            } else {
                errorMsg.textContent = 'Please check your link';
            }
            return;
        }

        const { full_short_link, short_link, original_link } = data.result;

        shortedLinks.push({
            full_short_link: full_short_link,
            short_link: short_link,
            original_link: original_link
        });
        // Saving Data into browser
        localStorage.setItem('shortedLinks', JSON.stringify(shortedLinks));

        appendShortedBox(data.result);
    } catch (err) {
        console.log(err);
    }
});
