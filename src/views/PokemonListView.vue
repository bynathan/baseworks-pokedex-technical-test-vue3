<template>
    <div class="pokedex">
        <Header/>

        <label for="search" class="pokedex__search">
            <input
                type="text"
                id="search"
                name="search"
                placeholder="Buscar Pokemon..."
                v-model="searchQuery"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z" fill="white"/>
            </svg>
        </label>

        <ul class="pokedex__type">
            <li
                v-for="type in types"
                :key="type.name"
                :class="{ selected: selectedType === type.name }"
                @click="toggleType(type.name)"
            >
                <p>{{ type.name }}</p>
            </li>
        </ul>

        <div class="pokedex__pokemons">
            <Pokemon
                v-for="pokemon in paginatedPokemonList"
                :key="pokemon.name"
                :pokemon="pokemon"
            />
        </div>

        <div v-if="paginatedPokemonList.length === 0" class="pokedex__notfound">
            <h1>Pokémon não encontrado 🤔</h1>
        </div>

        <div class="pokedex__pagination">
            <button @click="prevPage" :disabled="currentPage === 1">«</button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">»</button>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, onMounted, computed, watch } from 'vue';
    import Pokemon from '../components/Pokemon.vue';
    import Header from '../components/Header.vue';
    import { isLoading, setLoading } from '../global/LoadingState'; // Importando setLoading

    export default defineComponent({
        name: 'PokemonList',
        components: {
            Pokemon,
            Header
        },
        setup() {
            const pokemonList = ref<{ name: string; details: any }[]>([]);
            const searchQuery = ref('');
            const currentPage = ref(1);
            const itemsPerPage = ref(20);
            const types = ref<any[]>([]);
            const selectedType = ref<string | null>(null);

            onMounted(async () => {
                setLoading(true); // Ativa o loading antes da requisição

                try {
                    const quantityResponse = await fetch(`https://pokeapi.co/api/v2/pokemon`);
                    const quantityData = await quantityResponse.json();
                    
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${quantityData.count}`);
                    const data = await response.json();

                    // Carrega detalhes de cada Pokémon
                    const detailsPromises = data.results.map(async (pokemon: { name: string; url: string }) => {
                        const detailResponse = await fetch(pokemon.url);
                        const details = await detailResponse.json();
                        return { ...pokemon, details };
                    });

                    // Espera a resolução de todas as promessas antes de atualizar a lista
                    pokemonList.value = await Promise.all(detailsPromises);
                    await fetchPokemonTypes();
                } catch (error) {
                    console.error('Erro ao carregar Pokémon:', error);
                    alert('Erro ao carregar Pokémon. Tente novamente mais tarde.'); // Informa o usuário
                } finally {
                    setLoading(false); // Desativa o loading após a requisição
                }
            });

            const fetchPokemonTypes = async () => {
                try {
                    const response = await fetch('https://pokeapi.co/api/v2/type');
                    if (response.ok) {
                        const data = await response.json();
                        types.value = data.results;
                    } else {
                        throw new Error('Erro ao buscar tipos de Pokémon');
                    }
                } catch (error) {
                    console.error(error);
                    alert('Erro ao buscar tipos de Pokémon. Tente novamente mais tarde.'); // Informa o usuário
                }
            };

            const filteredPokemonList = computed(() => {
                let list = pokemonList.value;

                if (selectedType.value) {
                    list = list.filter(pokemon => 
                        pokemon.details.types.some((type: any) => type.type.name === selectedType.value)
                    );
                }
                return list.filter((pokemon) =>
                    pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
                );
            });

            const paginatedPokemonList = computed(() => {
                const start = (currentPage.value - 1) * itemsPerPage.value;
                const end = start + itemsPerPage.value;
                return filteredPokemonList.value.slice(start, end);
            });

            const totalPages = computed(() => {
                const pages = Math.ceil(filteredPokemonList.value.length / itemsPerPage.value);
                return pages > 0 ? pages : 1;
            });

            watch(searchQuery, () => {
                currentPage.value = 1;
            });

            const prevPage = () => {
                if (currentPage.value > 1) currentPage.value--;
            };

            const nextPage = () => {
                if (currentPage.value < totalPages.value) currentPage.value++;
            };

            const toggleType = (typeName: string) => {
                selectedType.value = selectedType.value === typeName ? null : typeName;
                currentPage.value = 1;
            };

            return {
                pokemonList,
                searchQuery,
                currentPage,
                itemsPerPage,
                paginatedPokemonList,
                totalPages,
                prevPage,
                nextPage,
                types,
                selectedType,
                toggleType,
                isLoading // Adiciona isLoading ao retorno
            };
        },
    });
</script>


<style lang="scss" scoped>
    .pokedex{
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 20px;
        &__search{
            position: relative;
            cursor: text;
            input{
                height: 50px;
                border: none;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.20);
                color: #FFF;
                font-family: 'Roboto', sans-serif;
                font-size: 18px;
                font-style: normal;
                font-weight: 300;
                line-height: normal;
                padding: 14px 55px 14px 20px;
                &::placeholder{
                    color: #FFF;
                    font-family: 'Roboto', sans-serif;
                    font-size: 18px;
                    font-style: normal;
                    font-weight: 300;
                    line-height: normal;
                }
                &:focus{
                    outline: none;
                    border: none;
                    box-shadow: none;
                }
            }
            svg{
                width: 18px;
                min-width: 18px;
                height: 18px;
                min-height: 18px;
                position: absolute;
                top: 16px;
                right: 20px;
            }
        }
        &__type{
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            list-style: none;
            justify-content: center;
            li{
                width: unset;
                display: flex;
                flex-direction: column;
                row-gap: 5px;
                animation: leftCenter 3.5s ease;
                &.selected{
                    p{
                        background: #F6F6F6;
                        color: #FF5473;
                    }
                }
                p{
                    min-width: 55px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 32px;
                    background: #FF5473;
                    color: var(--Primary, #262835);
                    font-family:'Roboto', sans-serif;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: normal;
                    margin: 0;
                    text-transform: capitalize;
                    padding: 0 10px;
                    transition: all .2s;
                }
            }
        }
        &__pokemons{
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 20px;
            row-gap: 20px;
        }
        &__notfound{
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 150px 0;
            h1{
                color: #F6F6F6;
                font-family: 'Inter', sans-serif;
                font-size: 40px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                margin: 0;
                text-align: center;
            }
        }
        &__pagination{
            display: flex;
            column-gap: 10px;
            color: #F6F6F6;
            font-family: 'Inter', sans-serif;
            font-size: 40px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            margin: 0;
            text-align: center;
            align-items: center;
            margin: 0 0 50px 0;
            span{
                font-size: 20px;
                font-style: italic;
                padding: 8px 0 0 0;
            }
            button{
                all: unset;
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }
        }
    }

    @media(max-width: 630px){
        .pokedex{
            padding: 0 15px;
        }
    }

    @media(max-width: 480px){
        .pokedex{
            &__pokemons{
                grid-template-columns: 1fr;
            }
        }
    }
</style>