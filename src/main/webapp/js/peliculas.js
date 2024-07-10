// Función para crear elementos HTML
const createElement = (tag, className, attributes = {}) => {
    // Creamos un nuevo elemento HTML del tipo especificado (tag)
    const element = document.createElement(tag);
    
    // Si se especificó una clase, la añadimos al elemento
    if (className) {
        element.classList.add(className);
    }
    
    // Iteramos sobre los atributos pasados como argumento y los añadimos al elemento
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    
    // Devolvemos el elemento creado
    return element;
};

const cardContainer = document.querySelector('.contenedor-cartas')

let url = new URL(window.location)
let params = new URLSearchParams(url.search)
params.set('page', 1)
let page = params.get('page')
params.set('endpoint', `/movie/popular?page=`)
let endpoint = params.get('endpoint')
let maxPage;

const prevPage = document.querySelector('button[id="previous"]')
prevPage.onclick = () => {
    if (+page <= 1) prevPage.disabled = true;
    else {
        prevPage.disabled = false;
        page = +page-1
        params.set('page', page)
        handleCards(endpoint+page)
        console.log(params.get('page'))
    }
}
const nextPage = document.querySelector('button[id="next"]')
nextPage.onclick = () => {
    if (+page == maxPage) nextPage.disabled = true;
    else {
        nextPage.disabled = false;
        page = +page+1
        params.set('page', page)
        handleCards(endpoint+page)
        console.log(params.get('page'))
    }
}

let API_origen;

window.onload = async () => {
    try {
        const origen = document.querySelectorAll('input[type="radio"][name="origen"]')
        Array.from(origen).forEach(origen => {
            if (origen.checked) API_origen = origen.value
            if (origen.value == "local") endpoint = '/movies?page='
            origen.onchange = () => {
                if (origen.checked && origen.value == "local") {
                    API_origen = origen.value
                    endpoint = '/movies?page='
                } else if (origen.checked && origen.value == "terceros") {
                    API_origen = origen.value
                    endpoint = '/movie/popular?page='
                }
                const paginationButtons = document.querySelectorAll("button.pagination")
                Array.from(paginationButtons).forEach((button)=> {
                    button.disabled = false
                    page = 1
                })
                handleCards(endpoint+page)
            }
        })
        handleCards(endpoint+page)
    } catch (err) {
        console.log(err)
        alert('hubo un error en la peticion al API')
    }
}

async function handleCards() {
    try {
        const data = await fetchData(endpoint+page)
        const pagination = document.querySelector('div#pagination')
        let paginasDetail;
        maxPage = data.total_pages
        if (document.querySelector('small#paginas')) {
            paginasDetail = document.querySelector('small#paginas')
            paginasDetail.innerHTML = `Pagina <b>${data.page}</b> de <b>${maxPage}</b>, mostrando ${data.results.length} elementos por pagina`
        } else {
            paginasDetail = `<small id="paginas">Pagina <b>${data.page}</b> de <b>${maxPage}</b>, mostrando ${data.results.length} elementos por pagina</small>`
            pagination.insertAdjacentHTML('beforeend',paginasDetail)
        }

        cardContainer.replaceChildren()
        data.results.forEach((movie) => {
            const pelicula = createElement('div', 'cardMovie', {
                'data-aos': 'zoom-in',
                'data-aos-duration': '1000',
                'aos-init': '',
                'aos-animate': '',
            });
            const img = createElement('img', 'imgTendencia', {
                src: API_origen == "local"? movie.image : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                alt: movie.title,
                loading: 'lazy'
            });
            const tituloPelicula = createElement('div', 'tituloPelicula');
            const titulo = createElement('h4', '');
            titulo.textContent = movie.title;
            tituloPelicula.appendChild(titulo)
            pelicula.onclick = (e) => {handleDetail(movie.id)}
            pelicula.append(tituloPelicula,img)

            cardContainer.appendChild(pelicula)
        });
    } catch (error) {
        console.log(error)
        alert('hubo un error en la peticion al API')
    }
}

async function fetchData(endpoint) {
    if (API_origen == "local") url=`http://${window.location.host}`
    else url = "https://api.themoviedb.org/3"
    try {
        const res = await fetch(`${url}${endpoint}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: API_origen == "local"? "" : 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTJjYTAwZDYxZWIzOTEyYjZlNzc4MDA4YWQ3ZmNjOCIsInN1YiI6IjYyODJmNmYwMTQ5NTY1MDA2NmI1NjlhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4MJSPDJhhpbHHJyNYBtH_uCZh4o0e3xGhZpcBIDy-Y8'
            }
        })
        const data = await res.json()
        return data
    } catch(error) {
        console.log(error)
    }
}

const form = document.querySelector('form')

form.onsubmit = async (e) => {
    e.preventDefault()
    try {
        const query = form.search.value 
        page = 1
        endpoint = API_origen == "local"? `/movies?search=${query}&page=` : `/search/movie?query=${query}&include_adult=false&language=en-US&page=`
        handleCards(endpoint+page)
    } catch(err) {
        console.log(err.message)
        alert('error al hacer la peticion')
    }
}

async function handleDetail (id) {
    try {
        const movie = await fetchData(API_origen=="local"? `/movies/${+id}` : `/movie/${+id}?language=en-US`)
        const containerDetail = createElement('div','movieDetail-container')
        const closeBtn = createElement('button','delete')
        closeBtn.innerHTML= 'volver'
        closeBtn.onclick = (e)=> {
            e.preventDefault()
            e.target.parentNode.parentNode.remove()
        }
        const pelicula = createElement('div', 'movieDetail', {
            'data-aos': 'zoom-in',
            'data-aos-duration': '1000',
            'aos-init': '',
            'aos-animate': '',
            style: `background-image: linear-gradient(to right top, rgba(109, 105, 105, 0.655), rgba(109, 105, 105, 0.655)), url(${API_origen=="local"? movie.background_image : `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`})`
        });

        const img = createElement('img', 'imgTendencia', {
            src: API_origen=="local"? movie.image : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            alt: movie.title,
            loading: 'lazy'
        });
        const tituloPelicula = createElement('div', 'tituloPelicula');
        const titulo = createElement('h4', '');
        titulo.textContent = movie.title;
        tituloPelicula.appendChild(titulo)
        const infoContainer = createElement('div','movieInfo')
        infoContainer.appendChild(img)
        let movieInfo = `<div>
        <p>${movie.overview}</p>
        <p>${movie.release_date}<b>Genres</b>`
        movie.genres.forEach(({name}) => movieInfo += `${name}, `)
        movieInfo += `</p></div>`
        infoContainer.innerHTML += movieInfo
        pelicula.append(closeBtn,tituloPelicula,infoContainer)
        containerDetail.appendChild(pelicula)
        document.body.appendChild(containerDetail)

    } catch (err) {
        console.log(err)
    }
}
