<template>
    <Layout>
        <!-- Container principal responsivo -->
        <div class="p-4 md:p-6 max-w-5xl mx-auto">

            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">

                <!-- Título + subtítulo -->
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold text-green-800">Comunidades</h1>
                    <p class="text-gray-500 text-sm mt-1">
                        Explore as comunidades disponíveis ou crie uma nova.
                    </p>
                </div>

                <!-- Botão criar -->
                <RouterLink
                    to="/create-community"
                    class="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-100 transition hover:text-green-800 font-medium self-start md:self-auto"
                >
                    + Nova Comunidade
                </RouterLink>
            </div>

            <!-- Estado de carregamento -->
            <div v-if="loading" class="text-gray-400 text-center py-8">
                Carregando comunidades...
            </div>

            <!-- Estado vazio -->
            <div v-else-if="communities.length === 0" class="text-gray-400 text-center py-10">
                Nenhuma comunidade encontrada.
            </div>

            <!-- Lista -->
            <ul
                v-else
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <li
                    v-for="(community, i) in communities"
                    :key="community._id"
                    class="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col border border-gray-100"
                >

                    <!-- Imagem -->
                    <RouterLink :to="`/community/${community._id}`" class="block relative mb-4">
                        <img
                            :src="community.img_url ? `${API}${community.img_url}` : defaultImage"
                            alt="Comunidade"
                            class="w-full h-40 md:h-48 object-cover rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 transition"
                        />

                        <span class="absolute top-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full capitalize">
                            {{ community.type }}
                        </span>
                    </RouterLink>

                    <!-- Texto do card -->
                    <div class="flex-1 flex flex-col justify-between">
                        <div>
                            <h2 class="text-lg font-semibold text-green-800 truncate">
                                {{ community.name }}
                            </h2>

                            <p class="text-gray-600 text-sm mt-1 line-clamp-3">
                                {{ community.description }}
                            </p>
                        </div>

                        <!-- Rodapé -->
                        <div class="mt-4 flex items-center justify-between text-xs text-gray-500">
                            <span>Criado em {{ formatDate(community.created_at) }}</span>

                            <!-- Seguir/Entrar -->
                            <div class="flex gap-2">
                                <!-- Entrar -->
                                <button
                                    v-if="!community.isMember && !community.localPending"
                                    @click="joinCommunity(i)"
                                    :disabled="actionLoading"
                                    class="text-green-700 font-medium hover:text-green-900 transition cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed"
                                >
                                    {{ actionLoading ? '...' : 'Entrar' }}
                                </button>

                                <!-- Pendente -->
                                <span
                                    v-else-if="community.localPending"
                                    class="text-yellow-600 font-medium"
                                >
                                    Pendente
                                </span>

                                <!-- Sair (só aparece depois do reload da página) -->
                                <button
                                    v-else-if="community.isMember"
                                    @click="leaveCommunity(i)"
                                    :disabled="actionLoading"
                                    class="text-red-600 font-medium hover:text-red-800 transition cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed"
                                >
                                    {{ actionLoading ? '...' : 'Sair' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </Layout>
</template>

<script lang="ts">
/* Imports essenciais */
import Layout from "@/components/layout.vue";
import { RouterLink } from "vue-router";

import axios from "axios";
import { handleApiError } from "@/helpers/functions";
import { useToast } from "vue-toastification";

export default {
    name: "CommunityList",

    components: { Layout, RouterLink },

    data() {
        return {
            API: import.meta.env.VITE_API,

            /* Loading geral da página */
            loading: true,

            /* Loading de botões de ação */
            actionLoading: false,

            defaultImage: "https://placehold.co/300x200?text=Sem+Imagem&font=montserrat",

            communities: [] as any[],
        };
    },

    methods: {
        /* Formatador de datas */
        formatDate(date: string) {
            return new Date(date).toLocaleDateString("pt-BR");
        },

        /* Entrar na comunidade */
        async joinCommunity(i: number) {
            const toast = useToast();
            this.actionLoading = true;

            try {
                const res = await axios.get(
                    `/api/communities/${this.communities[i]._id}/join`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );

                if (res.data.success) {
                    this.communities[i].localPending = true;
                    toast.success(res.data.message);
                }
            } catch (err) {
                toast.error("Erro ao entrar na comunidade.");
            } finally {
                this.actionLoading = false;
            }
        },

        /* Sair da comunidade */
        async leaveCommunity(i: number) {
            const toast = useToast();
            this.actionLoading = true;

            try {
                const res = await axios.get(
                    `/api/communities/${this.communities[i]._id}/leave`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );

                if (res.data.success) {
                    this.communities[i].isMember = false;
                    toast.success(res.data.message);
                }
            } catch (err) {
                toast.error("Erro ao sair da comunidade.");
            } finally {
                this.actionLoading = false;
            }
        },

        /* Carrega lista */
        async loadData() {
            try {
                const response = await axios.get("/api/communities?users=all", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                if (response.data.success) {
                    this.communities = response.data.communities;
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
/* Limita descrição a 3 linhas */
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
