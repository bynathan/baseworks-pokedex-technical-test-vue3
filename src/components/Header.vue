<template>
    <RouterLink class="header" :to="'/'">
        <img src="/pokeball.png" alt="Pokebola imagem.">
        <h1>Pokedex</h1>
    </RouterLink>
</template>

<style lang="scss" scoped>
    .header{
        display: flex;
        align-items: center;
        justify-content: center;
        column-gap: 8px;
        margin: 40px 0;
        text-decoration: none;
        cursor: pointer;
        img{
            width: 47px;
            min-width: 47px;
            height: 47px;
            min-height: 47px;
        }
        h1{
            width: unset;
            color: #FFF;
            font-family: 'Roboto', sans-serif;
            font-size: 32px;
            font-style: italic;
            font-weight: 900;
            line-height: normal;
            margin: 0;
        }
    }
</style>
