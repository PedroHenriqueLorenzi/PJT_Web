<template>
    <Layout>
        <div class="p-6 max-w-5xl mx-auto">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-green-800">Comunidades</h1>
                    <p class="text-gray-500 text-sm mt-1">
                        Explore as comunidades disponíveis ou crie uma nova.
                    </p>
                </div>

                <RouterLink
                    to="/create-community"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-semibold shadow transition"
                >
                    + Nova Comunidade
                </RouterLink>
            </div>

            <div v-if="loading" class="text-gray-400">Carregando comunidades...</div>
            <div v-else-if="communities.length === 0" class="text-gray-400">
                Nenhuma comunidade encontrada.
            </div>

            <!-- Lista de comunidades -->
            <ul
                v-else
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <li
                    v-for="(community, communityIdx) in communities"
                    :key="community.id"
                    class="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col border border-gray-100"
                >
                    <div class="relative mb-4">
                        <img
                            :src="`${API}${community.img_url}`"
                            alt="Comunidade Imagem"
                            class="w-full h-40 object-cover rounded-xl border border-gray-200"
                        />
                        <span
                            class="absolute top-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full capitalize"
                        >
                            {{ community.type }}
                        </span>
                    </div>

                    <div class="flex-1 flex flex-col justify-between">
                        <div>
                            <h2 class="text-lg font-semibold text-green-800 truncate">
                                {{ community.name }}
                            </h2>
                            <p class="text-gray-600 text-sm mt-1 line-clamp-3">
                                {{ community.description }}
                            </p>
                        </div>

                        <div class="mt-4 flex items-center justify-between text-xs text-gray-500">
                            <span>Criado em {{ formatDate(community.created_at) }}</span>

                            <div class="flex gap-2">
                                <button
                                    v-if="!community.isMember"
                                    @click="joinCommunity(communityIdx)"
                                    class="text-green-700 font-medium hover:text-green-900 transition cursor-pointer"
                                >
                                    Entrar
                                </button>

                                <button
                                    v-else
                                    @click="leaveCommunity(communityIdx)"
                                    class="text-red-600 font-medium hover:text-red-800 transition cursor-pointer"
                                >
                                    Sair
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
import Layout from "@/components/layout.vue";
import { RouterLink } from "vue-router";
import axios from "axios";
import {handleApiError} from "@/helpers/functions.ts";
import { useToast } from "vue-toastification"

export default {
    name: "CommunityList",

    components: {
        Layout,
        RouterLink,
    },

    data() {
        return {
            API: import.meta.env.VITE_API,

            loading: false,
            defaultImage: "https://placehold.co/300x200?text=Sem+Imagem&font=montserrat",

            communities: [] as Array<any>,
        };
    },

    methods: {
        formatDate(date: string) {
            return new Date(date).toLocaleDateString("pt-BR");
        },

        async joinCommunity(communityIdx: number) {
            try {
                const response = await axios.get(`/api/communities/${this.communities[communityIdx]._id}/join`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.data.success) {
                    this.communities[communityIdx].isMember = true;
                    useToast().success(response.data.message);
                }
            } catch (err) {
                console.error("Erro ao entrar na comunidade:", err);
            }
        },

        async leaveCommunity(communityIdx: number) {
            try {
                const response = await axios.get(`/api/communities/${this.communities[communityIdx]._id}/leave`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.data.success) {
                    this.communities[communityIdx].isMember = false;
                    useToast().success(response.data.message);
                }
            } catch (err) {
                console.error("Erro ao sair da comunidade:", err);
            }
        },

        async loadData() {
            try {
                const response = await axios.get("/api/communities?users=all", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.data.success) {
                    this.communities = response.data.communities;
                }
            } catch (err) {
                handleApiError(err);
            }
        }
    },

    mounted() {
        this.loadData();
    },
};
</script>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
