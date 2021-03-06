const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiUrl = `https://api.lyrics.ovh`

const getMoreSongs = async url => {                                            
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`) //Usando proxy para nao cai no cors
    const data = await response.json()

    insertSongsIntoPage(data)
}

const insertSongsIntoPage = songsInfo => {
    songsContainer.innerHTML = songsInfo.data.map(song => `
        <li class="song">
            <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
            <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
        </li>
    `).join('')

    if(songsInfo.prev || songsInfo.next){
        prevAndNextContainer.innerHTML = `
            ${songsInfo.prev ? `<button class="btn" onclick="getMoreSongs('${songsInfo.prev}')"> Anteriores </button>` : ""}
            ${songsInfo.next ? `<button class="btn" onClick="getMoreSongs('${songsInfo.next}')"> Proximas </button>` : ""}
        `
        return
    }
    prevAndNextContainer.innerHTML = ''
}

const fetchSongs = async term => {
    const response = await fetch(`${apiUrl}/suggest/${term}`)
    const data = await response.json()

    insertSongsIntoPage(data)
}

form.addEventListener('submit', event => {
    event.preventDefault()           //Evitar Page Reflesh

    const searchTerm = searchInput
        .value                       //Pega só o valor digitado no input
        .trim()                      //Remove espaço em branco do começo e do final da string
    searchInput.value=""
    searchInput.focus()

    if(!searchTerm){                 //Tratamento caso string vazia
        songsContainer.innerHTML = `<li class='warning-message'>Por favor, digite um termo valido</li>`
        return
    }

    fetchSongs(searchTerm)
})

const fetchLyrics = async (artist, songTitle) => {
    const response = await fetch(`${apiUrl}/v1/${artist}/${songTitle}`)
    const data = await response.json()
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

    songsContainer.innerHTML = `
        <li class="lyrics-container">
            <h2><strong>${songTitle}</strong> - ${artist}</h2>
            <p class="lyrics">${lyrics}</p>
        </li>
    `
}

songsContainer.addEventListener('click', event => {
    const clickedElement = event.target
    
    if(clickedElement.tagName == 'BUTTON'){
        const artist = clickedElement.getAttribute('data-artist')
        const songTitle = clickedElement.getAttribute('data-song-title')

        prevAndNextContainer.innerHTML = ""
        fetchLyrics(artist, songTitle)
    }
})