<template>
    <div class="pokedetails" v-if="pokemon">
        <div class="pokedetails__name">
            <h1>ポケモン</h1>
            <h2>{{ pokemon.name }}</h2>
        </div>
        <div class="pokedetails__info">
            <img class="pokeimage" :src="pokemon.sprites.other.dream_world.front_default" :alt="'Imagem do ' + pokemon.name" />
            <h1>Estatísticas</h1>
            <p v-for="skill in pokemon.stats" :key="skill.stat.name">
                {{ skill.stat.name }} <strong>{{ skill.base_stat }}</strong>
            </p>
            <h1 v-if="evolutionChain.length > 1">Evoluções</h1>
            <section class="pokedetails__info--evolutions">
                <RouterLink
                v-for="evolution in evolutionChain"
                :key="evolution.name"
                :to="`/${evolution.name}`"
                class="evolution"
                >
                <div v-if="evolution.name !== pokemon.name">
                    <img :src="evolution.image" :alt="'Imagem de ' + evolution.name" />
                    <p>{{ evolution.name }}</p>
                </div>
                </RouterLink>
            </section>
            <input type="button" value="Voltar" @click="goBack" />
        </div>
    </div>

    <div class="pokedetails" v-else>
        <div class="pokedetails__name">
            <h1>ポケモン</h1>
            <h2>Desconhecido</h2>
        </div>
        <div class="pokedetails__info">
            <img class="pokeimage" src="/notfoundpokemon.png" alt="Imagem pokemon desconhecido" />
            <h1>Estatísticas</h1>
            <p>Hp <strong>??</strong></p>
            <p>Attack <strong>??</strong></p>
            <p>Defense <strong>??</strong></p>
            <p>Special-attack <strong>??</strong></p>
            <p>Special-defense <strong>??</strong></p>
            <p>Speed <strong>??</strong></p>
            <input type="button" value="Voltar" @click="goBack" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, onMounted, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    
    export default defineComponent({
        name: 'PokemonDetail',
        setup() {
            const route = useRoute();
            const router = useRouter();
            const pokemon = ref<any>(null);
            const evolutionChain = ref<any>([]);

            const fetchPokemonDetails = async (name: string) => {
                try {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                    if (response.ok) {
                        pokemon.value = await response.json();
                        await fetchEvolutionChain(pokemon.value.species.url);
                    } else {
                        pokemon.value = null;
                    }
                } catch (error) {
                    console.error('Error fetching Pokémon details:', error);
                }
            };

            const fetchEvolutionChain = async (speciesUrl: string) => {
                try {
                    const speciesResponse = await fetch(speciesUrl);
                    const speciesData = await speciesResponse.json();
                    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
                    const evolutionData = await evolutionResponse.json();
                    evolutionChain.value = await getEvolutions(evolutionData.chain);
                } catch (error) {
                    console.error('Error fetching evolution chain:', error);
                }
            };

            const getEvolutions = async (chain: any) => {
                const evolutions = [];
                let currentChain = chain;

                while (currentChain) {
                    const evolutionName = currentChain.species.name;
                    try {
                        const evolutionResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolutionName}`);
                        const evolutionData = await evolutionResponse.json();
                        evolutions.push({
                            name: evolutionName,
                            url: `https://pokeapi.co/api/v2/pokemon/${evolutionName}`,
                            image: evolutionData.sprites.other.dream_world.front_default
                        });
                    } catch (error) {
                        console.error(`Error fetching evolution data for ${evolutionName}:`, error);
                    }
                    currentChain = currentChain.evolves_to[0];
                }

                return evolutions;
            };

            onMounted(() => {
                const pokemonName = Array.isArray(route.params.name) ? route.params.name[0] : route.params.name;
                fetchPokemonDetails(pokemonName);
            });

            watch(
                () => route.params.name,
                (newName) => {
                    const pokemonName = Array.isArray(newName) ? newName[0] : newName;
                    fetchPokemonDetails(pokemonName);
                }
            );

            const goBack = () => {
                router.push('/');
            };

            return {
                pokemon,
                evolutionChain,
                goBack,
            };
        },
    });
</script>

<style lang="scss" scoped>
    .pokedetails{
        display: flex;
        flex-direction: column;
        row-gap: 17px;
        &__name{
            width: unset;
            position: relative;
            margin: 0 30px 0 auto;
            animation: rightCenter 2s ease;
            h1{
                color: rgba(255, 255, 255, 0.10);
                font-family: 'Roboto', sans-serif;
                font-size: 60px;
                font-style: normal;
                font-weight: 300;
                line-height: normal;
                margin: 0;
                text-transform: capitalize;
            }
            h2{
                width: unset;
                color: #FFF;
                font-family: 'Roboto', sans-serif;
                font-size: 32px;
                font-style: italic;
                font-weight: 900;
                line-height: normal;
                margin: 0;
                position: absolute;
                bottom: 2px;
                right: 9px;
                text-transform: capitalize;
            }
        }
        &__info{
            height: 100%;
            min-height: calc(100vh - 120px);
            display: flex;
            flex-direction: column;
            position: relative;
            align-items: flex-start;
            padding: 130px 35px 20px;
            background: #FFF;
            border-radius: 60px 60px 0 0;
            .pokeimage{
                width: 200px;
                min-width: 200px;
                height: 200px;
                min-height: 200px;
                position: absolute;
                top: -90px;
                left: 18px;
                animation: leftCenter 2s ease;
            }
            h1{
                color: #FF5473;
                font-family: 'Roboto', sans-serif;
                font-size: 32px;
                font-style: italic;
                font-weight: 900;
                line-height: normal;
                text-decoration-line: underline;
                margin: 0 0 20px 0;
                animation: bottomCenter 2s ease;
            }
            p{
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #262835;
                font-family: 'Roboto', sans-serif;
                font-size: 18px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                margin: 0 0 2px 0;
                text-transform: capitalize;
                animation: bottomCenter 2s ease;
                strong{
                    width: unset;
                    font-weight: 700;
                }
                &:nth-child(8){
                    margin: 0 0 30px 0;
                }
            }
            input{
                height: 55px;
                background: #FF5473;
                color: #FFF;
                border-radius: 10px;
                border: none;
                font-family: 'Roboto', sans-serif;
                font-size: 18px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                margin: auto 0 0 0;
                cursor: pointer;
                transition: background .2s;
                &:hover{
                    background: #fa375b;
                }
            }
            &--evolutions{
                display: flex;
                align-items: center;
                justify-content: start;
                margin: 0 0 100px 0;
                .evolution{
                    width: unset;
                    text-decoration-line: none !important;
                    transform: scale(1);
                    transition: all .2s;
                    div{
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        row-gap: 5px;
                        margin: 0 15px 0 0;
                        p{
                            width: unset;
                            color: #262835;
                            font-family: 'Roboto', sans-serif;
                            font-size: 18px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;
                        }
                        img{
                            width: 50px;
                            height: 50px;
                            animation: leftCenter 2s ease;
                        }
                    }
                    &:hover{
                        transform: scale(1.04);
                    }
                }
            }
        }
    }

    @media(max-width: 630px){
        .pokedetails{
            padding: 0 15px;
            &__info{
                padding: 25px 35px 20px;
                img{
                    margin: 0 0 15px 0;
                    position: unset;
                    width: 150px;
                    min-width: 150px;
                    height: 150px;
                    min-height: 150px;
                }
            }
        }
    }
</style>