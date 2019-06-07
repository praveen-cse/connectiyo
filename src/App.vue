<template>
  <div id="app">
    <link rel="stylesheet"  href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"  media="screen">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to='/signup'>Signup</router-link> | 
      <router-link to='/feed'>Feed</router-link> |
      <router-link to='/tag_search'>Tag Search</router-link> | 
      <router-link to='/add_question'>Post Question</router-link> |
      <router-link to='/favourites'>Favourites List</router-link> | 
      <router-link to='/read-later'>Read Later</router-link> |
      <router-link to='/profile'>Profile</router-link> |
      <router-link to='/edit-profile'>Edit Profile</router-link> |
      <router-link to='/logout'>Logout</router-link> |
      <!-- <router-link to='/survey'>Survey</router-link> -->
    </div>
    <router-view/>
  </div>
</template>
<script lang="ts">
export default {
  name: 'App'
};
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: black;
  border : 5px solid black;
  background:cornsilk;
  width : 80%;
  margin-left : 100px;
  padding : 30px;
  }
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: black;
    background: transparent;
    &.router-link-exact-active {
      color: blue;
    }
  }
}
</style>
