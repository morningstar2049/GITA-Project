const search = document.querySelector('#search');
const btn = document.querySelector('#btn')
const moviesContainer = document.querySelector('#movies')
const BASE_IMG_PATH = "http://image.tmdb.org/t/p/w500/"


function getUrl(query) {
    return `https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${query}`
}

function valueOrNA(value, withDots) {
    const falsyValue = value === undefined || value === null || value === "";
    return !falsyValue ? (withDots ? value + "..." : value) : 'N/A'
}

const clearSearchValue = () => search.value = ""

function handleEmptyState() {
    alert(`${search.value} not found!`)
    clearSearchValue()
}

btn.onclick = () => fetchMovies()

search.onkeydown = (e) => {
    if (e.key === 'Enter') {
        fetchMovies()
    }
}

function fetchMovies() {
    fetch(getUrl(search.value))
        .then(response => response.json())
        .then(res => {
            if (res.results.length > 0) {
                renderMovies(res.results)
            } else {
                handleEmptyState()
            }
        })
        .catch((_) => alert("Cannot search with empty input!"))
}


function renderMovies(movies) {
    moviesContainer.innerHTML = ""
    movies.forEach(item => {
        const mainDiv = document.createElement('div')
        mainDiv.append(createImage(item.backdrop_path))
        mainDiv.append(createDescriptionWrapper(item))
        moviesContainer.append(mainDiv)
    })
    clearSearchValue()
}

function createImage(backDropPath) {
    const img = document.createElement('img');
    img.src = backDropPath ? BASE_IMG_PATH + backDropPath : 'images/noimage.png'
    const imgWrapper = document.createElement('div')
    imgWrapper.setAttribute('class', 'imgWrapper');
    imgWrapper.append(img)
    return imgWrapper;
}

function createDescriptionWrapper(movieItem) {
    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.setAttribute('class', 'title-wrapper')
    descriptionWrapper.innerHTML = `
        ${getTemplate(
        movieItem.overview?.slice(0, 100),
        movieItem.original_title || title,
        movieItem.release_date,
        movieItem.vote_average,
        movieItem.vote_count
    )}
   `
    return descriptionWrapper;
}
function getTemplate(
    overView,
    title,
    releaseDate,
    averageVotes,
    voteCounts
) {
    return `
    <div>
        <span class="title overview">OverView: </span>
        <span>${valueOrNA(overView, true)}</span>
    </div>
    <div>
        <span class="title">Title: </span>
        <span>${valueOrNA(title)}</span>
    </div>
    <div>
        <span class="title">Release Date:</span>
        <span>${valueOrNA(releaseDate)}</span>
    </div>
    <div>
        <span class="title">Average Vote:</span>
        <span>${valueOrNA(averageVotes)} </span>
    </div>
    <div>
        <span class="title">Votes:</span>
        <span>${valueOrNA(voteCounts)} </span>
    </div>
`
}