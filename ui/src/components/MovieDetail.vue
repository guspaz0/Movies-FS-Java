<template>
    <link href="/css/pelicula.css" rel="stylesheet"/>
    <div class="movieDetail-container">
        <div class="movieDetail" :style="{ backgroundImage: `linear-gradient(to right top, rgba(109, 105, 105, 0.655), rgba(109, 105, 105, 0.655)), url(${background_img})` }">
            <button @click="goBack" class="delete">Volver</button>
            <h4>{{ Movie.title }}</h4>
            <div class="movieInfo">
                    <img class="imgTendencia" v-bind:src="origen == 'local'? Movie.image : `https://image.tmdb.org/t/p/w500/${Movie.poster_path}`" v-bind:alt="Movie.title" loading="lazy"/>
                    <div>
                        <p>{{ Movie.overview }}</p>
                    <span>
                        <p><b>Fecha Lanzamiento:</b> {{ new Date(Movie.release_date ?? '').toLocaleString([],{ day: '2-digit', month: '2-digit', year: 'numeric'}) }}</p>
                        <b>Generos:</b>
                        <ul>
                            <li v-for="genre in Movie.genres">{{ genre.name }}</li>
                        </ul>
                        <span>
                            <b>Calificacion: </b>
                            <span v-for="i in [0,1,2,3,4]">
                                <span v-if="origen == 'local'">
                                    <font-awesome-icon v-if="i < (Movie.stars ?? 0)" :icon="['fas', 'star']" />
                                    <font-awesome-icon v-else :icon="['far', 'star']"/>
                                </span>
                                <span v-if="origen == 'terceros'">
                                    <font-awesome-icon v-if="i < Math.round((Movie.vote_average ?? 0)/10*5)" :icon="['fas', 'star']" />
                                    <font-awesome-icon v-else :icon="['far', 'star']"/>
                                </span>
                            </span>
                        </span>
                    </span>
                    </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import fetchData from '../utils/utils';
import type { Movie } from '../utils/types';

const route = useRoute()
const {origen, id} = route.params as { origen: string; id: string }

let Movie = ref<Movie>({} as Movie)
let background_img = ref('')


watch(Movie, ()=> {
    background_img.value = origen == 'local'? (Movie.value.background_image as string) : `https://image.tmdb.org/t/p/w500/${Movie.value.backdrop_path}`
})

function goBack(){history.back()}

onMounted(async()=>{
    try {
        Movie.value = await fetchData(origen as 'local' | 'terceros', origen=='local'? `/movies/${id}` : `/movie/${id}?language=en-US`)
    } catch(e){console.log(e)}
})
</script>
