import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
import popUp from './components/popUp.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faStar, faUserSecret, faAt, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faTwitter, faInstagram, faFacebook, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faStar,farStar,faMagnifyingGlass,faAt,faUserSecret, faTwitter, faInstagram, faFacebook, faLinkedin, faWhatsapp)


const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('PopUp', popUp)
app.use(Router)
app.mount('#app')
