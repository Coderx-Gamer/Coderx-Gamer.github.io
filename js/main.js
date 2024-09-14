document.addEventListener('DOMContentLoaded', () => {
    fetchVisits("modrinth");
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
