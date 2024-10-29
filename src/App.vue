<template>
    <NavPage />
    <router-view />
</template>

<script>
// import ToDos from './components/ToDo.vue';
import NavPage from './components/NavPage.vue';


export default {
  name: 'App',
  components: {
    NavPage,

  },
};
</script>

