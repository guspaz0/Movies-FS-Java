<template>
    <main>
    <link href="/css/addPelicula.css" rel="stylesheet"/>
    <link href="/css/popUp.css" rel="stylesheet"/>
    <div class="container">
        <form v-on:submit.prevent="handleSubmit" id="addMovie">
            <h2>Formulario de Pelicula</h2>
            <div class="container-inputs">
            <span class="container-data">
                <span v-for="input in Object.keys(form).filter(x => form[x].constructor !== Array)">
                    <label :for="input"><b>{{ labels[input] }}</b></label>
                    <textarea v-if="input == 'overview'" v-model.trim="form[input]" :id="input" :name="input"></textarea>
                    <input v-else v-model.trim="form[input]" v-bind:type="input == 'release_date'? 'date' : 'text'" :id="input" :name="input"/>
                    <small v-if="errors[input]" class="error">{{ errors[input] }}</small>
                </span>
            </span>
            <fieldset >
                <legend><b>Generos:</b></legend>
                <div id="genres">
                    <small v-if="errors.genres" class="error">{{ errors.genres }}</small>
                    <span v-for="genre in Genres">
                        <input v-model.trim="form.genres" type="checkbox" :id="genre.name" :value="genre.id"/>
                        <label :for="genre.name">{{ genre.name }}</label>
                    </span>
                </div>
            </fieldset>
            </div>
            <input id="submit" name="submit" type="submit"/>
        </form>
    </div>
    <popUp v-if="Object.keys(popUpData).some(x => popUpData[x].length > 0)" :popUpData="popUpData" @setPopUp="setPopUp"/>
    </main>
</template>
<script setup lang="ts">
import {ref, watch, reactive, onMounted } from 'vue'
import {fetchData} from '../utils/utils'
import type { Genre } from '../utils/types'

let Genres = ref<Genre[]>([])

let form = reactive<Record<string, string | string[]>>({
    title: '',
    short_overview: '',
    image: '',
    background_image: '',
    overview: '',
    release_date: '',
    genres: []
})

let labels: Record<string, string> = {
    title: 'Titulo',
    short_overview: 'Reseña',
    image: 'Imange',
    background_image: 'Imagen de fondo',
    overview: 'Sinopsis',
    release_date: 'Fecha lanzamiento',
}
let errors = ref<Record<string, string>>({
    title: '',
    short_overview: '',
    image: '',
    background_image: '',
    overview: '',
    release_date: '',
    genres: ''
})

onMounted(async ()=>{
    try {
        Genres.value = await fetchData('local','/genres')
    } catch (error) {console.log(error)}
})
watch(()=> form.title,(value)=> {
    errors.value.title = ''
    if(value.length == 0) errors.value.title = "Titulo no puede estar vacio"
    if(value.length > 30) errors.value.title = "Titulo debe tener menos de 30 caracteres"
},{immediate: true})
watch(()=> form.short_overview,(value)=> {
    errors.value.short_overview = ''
    if(value.length == 0) errors.value.short_overview = "Reseña no puede estar vacio"
    if(value.length > 30) errors.value.short_overview = "Reseña debe tener menos de 30 caracteres"
},{immediate: true})
watch(()=> form.image,(value)=> {
    errors.value.image = ''
    if(value.length == 0) errors.value.image = "Imagen no puede estar vacio"
},{immediate: true})
watch(()=> form.background_image,(value)=> {
    errors.value.background_image = ''
    if(value.length == 0) errors.value.background_image = "Imagen de fondo no puede estar vacio"
},{immediate: true})
watch(()=> form.overview,(value)=> {
    errors.value.overview = ''
    if(value.length == 0) errors.value.overview = "Sinopsis no puede estar vacio"
    if(value.length > 250) errors.value.overview = "Sinopsis no puede tener mas de 250 caracteres"
},{immediate: true})
watch(()=> form.release_date,(value)=> {
    errors.value.release_date = ''
    if(value.length == 0) errors.value.release_date = "Fecha de lanzamiento no puede estar vacio"
    if(value.length != 10) errors.value.release_date = "formato de fecha invalido"
},{immediate: true})
watch(()=> form.genres,(value)=> {
    errors.value.genres = ''
    if(value.length == 0) errors.value.genres = "Seleccione al menos un genero"
},{immediate: true})

let popUpData = ref<Record<string, string>>({
    message: '',
    redirect: '',
    second: '0'
})

function setPopUp(){
    popUpData.value = {
        message: '',
        redirect: '',
        second: ''
    }   
}

async function handleSubmit(){
    try {
        if(Object.keys(errors.value).some(x => errors.value[x].length > 0)) {
            popUpData.value.message = 'Corregir los errores del formulario'
        }
        else {
            let newMovie = await fetchData('local','/movies', 'POST', form)
            if ((newMovie as { id?: number })?.id) {
                popUpData.value = {message: "Pelicula creada con exito", second: '5', redirect: '/peliculas'}
            }
        }
    } catch (error) {
        console.log(error)
    }
} 
</script>

