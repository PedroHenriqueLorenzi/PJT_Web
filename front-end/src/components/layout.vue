<template>
    <div v-if="!loading" class="h-screen flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="bg-[#0f0f0f] text-white flex items-center justify-between px-4 h-16 flex-shrink-0 shadow-lg">
            <!-- Mobile: Hamburguer -->
            <button
                @click="toggleMenu"
                class="md:hidden text-gray-300 hover:text-green-400 focus:outline-none"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        v-if="!isMenuOpen"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                    <path
                        v-else
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            <!-- Desktop Header: PTJ logo -->
            <div class="hidden md:flex items-center space-x-3">
                <img src="@/assets/images/download.jpg" alt="Logo" class="w-10 h-10 rounded-full" />
                <h1 class="text-xl font-bold text-green-400">PTJ</h1>
            </div>

            <!-- User info (desktop & mobile) -->
            <div @click="$router.push('/config')" class="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition">
                <span class="text-gray-300">{{ store.user.username }}</span>
                <img
                    :src="`http://localhost:3000${store.user.avatar_url}`"
                    alt="Usuário"
                    class="w-10 h-10 rounded-full"
                />
            </div>
        </header>

        <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar Desktop -->
            <nav
                class="hidden md:flex w-64 bg-[#1E1E1E] border-r border-gray-700 p-4 flex-shrink-0 flex flex-col justify-between overflow-y-auto"
            >
                <ul class="space-y-2">
                    <li v-for="item in options" :key="item.route || item.text">
                        <div v-if="item.children" class="space-y-1">
                            <div class="flex items-center w-full px-4 py-2 rounded transition text-gray-300 hover:bg-[#2A2A2A] hover:text-green-400 justify-between">
                                <div class="flex items-center space-x-2">
                                    <component :is="item.icon" class="w-5 h-5" />
                                    <span>{{ item.text }}</span>
                                </div>
                            </div>

                            <transition name="fade">
                                <ul class="ml-6 border-l border-gray-700 pl-3 space-y-1">
                                    <li v-for="sub in item.children" :key="sub.route">
                                        <router-link
                                            @click="isMenuOpen = false"
                                            :to="sub.route"
                                            class="flex items-center px-3 py-1.5 rounded transition text-gray-400 hover:bg-[#2A2A2A] hover:text-green-400"
                                            active-class="bg-[#2A2A2A] text-green-400 font-semibold"
                                        >
                                            <component :is="sub.icon" class="w-4 h-4 mr-2" />
                                            <span>{{ sub.text }}</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </transition>
                        </div>

                        <div v-else>
                            <router-link
                                @click="isMenuOpen = false"
                                :to="item.route"
                                class="flex items-center px-4 py-2 rounded transition text-gray-300 hover:bg-[#2A2A2A] hover:text-green-400"
                                active-class="bg-[#2A2A2A] text-green-400 font-semibold"
                            >
                                <component :is="item.icon" class="w-5 h-5 mr-3" />
                                <span>{{ item.text }}</span>
                            </router-link>
                        </div>
                    </li>

                    <li>
                        <button
                            @click="logout"
                            class="flex items-center w-full px-4 py-2 mt-2 rounded text-gray-300 hover:bg-[#2A2A2A] hover:text-green-400 cursor-pointer transition space-x-2 justify-start"
                        >
                            <ArrowRightOnRectangleIcon class="w-5 h-5" />
                            <span>Sair</span>
                        </button>
                    </li>
                </ul>

                <!-- Footer Desktop -->
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

            <!-- Sidebar Mobile -->
            <transition name="slide">
                <nav
                    v-if="isMenuOpen"
                    class="absolute z-50 top-16 left-0 w-64 bg-[#1E1E1E] border-r border-gray-700 p-4 flex flex-col justify-start h-full md:hidden overflow-y-auto"
                >
                    <!-- Logo + PTJ no topo -->
                    <div class="flex items-center space-x-3 mb-6">
                        <img src="@/assets/images/download.jpg" alt="Logo" class="w-10 h-10 rounded-full" />
                        <h1 class="text-xl font-bold text-green-400">PTJ</h1>
                    </div>

                    <!-- Links -->
                    <ul class="space-y-2">
                        <li v-for="item in options" :key="item.route || item.text">
                            <!-- Se o item tiver subitens -->
                            <div v-if="item.children" class="space-y-1">
                                <button
                                    @click="toggleSubmenu(item)"
                                    class="flex items-center w-full px-4 py-2 rounded transition text-gray-300 hover:bg-[#2A2A2A] hover:text-green-400 justify-between"
                                >
                                    <div class="flex items-center space-x-2">
                                        <component :is="item.icon" class="w-5 h-5" />
                                        <span>{{ item.text }}</span>
                                    </div>
                                    <ChevronDownIcon
                                        class="w-4 h-4 transition-transform duration-200"
                                        :class="{ 'rotate-180': item.open }"
                                    />
                                </button>

                                <transition name="fade">
                                    <ul v-show="item.open" class="ml-6 border-l border-gray-700 pl-3 space-y-1">
                                        <li v-for="sub in item.children" :key="sub.route">
                                            <router-link
                                                @click="isMenuOpen = false"
                                                :to="sub.route"
                                                class="flex items-center px-3 py-1.5 rounded transition text-gray-400 hover:bg-[#2A2A2A] hover:text-green-400"
                                                active-class="bg-[#2A2A2A] text-green-400 font-semibold"
                                            >
                                                <component :is="sub.icon" class="w-4 h-4 mr-2" />
                                                <span>{{ sub.text }}</span>
                                            </router-link>
                                        </li>
                                    </ul>
                                </transition>
                            </div>

                            <!-- Se não tiver subitens -->
                            <div v-else>
                                <router-link
                                    @click="isMenuOpen = false"
                                    :to="item.route"
                                    class="flex items-center px-4 py-2 rounded transition text-gray-300 hover:bg-[#2A2A2A] hover:text-green-400"
                                    active-class="bg-[#2A2A2A] text-green-400 font-semibold"
                                >
                                    <component :is="item.icon" class="w-5 h-5 mr-3" />
                                    <span>{{ item.text }}</span>
                                </router-link>
                            </div>
                        </li>

                        <!-- Logout -->
                        <li>
                            <button
                                @click="logout"
                                class="flex items-center w-full px-4 py-2 mt-2 rounded text-gray-300 hover:bg-[#2A2A2A] hover:text-green-400 cursor-pointer transition space-x-2 justify-start"
                            >
                                <ArrowRightOnRectangleIcon class="w-5 h-5" />
                                <span>Sair</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </transition>

            <main class="flex-1 p-6 overflow-y-auto bg-[#F2F4F7]">
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
        ArrowRightOnRectangleIcon,
        ChevronDownIcon
    } from "@heroicons/vue/24/outline";

    import { systemStore } from "../stores/index.js";

    export default {
        name: "Layout",
        data() {
            return {
                loading: true,
                isMenuOpen: false,
                store: systemStore(),
                options: [
                    { text: "Página inicial", route: "/", icon: HomeIcon },
                    { text: "Usuários", route: "/users", icon: UsersIcon },
                    { text: "Configurações", route: "/config", icon: Cog6ToothIcon },
                    {
                        text: "Comunidades",
                        icon: BellIcon,
                        children: [
                            { text: "Ver comunidades", route: "/communities", icon: UserGroupIcon },
                            { text: "Criar comunidade", route: "/create-community", icon: UserGroupIcon },
                        ],
                    },
                    { text: "Criar um post", route: "/create-post", icon: PencilSquareIcon },
                ],
            };
        },
        methods: {
            toggleSubmenu(item) {
                item.open = !item.open;
            },
            logout() {
                localStorage.removeItem("token");
                this.$router.push("/login");
            },
            toggleMenu() {
                this.isMenuOpen = !this.isMenuOpen;
            },
        },
        mounted() {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                this.store.user = JSON.parse(storedUser);
                this.loading = false;
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
            ChevronDownIcon
        },
    };
</script>

<style>
    .slide-enter-active,
    .slide-leave-active {
        transition: transform 0.3s ease;
    }
    .slide-enter-from {
        transform: translateX(-100%);
    }
    .slide-enter-to {
        transform: translateX(0);
    }
    .slide-leave-from {
        transform: translateX(0);
    }
    .slide-leave-to {
        transform: translateX(-100%);
    }
</style>
