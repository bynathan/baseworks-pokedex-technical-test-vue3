<template>
    <RouterLink class="pokemon" :to="`/${pokemon.details.name}`" v-if="pokemon && pokemon.details">
        <h1>{{ pokemon.details.name }}</h1>
        <div class="pokemon--type">
            <p v-for="(type, index) in pokemon.details.types" :key="index">{{ type.type.name }}</p>
        </div>
        <div class="pokemon--image" style="background-image: url('/background-pokemon.png')">
            <img :src="pokemon.details.sprites.other.dream_world.front_default" :alt="'Imagem do ' + pokemon.details.name" />
        </div>
    </RouterLink>
  </template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
    name: 'AppPokemon',
    props: {
        pokemon: {
        type: Object,
        required: true,
        },
    },
    });
</script>

<style lang="scss" scoped>
    .pokemon{
        height: 157px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        border-radius: 10px;
        background: #FFF;
        position: relative;
        padding: 20px;
        text-decoration: none;
        transform: scale(1.0);
        cursor: pointer;
        transition: all .2s;
        &:hover{
            box-shadow: 0px 0px 25px 0px rgba(255, 255, 255, 0.45);
            transform: scale(1.04);
        }
        h1{
            color: #262835;
            font-family: 'Roboto', sans-serif;
            font-size: 22px;
            font-style: italic;
            font-weight: 900;
            line-height: normal;
            margin: 0 0 10px 0;
            text-transform: lowercase;
            animation: leftCenter 2s ease;
            &::first-letter{
                text-transform: uppercase;
            }
        }
        &--type{
            width: unset;
            display: flex;
            flex-direction: column;
            row-gap: 5px;
            animation: bottomCenter 3.5s ease;
            p{
                min-width: 55px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 32px;
                background: #EFEFEF;
                color: var(--Primary, #262835);
                font-family:'Roboto', sans-serif;
                font-size: 10px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                margin: 0;
                text-transform: capitalize;
            }
        }
        &--image{
            width: 110px;
            height: 90px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 47px;
            right: 20px;
            img{
                width: 80px;
                min-width: 80px;
                height: 80px;
                min-height: 80px;
                animation: rightCenter 2s ease;
            }
        }
    }
</style>
