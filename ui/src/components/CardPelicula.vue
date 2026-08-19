<template>
    <div class="cardMovie">
        <router-link v-bind:to="'/peliculas/'+origen+'/'+movie.id">
            <div class="tituloPelicula">
                <h4>{{movie.title}}</h4>
                <img class="imgTendencia" 
                    v-bind:src="origen == 'local'? movie.image : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`" 
                    v-bind:alt="movie.title"
                />
            </div>
        </router-link>
    </div>
</template>

<script setup lang="ts">
defineProps(['movie', 'origen'])


</script>