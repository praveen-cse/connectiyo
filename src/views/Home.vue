<template>
  <div class="home">
    <h1>Connectiyo</h1>
    <h2> - A way to connect people</h2>
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>
</script>
<style>
h1{
  font-size :50px;
  font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  color : red;
}
h2{
  margin-left : 200px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  color : orange;
}
html{
    width : 100%;
    height : 100%;
  padding : 50px;
  font-size : 23px;
}
label {
    margin-left : 100px;
    margin-right:0.5em;
    text-align:center;
    font-weight:bold;
}
button {
    color: #20bf6b !important;
    text-transform: uppercase;
    background: #ffffff;
    padding: 20px;
    border: 4px solid #20bf6b !important;
    border-radius: 6px;
    display: inline-block;
    }

button:hover 
{
        color: #494949 !important;
        border-radius: 50px;
        border-color: #494949 !important;
        transition: all 0.3s ease 0s;
} 
legend {
    padding: 0.2em 0.5em;
    border:1px solid black;
    color:rgb(5, 5, 5);
    font-size:90%;
    text-align:center;
    font-size: 20px;
}
</style>
