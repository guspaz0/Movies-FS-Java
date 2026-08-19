<template>
    <main>
        <link href="/css/login.css" rel="stylesheet"/>
    <div class="container aos-init aos-animate" data-aos='zoom-in' data-aos-duration='1000' >
        <form v-on:submit.prevent="handleSubmit">
            <fieldset>
                <legend>
                    <label for="username">Usuario/Correo
                        <font-awesome-icon :icon="['fas', 'at']" size="lg"/>
                    </label>
                </legend>
                <input v-model="form.username" type="text" id="username" name="username"/>
                <small v-if="errors.username" class="error">{{ errors.username }}</small>
            </fieldset>
            <fieldset>
                <legend>
                    <label for="password">Contraseña <font-awesome-icon :icon="['fas','user-secret']" size="lg"/> </label>
                </legend>
                <span>
                    <input v-model="form.password" type="password" id="password" name="password"/>
                    
                </span>
                <small v-if="errors.password" class="error">{{ errors.password }}</small>
            </fieldset>
            <input id="submit" name="submit" type="submit"/>
        </form>
        <popUp v-if="Object.keys(popUpData).some(x => popUpData[x].length > 0)" :popUpData="popUpData" @setPopUp="setPopUp"/>
        <p><router-link v-bind:to="'/register'">Registrate</router-link></p>
    </div>
    </main>
</template>
<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import fetchData from '../utils/utils';
import popUp from './popUp.vue'

let form = reactive({
    username: '',
    password: ''
})

let errors = ref<Record<string, string>>({
    username: '',
    password: ''
})

watch(()=>form.username,(value) => {
    errors.value.username = ''
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.length < 2) errors.value.username = "El nombre de usuario debe tener mas de 3 digitos"
    else if(!regex.test(value)) errors.value.username = "Debe ser un email valido"
})
watch(()=>form.password,(value) => {
    errors.value.password = ''
    if (value.length == 0) errors.value.password = "El campo no puede estar vacio"
})

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
        } else {
            let user = await fetchData('local','/users/login','POST', form)
            if ((user as { id?: number })?.id) {
                sessionStorage.setItem('userData', JSON.stringify(user))
                popUpData.value = {message: `Bienvenido ${(user as { name?: string }).name}!`, second: '2', redirect: '/'}
            }
        }

    } catch (error) {
        console.log(error)
    }
}

</script>