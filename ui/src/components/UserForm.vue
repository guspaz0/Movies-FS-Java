<template>
    <link href="/css/register.css" rel="stylesheet"/>
    <div class="container">
        <h2>Registrarse</h2>
        <form v-on:submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="name"><b>Nombre:</b></label>
                <input v-model="form.name" type="text" id="name" name="name">
                <small v-if="errors.name" class="error">{{ errors.name }}</small>
            </div>
            <div class="form-group">
                <label for="lastname"><b>Apellido:</b></label>
                <input v-model="form.lastname" type="text" id="lastname" name="lastname">
                <small v-if="errors.lastname" class="error">{{ errors.lastname }}</small>
            </div>
            <div class="form-group">
                <label for="gender"><b>Genero:</b></label>
                <select v-model="form.gender" id="gender" name="gender">
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="unknown">Otro</option>
                </select>
                <small v-if="errors.gender" class="error">{{ errors.gender }}</small>
            </div>
            <div class="form-group">
                <label for="birthdate"><b>Fecha Nacimiento:</b></label>
                <input v-model="form.birth_date" type="date" id="birthdate" name="birthdate">
                <small v-if="errors.birth_date" class="error">{{ errors.birth_date }}</small>
            </div>
            <div class="form-group">
                <label for="country"><b>País:</b></label>
                <select v-if="Countries.length > 0" v-model="form.country_code" id="country" name="country_code">
                    <option v-for="country in Countries" 
                        :value="country.cca2">
                        {{ country.name.nativeName.spa.common }}
                        <img :src="country.flags.png" :alt="country.cca2"/>
                    </option>
                </select>
                <small v-if="errors.country_code" class="error">{{ errors.country_code }}</small>
            </div>
            <div class="form-group">
                <label for="username"><b>Correo Electrónico:</b></label>
                <input v-model="form.username" type="text" id="username" name="username">
                <small v-if="errors.username" class="error">{{ errors.username }}</small>
            </div>
            <div class="form-group">
                <label for="password"><b>Contraseña:</b></label>
                <input v-model="form.contrasena" type="password" id="password" name="contrasena">
                <small v-if="errors.contrasena" class="error">{{ errors.contrasena }}</small>
            </div>
            <button type="submit">Registrarse</button>
        </form>
        <popUp v-if="Object.keys(popUpData).some(x => popUpData[x].length > 0)" :popUpData="popUpData" @setPopUp="setPopUp"/>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import { fetchData } from '../utils/utils'
import type { Country } from '../utils/types'

let Countries = ref<Country[]>([])

onMounted(async () => {
    try {
        let codes = ['CO','UY','PY','BO','CL','AR','VE','PE','EC'] // SOUTH AMERICA only
        const res = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes.join(',')}&fields=name,flags,cca2`)
        if (res.status == 200) {
            Countries.value = await res.json()
        }
    } catch (error) {console.log(error)}
})

let form = reactive({
    name: '',
    lastname: '',
    gender: '',
    birth_date: '',
    country_code: '',
    username: '',
    contrasena: ''
})

let errors = ref<Record<string, string>>({
    name: '',
    lastname: '',
    gender: '',
    birth_date: '',
    country_code: '',
    username: '',
    contrasena: ''
})

watch(()=>form.name,(value)=>{
    errors.value.name = ''
    if (value.length == 0) errors.value.name = "No puede estar vacio"
},{immediate: true})
watch(()=>form.lastname,(value)=>{
    errors.value.lastname = ''
    if (value.length == 0) errors.value.lastname = "No puede estar vacio"
},{immediate: true})
watch(()=>form.gender,(value)=>{
    errors.value.gender = ''
    if (value.length == 0) errors.value.gender = "Seleccionar opcion"
},{immediate: true})
watch(()=>form.birth_date,(value)=>{
    errors.value.birth_date = ''
    if (value.length == 0) errors.value.birth_date = "Seleccionar fecha"
},{immediate: true})
watch(()=>form.country_code,(value)=>{
    errors.value.country_code = ''
    if (value.length == 0) errors.value.country_code = "Seleccionar opcion"
},{immediate: true})
watch(()=>form.username,(value)=>{
    errors.value.username = ''
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.length < 2) errors.value.username = "El nombre de usuario debe tener mas de 3 digitos"
    else if(!regex.test(value)) errors.value.username = "Debe ser un email valido"
},{immediate: true})
watch(()=>form.contrasena,(value)=>{
    errors.value.contrasena = ''
    if (value.length == 0) errors.value.contrasena = "No puede estar vacio"
    if (value.length < 7) errors.value.contrasena = "Debe tener mas de 8 caracteres"
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
            let newUser = await fetchData('local','/users', 'POST', form)
            if ((newUser as { id?: number })?.id) {
                popUpData.value = {message: "Usuario registrado con exito", second: '5', redirect: '/login'}
            }
        }
    } catch (error) {console.log(error)}
}



</script>