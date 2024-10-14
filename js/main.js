function fadeInPatreonButtons() {
//     wait 1 second
    setTimeout(() => {
//         fade in the patreon buttons
        document.querySelector('.patreon').style.opacity = 1;
    }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchVisits("modrinth");
    fadeInPatreonButtons();
});

document.addEventListener('DOMContentLoaded', function() {
    const patreonLink = document.querySelector('.patreon');
    let tooltip;

    // Create the tooltip element once
    tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.innerHTML = 'Join for early access and to support me!';
    tooltip.style.position = 'absolute';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.5s ease';
    tooltip.style.pointerEvents = 'none';

    document.body.appendChild(tooltip);

    patreonLink.addEventListener('mouseover', function() {
        const rect = patreonLink.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;

        // match the opacity of the document.querySelector('.patreon').style.opacity, in account for the transition
        let opacity = window.getComputedStyle(document.querySelector('.patreon')).getPropertyValue('opacity');
        // offset opacity by transition progress
        opacity = Math.min(1, parseFloat(opacity) );
        // keep updating if the opacity is not yet 1
        if (opacity < 1) {
            setTimeout(() => {
                patreonLink.dispatchEvent(new MouseEvent('mouseover'));
            }, 50);
        }

        tooltip.style.opacity = opacity;
    });

    patreonLink.addEventListener('mouseout', function() {
        tooltip.style.opacity = '0';
    });
});


document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.github.com/repos/coderx-gamer/ui-utils/releases/latest')
        .then(response => response.json())
        .then(data => {
            const release = data;

            const releaseDate = new Date(release.published_at);
            const daysOld = Math.ceil((new Date() - releaseDate) / (1000 * 60 * 60 * 24));

            let md = marked.setOptions({
                renderer: new marked.Renderer(),
                pedantic: false,
                gfm: true,
                sanitize: false,
                smartLists: true,
                smartypants: false,
                xhtml: false,
                breaks: false,
            });

            let releaseBodyHtml = md(release.body);
            // Remove all <br>, <br/>, <br /> and line breaks from the HTML
            releaseBodyHtml = releaseBodyHtml.replace(/<br\s*\/?>/gi, '').replace(/(\r\n|\n|\r)/gm, '');

            // Update .release-info with Markdown content
            document.querySelector('.release-info').innerHTML = `
                        Version: ${release.tag_name}<br>
                        ${releaseBodyHtml}
                        <br>Released ${daysOld} days ago<br>
                    `;

            // Update the main download element
            const mainDownloadElement = document.getElementById('main-download-text');
            mainDownloadElement.innerHTML = `${release.name} Download!`;
        })
        .catch(error => console.error('Error fetching latest release:', error));
});

function fetchVisits(version) {
    // collect referral parameters
    const urlParams = new URLSearchParams(window.location.search);
    let urlParamsString = '';

    urlParams.forEach((value, key) => {
        urlParamsString += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });

    // imagine paying for a server instead of using google scripts
    const requestUrl = `https://script.google.com/macros/s/AKfycbxzE2THSYV6FFh11a6FJSedyxtkL_L56NzWHfY6Ahzi8z8xL0fhuhNEv5Sep2buu-7vIA/exec?callback=handleResponse&jsonData={"action":"get_downloads","version":"${version}"}${urlParamsString}`;

    fetch(requestUrl)
        .then(response => response.text())
        .then(data => {
            const totalVisits = JSON.parse(data.match(/handleResponse\((.*)\)/)[1]).page_visits;
            const totalVisitsElement = document.querySelector('.total-visits');

            totalVisitsElement.innerHTML = `This page has been visited <b><u>${totalVisits}</u></b> times.`;
            totalVisitsElement.style.color = "#ff00fa";
        })
        .catch(error => console.error('Error fetching total visits:', error));
}
