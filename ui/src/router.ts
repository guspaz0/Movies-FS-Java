import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Peliculas from './components/Peliculas.vue'
import MovieDetail from './components/MovieDetail.vue'
import PeliculaForm from './components/PeliculaForm.vue'
import Nosotros from './components/Nosotros.vue'
import UserForm from './components/UserForm.vue'
import Login from './components/Login.vue'

const routes = [
    {path: '/', name: 'Home', component: Home},
    {path: '/peliculas', name: 'Peliculas', component: Peliculas},
    {path: '/peliculas/add', name: 'PeliculaForm', component: PeliculaForm},
    {path: '/peliculas/:origen/:id', name: 'MovieDetail', component: MovieDetail},
    {path: '/nosotros', name: 'Nosotros', component: Nosotros},
    {path: '/register', name: 'UserForm', component: UserForm},
    {path: '/login', name: 'Iniciar Sesion', component: Login}
]

const Router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default Router