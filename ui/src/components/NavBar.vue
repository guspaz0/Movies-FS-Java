<script setup lang="ts">
const menu = [
  { href: "/", nombre: "Inicio" },
  { href: "/peliculas", nombre: "Peliculas" },
  { href: "/nosotros", nombre: "Nosotros" },
  { href: "/login", nombre: "Iniciar Sesion" },
];
</script>

<template>
  <header class="bg-color">
    <div class="container-fluid">
      <div class="card-group">
        <div class="row align">
          <div class="col" style="max-width: 300px">
            <router-link v-bind:to="'/'">
              <img
                src="https://res.cloudinary.com/dbowsjk6p/image/upload/v1720063400/channels4_profile_ddj5g3.jpg"
                jsaction="VQAsE"
                class="sFlh5c pT0Scc iPVvYb"
                style="
                  max-width: 1801px;
                  height: 107px;
                  margin: 10px 0px;
                  width: 236px;
                "
                alt="Codo a codo🚀"
                jsname="kn3ccd"
              />
            </router-link>
          </div>
          <div class="col">
            <br />
            <h1>Peliculas y Series</h1>
          </div>
          <ul class="col">
            <li v-for="list in menu" class="btn">
              <router-link v-bind:to="list.href">{{ list.nombre }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
  <hr />
</template>
