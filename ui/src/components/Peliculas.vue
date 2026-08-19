<template>
    <link href="/css/pelicula.css" rel="stylesheet"/>
    <main>
        <div class="popup"></div>
        <div class="container">
            <div class="forms">
                <fieldset>
                    <legend>Origen</legend>
                    <label for="terceros">Terceros
                        <input @click="handleorigin"  id="terceros" type="radio" name="origen" value="terceros"/>
                    </label>
                    <label for="local">Local
                        <input @click="handleorigin" id="local" type="radio" name="origen" value="local" checked/>
                    </label>
                </fieldset>
                <form>
                    
                    <button v-on:click.prevent="handleSearch" class="btn">
                        <label for="searchMovie">Buscar:</label>
                        <input v-model="search" id="searchMovie" type="search" name="search"/>
                        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                    </button>
                </form>
                <button id="addMovie" class="btn">
                    <router-link v-bind:to="'/peliculas/add'">Agregar Pelicula</router-link>
                </button>
            </div>
            <div id="pagination" class="pagination">
                <button @click="handlePage" id="previous" class="pagination" :disabled="page == 1">Anterior</button>
                <button @click="handlePage" id="next" class="pagination" :disabled="page == Movies.total_pages">Siguiente</button>
                <small v-if="Movies.page">Pagina <b>{{ Movies.page }}</b> de <b>{{ Movies.total_pages }}</b>. mostrando {{ Movies.results.length }} elementos por pagina</small>
            </div>
                <div v-if="Movies.results.length > 0" className="contenedor-cartas">
                <CardPelicula v-for="movie in Movies.results" :origen="origen" :key="movie.id+movie.title":movie="movie"/>
            </div>
            <div v-else="results.length == 0" className="cards-container"> Error al hacer la peticion del API</div>
        </div>
    </main>
</template>

<script setup lang="ts">
import {ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import {fetchData} from '../utils/utils'
import CardPelicula from './CardPelicula.vue'
import type { MovieList } from '../utils/types'

const router = useRouter()

let endpoint = '/movies?page='
let origen = ref<'local' | 'terceros'>('local')
let page = ref(1)
let search = ref('')
let searchQuery = ''


let Movies = ref<MovieList>({results: []})

onMounted(async ()=> {
    try {
        Movies.value = await fetchData(origen.value,endpoint+page.value)
    } catch (e) {console.log(e)}
})
watch(search,(_oldVal: any, newVal: any)=>{
    if (newVal.length > 1) searchQuery = newVal
})
watch(origen, async (_newp: any) => {
    try {
        page.value=1
        router.push({path: 'peliculas', query: {page: page.value}})
        Movies.value = await fetchData(origen.value,endpoint+page.value) ?? Movies.value
    } catch (e) {console.log(e)}
})
watch(page, async (_newPage: any) =>{
    try {
        router.push({path: 'peliculas', query: {page: page.value}})
        Movies.value = await fetchData(origen.value,endpoint+page.value) ?? Movies.value
    } catch (e) {console.log(e)}
})
function handlePage(e: any) {
    e.preventDefault()
    if (e.target.id == "next") {
        if (page.value < (Movies.value.total_pages ?? 1)) {
            page.value++
            router.push({path: 'peliculas', query: {page: page.value}})
        }
    }
    if (e.target.id == "previous") {
        if (page.value > 1){
            page.value--
            router.push({path: 'peliculas', query: {page: page.value}})
        }
    }
}
function handleorigin(event: any){
    let {checked, value} = event.target
    if (value == 'local' && checked) endpoint = "/movies?page="
    if (value == 'terceros' && checked) endpoint = "/movie/popular?page="
    origen.value = value
}
async function handleSearch(_e: any){
    try {
        if (origen.value == 'terceros') {
            endpoint = `/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=`
            if (page.value == 1) {
                Movies.value = await fetchData(origen.value,endpoint+page.value)
            }
            else page.value = 1
        }
        else if (origen.value == 'local') {
            endpoint = `/movies?search=${searchQuery}&page=`
            if (page.value == 1) {
                Movies.value = await fetchData(origen.value,endpoint+page.value)
            }
            else page.value = 1
        }
    } catch (e) {console.log(e)}
}

</script>