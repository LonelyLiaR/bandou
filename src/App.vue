<template>
  <div id="app" v-cloak>
    <div data-reactroot>
      <div class="app-container">
        <fixed-header v-if="subjectsLength > 0"></fixed-header>
        <router-view v-if="subjectsLength > 0" :style="{transform: `translate3d(0px, ${Y}%, 0px)`}"></router-view>
        <error v-if="Error"></error>
        <down-button v-if="subjectsLength > 0"></down-button>
      </div>
    </div>
  </div>
</template>

<script>
  import './assets/style/common.min.css';
  import TWEEN from '@tweenjs/tween.js';
  import fixedHeader from './components/header';
  import downButton from './components/common/downButton';
  import error from './components/error';
  export default {
    name: 'app',
    computed: {
      subjectsLength() {
        return this.$store.getters[`${this.$route.params.kind}SubjectsLength`];
      },
      Y() {
        return this.$store.state.Y;
      },
      Error() {
        return this.$store.state.Error;
      }
    },
    components: {
      fixedHeader,
      downButton,
      error
    }
  }
</script>