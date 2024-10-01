<template>
    <div class="loading" :class="{ active: isLoading }">
        <div class="pokeball"></div>
    </div>
    <router-view />
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { isLoading } from './global/LoadingState';

    export default defineComponent({
    name: 'App',
    setup() {
        return {
            isLoading,
        };
    },
    });
</script>

<style lang="scss">
    /*Style global*/
    *{
        width: 100%;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        cursor: url('/cursor.png'), auto !important;
    }

    html{
        background: #262835;
    }

    #app{
        min-height: 100%;
        max-width: 600px;
        margin: auto auto 0;
    }

    ::-webkit-scrollbar{
        width: 0;
    }

    .loading{
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
        background: #EFEFEF;
        transition: transform 1s;
        transform: translateY(-100%);
        &.active{
            transform: translateY(0);
        }
        .pokeball{
            width: 60px;
            height: 60px;
            background-color: #fff;
            border-radius: 50% ;
            position: relative;
            overflow: hidden;
            border: 3px solid;
            animation: frames .8s  linear 0s infinite;
            &:before{
                content: '';
                position: absolute;
                width: 60px;
                height: 30px;
                background-color: red;
                border-bottom: 4px solid;
                top: -4px
            }
            &:after{
                content: '';
                position: absolute;
                background-color: #fff;
                width: 10px;
                height:10px;
                border: 4px solid;
                border-radius: 50%;
                bottom: 18px;
                right: 18px;
                z-index: 1;
            }
        }
    }

    /*Animations*/
    @keyframes leftCenter {
        0%{
            transform: translateX(-50px);
            opacity: 0;
        }
        100%{
            transform: translateX(0px);
            opacity: 100;
        }
    }

    @keyframes rightCenter {
        0%{
            transform: translateX(50px);
            opacity: 0;
        }
        100%{
            transform: translateX(0px);
            opacity: 100;
        }
    }

    @keyframes bottomCenter {
        0%{
            transform: translateY(50px);
            opacity: 0;
        }
        100%{
            transform: translateY(0px);
            opacity: 100;
        }
    }

    @keyframes frames{
        0% {
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }
</style>
