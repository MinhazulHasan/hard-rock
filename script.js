const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const displayLyrics = document.getElementById('displayLyrics');

const apiURL = 'https://api.lyrics.ovh';

// Search by song or artist
async function searchSongs(term) {
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();
    // console.log(data);
    if(data.data.length == 0){
        result.innerHTML = `<h2 class="d-flex justify-content-center">Your keyword does not match any song 😒</h2>`;
    }
    else{
        showData(data);
    }
}

// Showing the search result
function showData(data) {
    let output = '';
    data.data.slice(0,10).forEach( song => {
        output += `
            <li>
                <div class="single-result row align-items-center my-3 p-3">
                    <div class="col-md-9">
                        <h3 class="lyrics-name">${song.title}</h3>
                        <p class="author lead">Album : <span>${song.album.title}</span></p>
                        <p class="author lead">Artist : <span>${song.artist.name}</span></p>
                    </div>
                    <div class="col-md-3 text-md-right text-center">
                        <button class="btn btn-success my-btn" data-image="${song.album.cover}" data-artist="${song.artist.name}" data-songtitle="${song.title}" data-toggle="modal" data-target=".bd-example-modal-lg">Get Lyrics</button>
                    </div>
                </div>
            </li>
        `;
    });

    result.innerHTML = `
        <ul class="songs">
            ${output}
        </ul>
    `;
}

// Showing the lyrics
async function getLyrics(artist, songTitle, img) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
    // console.log(data);
    if(data.error){
        displayLyrics.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 style="color: black;" class="modal-title" id="exampleModalLongTitle"><strong>${songTitle}</strong><br> Album by - ${artist}</h3>
                </div>
                <div class="modal-body d-flex justify-content-center" style="color: black;">
                    <h3>SORRY!!! Lyrics Not Found 😭😭😭</h3>
                </div>
                <div class="modal-footer">
                    <button onclick="displayLyrics.reset()" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        `;
    }
    else{
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
        displayLyrics.innerHTML = `
            <div class="modal-content">
                <div class="modal-header d-flex justify-content-between align-items-center">                    
                    <h3 style="color: black;" class="modal-title" id="exampleModalLongTitle"><strong>${songTitle}</strong><br> Album by - ${artist}</h3>                    
                    <img class="rounded-circle img-thumbnail" src="${img}" alt="😎">
                </div>
                <div class="modal-body d-flex justify-content-center" style="color: black;">
                    <span class="lyrics">${lyrics}</span>
                </div>
                <div class="modal-footer">
                    <button onclick="displayLyrics.reset()" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        `;
    }
}


// ________________Event Listener_________________

// Search For Song
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();
    if (!searchTerm) {
        result.innerHTML = `<h2 class="d-flex justify-content-center">Please type in a search term 😕</h2>`;
    }
    else {
        searchSongs(searchTerm);
        form.reset();
    }
});

// Get lyrics button click
result.addEventListener('click', e => {
    const clickedEl = e.target;
    if (clickedEl.tagName == 'BUTTON') {
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songtitle');
        const img = clickedEl.getAttribute('data-image');
        // console.log(artist, songTitle);
        getLyrics(artist, songTitle, img);
    }
})