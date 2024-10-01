import { ref } from 'vue';

export const isLoading = ref<boolean>(true);

export const setLoading = (loading: boolean) => {
    isLoading.value = loading;
};