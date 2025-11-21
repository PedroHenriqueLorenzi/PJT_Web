<template>
    <Layout>
        <div class="p-6 max-w-5xl mx-auto">

            <!-- ===============================
                 TÍTULO DA PÁGINA
                 =============================== -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-green-800">Usuários</h1>
                    <p class="text-gray-500 text-sm mt-1">
                        Lista de usuários registrados na plataforma.
                    </p>
                </div>
            </div>

            <!-- ===============================
                 ESTADOS (CARREGANDO / VAZIO)
                 =============================== -->
            <div v-if="loading" class="text-gray-400">Carregando usuários...</div>

            <div v-else-if="users.length === 0" class="text-gray-400">
                Nenhum usuário encontrado.
            </div>

            <!-- ===============================
                 LISTA DE USUÁRIOS (GRID RESPONSIVA)
                 =============================== -->
            <ul
                v-else
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <li
                    v-for="user in users"
                    :key="user._id"
                    class="bg-white rounded-2xl shadow-md hover:shadow-lg transition
                           p-5 flex flex-col border border-gray-100"
                >
                    <!-- ===============================
                         AVATAR + NOME
                         =============================== -->
                    <div class="flex items-center gap-4 mb-4">
                        <img
                            :src="user.avatar_url ? `${API}${user.avatar_url}` : defaultAvatar"
                            alt="Avatar"
                            class="w-16 h-16 rounded-full object-cover border-2 border-green-700"
                        />

                        <div class="min-w-0">
                            <h2 class="text-lg font-semibold text-green-800 truncate">
                                {{ user.username }}
                            </h2>
                            <p class="text-gray-600 text-sm truncate">
                                {{ user.email }}
                            </p>
                        </div>
                    </div>

                    <!-- ===============================
                         INFO EXTRA
                         =============================== -->
                    <p class="text-gray-500 text-xs mb-4">
                        Registrado em {{ formatDate(user.createdAt) }}
                    </p>

                    <!-- ===============================
                         AÇÃO: SEGUIR / DEIXAR DE SEGUIR
                         =============================== -->
                    <div class="mt-auto flex justify-between text-sm text-gray-600">
                        <button
                            @click="toggleFollow(user)"
                            class="px-3 py-2 rounded-lg font-medium transition w-full text-center"
                            :class="user.isFollowing
                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'"
                        >
                            {{ user.isFollowing ? 'Deixar de seguir' : 'Seguir' }}
                        </button>
                    </div>
                </li>
            </ul>

        </div>
    </Layout>
</template>

<script lang="ts">
import Layout from "@/components/layout.vue";
import axios from "axios";
import { handleApiError } from "@/helpers/functions";

export default {
    name: "Users",

    components: { Layout },

    data() {
        return {
            API: import.meta.env.VITE_API,
            users: [] as any[],
            loading: true,
            defaultAvatar: "https://i.pravatar.cc/150?img=10",
        };
    },

    methods: {
        /* Formata a data para pt-BR */
        formatDate(date: string) {
            return new Date(date).toLocaleDateString("pt-BR");
        },

        /* Seguir / deixar de seguir */
        async toggleFollow(user: any) {
            try {
                const res = await axios.get(`/api/users/${user._id}/follow`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                user.isFollowing = res.data.following;

            } catch (err) {
                handleApiError(err);
            }
        },

        /* Busca usuários da API */
        async loadData() {
            try {
                const response = await axios.get("/api/users", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.data.success) {
                    this.users = response.data.users;
                }
            } catch (err) {
                handleApiError(err);
            } finally {
                this.loading = false;
            }
        },
    },

    mounted() {
        this.loadData();
    },
};
</script>

<style scoped>
/* Nenhum estilo adicional necessário */
</style>
