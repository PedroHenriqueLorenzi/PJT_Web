<template>
    <Layout>
        <div class="p-6 max-w-5xl mx-auto">

            <!-- Título -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-green-800">Usuários</h1>
                    <p class="text-gray-500 text-sm mt-1">
                        Lista de usuários registrados na plataforma.
                    </p>
                </div>
            </div>

            <!-- Estados -->
            <div v-if="loading" class="text-gray-400">Carregando usuários...</div>

            <div v-else-if="users.length === 0" class="text-gray-400">
                Nenhum usuário encontrado.
            </div>

            <!-- Lista de usuários -->
            <ul
                v-else
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <li
                    v-for="user in users"
                    :key="user._id"
                    class="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col border border-gray-100"
                >
                    <!-- Avatar -->
                    <div class="flex items-center gap-4 mb-4">
                        <img
                            :src="user.avatar_url ? `${API}${user.avatar_url}` : defaultAvatar"
                            alt="Avatar"
                            class="w-16 h-16 rounded-full object-cover border-2 border-green-700"
                        />

                        <div>
                            <h2 class="text-lg font-semibold text-green-800">
                                {{ user.username }}
                            </h2>
                            <p class="text-gray-600 text-sm">
                                {{ user.email }}
                            </p>
                        </div>
                    </div>

                    <!-- Info extra -->
                    <p class="text-gray-500 text-xs mb-4">
                        Registrado em {{ formatDate(user.created_at) }}
                    </p>

                    <!-- Ações -->
                    <div class="mt-auto flex items-center justify-between text-sm text-gray-600">

                        <RouterLink
                            :to="`/users/${user._id}`"
                            class="text-blue-600 font-medium hover:text-blue-800 transition cursor-pointer"
                        >
                            Ver perfil
                        </RouterLink>

                        <RouterLink
                            :to="`/users/${user._id}/edit`"
                            class="text-yellow-600 font-medium hover:text-yellow-800 transition cursor-pointer"
                        >
                            Editar
                        </RouterLink>

                    </div>
                </li>
            </ul>

        </div>
    </Layout>
</template>

<script lang="ts">
import Layout from "@/components/layout.vue";
import { RouterLink } from "vue-router";
import axios from "axios";
import { handleApiError } from "@/helpers/functions";

export default {
    name: "UsersIndex",

    components: {
        Layout,
        RouterLink,
    },

    data() {
        return {
            API: import.meta.env.VITE_API,
            users: [] as any[],
            loading: true,
            defaultAvatar: "https://i.pravatar.cc/150?img=10",
        };
    },

    methods: {
        formatDate(date: string) {
            return new Date(date).toLocaleDateString("pt-BR");
        },

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
</style>
