<template>
    <div v-if="!loading" class="h-screen flex flex-col overflow-hidden  text-gray-200">
        <header class="bg-[#0f0f0f] text-white flex items-center justify-between px-6 h-16 flex-shrink-0 shadow-lg">
            <div class="flex items-center space-x-4">
                <img src="@/assets/images/download.jpg" alt="Logo" class="w-10 h-10 rounded-full" />
                <h1 class="text-xl font-bold text-green-400">PTJ</h1>
            </div>

            <div class="flex items-center space-x-4">
                <button class="relative text-gray-300 hover:text-green-400 transition">
                    <BellIcon class="w-6 h-6" />
                    <span class="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                </button>

                <span class="text-gray-300">{{ store.user.name }}</span>

                <div class="flex items-center space-x-4">
                    <img :src="`http://localhost:3000${store.user.avatar_url}`" alt="Logo" class="w-10 h-10 rounded-full" />
                </div>

                <button
                    @click="logout"
                    class="flex items-center bg-green-600 px-3 py-1 rounded hover:bg-green-500 transition space-x-2"
                >
                    <ArrowRightOnRectangleIcon class="w-5 h-5 text-white" />
                    <span>Sair</span>
                </button>
            </div>
        </header>

        <div class="flex flex-1 overflow-hidden">
            <nav class="w-64 bg-[#1E1E1E] border-r border-gray-700 p-4 flex-shrink-0 flex flex-col justify-between overflow-y-auto">
                <ul class="space-y-2">
                    <li v-for="item in options" :key="item.route">
                        <router-link
                            :to="item.route"
                            class="flex items-center px-4 py-2 rounded transition text-gray-300 hover:bg-[#2A2A2A] hover:text-green-400"
                            active-class="bg-[#2A2A2A] text-green-400 font-semibold"
                        >
                            <component :is="item.icon" class="w-5 h-5 mr-3" />
                            <span>{{ item.text }}</span>
                        </router-link>
                    </li>
                </ul>

                <!-- Ícones no rodapé -->
                <div class="mt-4 flex space-x-4 justify-center">
                    <a href="https://github.com/seu-usuario/seu-repositorio" target="_blank" class="text-gray-400 hover:text-green-400 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.762-1.604-2.665-.303-5.467-1.332-5.467-5.932 0-1.31.468-2.382 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.323 3.3 1.23a11.54 11.54 0 013.003-.403c1.018.005 2.044.138 3.003.404 2.29-1.553 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.838 1.236 1.91 1.236 3.22 0 4.61-2.807 5.625-5.479 5.922.43.372.815 1.102.815 2.222 0 1.606-.015 2.903-.015 3.296 0 .32.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>

                    <button @click="$router.push('/desenvolvedores')" class="text-gray-400 hover:text-green-400 transition">
                        <UserGroupIcon class="w-6 h-6" />
                    </button>
                </div>
            </nav>

            <main class="flex-1  p-6 overflow-y-auto">
                <slot></slot>
            </main>
        </div>
    </div>
</template>

<script>
import {
    HomeIcon,
    UsersIcon,
    Cog6ToothIcon,
    UserGroupIcon,
    PencilSquareIcon,
    BellIcon,
    ArrowRightOnRectangleIcon
} from "@heroicons/vue/24/outline";

import {systemStore} from "../stores/index.js"

export default {
    name: "Layout",
    data() {
        return {
            loading: true,
            store: systemStore(),
            options: [
                { text: "Página inicial", route: "/", icon: HomeIcon },
                { text: "Usuários", route: "/users", icon: UsersIcon },
                { text: "Configurações", route: "/config", icon: Cog6ToothIcon },
                { text: "Criar um post", route: "/create-post", icon: PencilSquareIcon },
            ],
        };
    },
    methods: {
        logout() {
            localStorage.removeItem("token");
            this.$router.push("/login");
        },
    },
    mounted() {
        const storedUser = localStorage.getItem('user');
        console.log(storedUser)
        if (storedUser) {
            this.store.user = JSON.parse(storedUser);

            this.loading = false;
            // const user = JSON.parse(storedUser);
            // this.userName = user.name;
            // this.userAvatar = user.avatar_url
            //     ? `http://localhost:3000${user.avatar_url}`
            //     : 'https://i.pravatar.cc/150?img=1';
        }
    },
    components: {
        HomeIcon,
        UsersIcon,
        Cog6ToothIcon,
        UserGroupIcon,
        PencilSquareIcon,
        BellIcon,
        ArrowRightOnRectangleIcon,
    },
};
</script>
