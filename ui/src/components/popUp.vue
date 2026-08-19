<template>
    <link href="/css/popUp.css" rel="stylesheet"/>
    <span class="popupscreen">
        <div class="popUps" id="popUpDetailLogin">
            <h3>{{ popUpData.message }}</h3>
            <div class="botonPopup">
                <div class="botonPopup">
                    <p v-if="popUpData.redirect">
                        Redirigiendote en <b id="counter">{{ count }}</b>
                    </p>
                    <a v-else @click="popUpOff">Aceptar</a>
                </div>
            </div>
        </div>
    </span>
</template>
<script setup lang="ts">
import {ref, onMounted} from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

let props = defineProps(['popUpData'])
const emit = defineEmits(["setPopUp"]);

function popUpOff(){
    emit('setPopUp')
}
let count = ref(0)

onMounted(()=>{
    if(props.popUpData.second) {
        count.value = +props.popUpData.second
        startTimerRedirect()
    }
})

function startTimerRedirect() {
    const TIME_LIMIT = +count.value
    let timePassed = 0
    let timeLeft;
    let timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;

        count.value = timeLeft;
        if (timePassed == TIME_LIMIT) {
            router.push(props.popUpData.redirect)
            clearInterval(timerInterval)
        }
    }, 1000);
}

</script>