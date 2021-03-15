<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { db } from './api/cloud'
export default {
  name: 'App',
  mounted() {
    db.collection('role')
      .get()
      .then(res => {
        console.log(res)
      })
  }
}
</script>
