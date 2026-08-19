<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import Pie from './components/Pie.vue'
</script>

<template>
  <NavBar />
  <router-view></router-view>
  <Pie />
</template>
