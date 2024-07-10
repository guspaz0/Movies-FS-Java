async function fetchData(endpoint) {
    try {
        const res = await fetch(`http://${window.location.host}${endpoint}`, {
            method: 'GET',
            headers: { accept: 'application/json' }
        })
        const data = await res.json()
        return data
    } catch(error) {
        popUp("Error en la peticion al servidor")
        console.log(error)
    }
}

const divGenres = document.querySelector("div#genres")
fetchData("/genres").then(genres => {
    genres.forEach(({id,name}) => {
        const checkbox = `<span>
            <input id="${name}" type="checkbox" name="genres" value="${id}"/>
            <label for="${name}">${name}</label>
        </span>`
        divGenres.insertAdjacentHTML('beforeend',checkbox)
    })
})

let errors = {}
const form = document.querySelector("form#addMovie");

function validateForm(input){
    let {title, image, background_image, overview, release_date, genres} = form
    if (errors[input]) {
        delete errors[input]
        if (document.querySelector(`small#error${input}`)) document.querySelector(`small#error${input}`).remove()
    }
    switch(input) {
        case 'title':
            if(title.value.length == 0) errors.title = "Titulo no puede estar vacio"
            if(title.value.length > 30) errors.title = "Titulo debe tener menos de 30 caracteres"
            break
        case 'image':
            if(image.value.length == 0) errors.image = "Imagen no puede estar vacio"
            break
        case 'background_image':
            if(background_image.value.length == 0) errors.background_image = "Imagen de fondo no puede estar vacio"
            break
        case 'overview':
            if(overview.value.length == 0) errors.overview = "Sinopsis no puede estar vacio"
            if(overview.value.length > 250) errors.overview = "Sinopsis no puede tener mas de 250 caracteres"
            break
        case 'release_date':
            if(release_date.value.length == 0) errors.release_date = "Fecha de lanzamiento no puede estar vacio"
            if(release_date.valueAsDate == null) errors.release_date = "ingresar una fecha"
            if(release_date.value.length != 10) errors.release_date = "formato de fecha invalido"
            break
        case 'genres':
            if (Array.from(genres).filter(genre => genre.checked).length == 0) errors.genres = "Seleccione al menos un genero"
            break
        default:
            break
    }
    if (errors[input]) {
        let errorTag = `<small id="error${input}" class="error">${errors[input]}</small>`
        if (input == "genres") document.querySelector(`input[name='${input}']`).parentNode.insertAdjacentHTML('beforebegin', errorTag)
        else document.querySelector(`input[name='${input}']`).insertAdjacentHTML('afterend', errorTag)

    }
}

window.onload = ()=> {
    Array.from(form).forEach(input => {
        input.oninput = ()=> {validateForm(input.name)}
        input.onblur = ()=> {validateForm(input.name)}
        input.onchange = ()=> {validateForm(input.name)}
    })
    form.onsubmit = async (e) => {
        e.preventDefault()
        Array.from(form).forEach(input => validateForm(input.name))
        if (Object.keys(errors).length > 0) popUp("Corregir Errores del formulario")
        else {
            try {
                const formData = {
                    title: form.title.value,
                    image: form.image.value,
                    background_image: form.background_image.value,
                    overview: form.overview.value,
                    release_date: form.release_date.value,
                    genres: Array.from(form.genres).filter(genre => genre.checked).map(genre => +genre.value)
                }
                const resp = await fetch(`http://${window.location.host}/movies`, {
                    method: 'POST',
                    headers: { accept: 'application/json' },
                    body: JSON.stringify(formData)
                })
                if(resp.status != 201) {
                    console.log(resp)
                    popUp("Error en al procesar el formulario")
                } else {
                    const data = await resp.json()
                    popUpRedirect("Pelicula creada con exito",5,"/peliculas.html")
                }
            } catch(e) {console.log(e)}
        }
    }
}
