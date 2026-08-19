<template>
  <main>
    <nav>
      <!-- carrucel  -->
      <div id="carouselExampleCaptions" class="carousel slide">
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img
              src="https://res.cloudinary.com/dbowsjk6p/image/upload/v1722183598/dnb0a0zg5fsoecpduewm.jpg"
              class="d-block w-100"
              alt="Pelicula 1"
              loading="lazy"
            />
            <div class="carousel-caption d-none d-md-block">
              <h5>Pelicula 1</h5>
              <p>Peliculas de terror: suspenso y drama.</p>
            </div>
          </div>
          <div class="carousel-item">
            <img
              src="https://res.cloudinary.com/dbowsjk6p/image/upload/v1722183600/fxvgj8dnnix2zsz9c5st.jpg"
              class="d-block w-100"
              alt="pelicula 3"
              loading="lazy"
            />
            <div class="carousel-caption d-none d-md-block">
              <h5>Pelicula 2</h5>
              <p>Pelicula de comedia: diversion y drama.</p>
            </div>
          </div>
          <div class="carousel-item">
            <img
              src="https://res.cloudinary.com/dbowsjk6p/image/upload/v1722183593/zu66euzxcfgjnajj7tlx.jpg"
              class="d-block w-100"
              alt="pelicula"
              loading="lazy"
            />
            <div class="carousel-caption d-none d-md-block">
              <h5>PELICULA 3</h5>
              <p>Peliculas de terror: suspenso y drama.</p>
            </div>
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Atras</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Siguiente</span>
        </button>
      </div>
      <!-- final del carrucel  -->
    </nav>
    <hr />
    <!-- card -->
    <div class="container-fluid">
      <div class="row">
        <div class="card-group">
          <div
            class="card"
            v-if="Movies.results"
            v-for="movie in Movies.results.slice(0, 6)"
          >
            <router-link :to="'/peliculas/local/' + movie.id" class="card-body">
              <img
                :src="movie.image"
                class="card-img-top"
                :alt="movie.title"
                loading="lazy"
              />
              <h5 class="card-title">{{ movie.title }}</h5>
              <p class="card-text">{{ movie.short_overview }}</p>
              <p class="card-text">
                <small class="text-body-secondary"
                  >Pelicula calificada:
                  <span v-for="i in [0, 1, 2, 3, 4]">
                    <font-awesome-icon
                      v-if="i < (movie.stars ?? 0)"
                      :icon="['fas', 'star']"
                    />
                    <font-awesome-icon v-else :icon="['far', 'star']" />
                  </span>
                </small>
              </p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- final del card -->
    <!-- formulario de contacto -->
    <div class="contactanos">
      <div class="card" id="contacto">
        <div class="card-body">
          <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label"
              >Ingresa tu Email
            </label>
            <input
              type="email"
              class="form-control"
              id="exampleFormControlInput1"
              placeholder="name@example.com"
            />
          </div>
          <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label"
              >Ingresa tu consulta</label
            >
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
            ></textarea>
          </div>
          <div class="mb-3">
            <button type="button" class="btn btn-outline-warning">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- final del formulario de contacto -->
  </main>
  <hr />
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchData } from "../utils/utils";
import type { MovieList } from "../utils/types";

let Movies = ref<MovieList>({ results: [] });

onMounted(async () => {
  try {
    Movies.value = await fetchData("local", "/movies");
  } catch (error) {
    console.log(error);
  }
});
</script>
<style scoped>
.card {
  align-items: center;
}
.card-body {
  text-align: center;
}
.card-img-top {
  max-height: 200px;
  max-width: 200px;
}
</style>

