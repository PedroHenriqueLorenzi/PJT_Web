<template>
    <Layout>
        <div
            v-if="unauthorized"
            class="flex flex-col items-center justify-center py-24 px-6 text-gray-700"
        >
            <div class="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 mx-auto mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 4a8 8 0 018 8 8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8z" />
                </svg>

                <h2 class="text-2xl font-semibold mb-2">
                    Acesso restrito
                </h2>

                <p class="text-gray-600">
                    Você não tem permissão para visualizar esta comunidade.<br>
                    Entre em contato com o administrador caso ache que isso é um erro.
                </p>
            </div>
        </div>

        <!-- Container geral -->
        <div v-else class="max-w-2xl mx-auto mt-8 px-4 space-y-6">

            <!-- Título -->
            <h2 class="text-3xl font-semibold tracking-wide mb-4 text-center text-gray-800">
                Feed
            </h2>

            <!-- Estado de carregamento -->
            <div v-if="loading" class="text-center text-gray-500 py-16">
                Carregando posts...
            </div>

            <!-- Estado: sem posts -->
            <div
                v-else-if="posts.length === 0"
                class="flex flex-col items-center justify-center text-center py-16 text-gray-500"
            >
                <p class="text-lg font-medium mb-2">Nada por aqui ainda...</p>
                <p class="text-sm mb-6">Comece buscando comunidades para ver novos posts!</p>

                <RouterLink
                    to="/communities"
                    class="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-100 transition hover:text-green-800 font-medium"
                >
                    Buscar comunidades
                </RouterLink>
            </div>

            <!-- Lista de posts -->
            <div
                v-else
                v-for="post in posts"
                :key="post.id"
                class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition hover:shadow-md"
            >
                <!-- HEADER -->
                <div class="flex items-center justify-between p-4 gap-3 flex-wrap">
                    
                    <!-- Usuário -->
                    <div class="flex items-center min-w-[180px]">
                        <img
                            :src="`${API}${post.userAvatar}`"
                            class="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 mr-3 object-cover"
                        />

                        <div>
                            <p class="font-semibold text-gray-800 text-sm md:text-base">
                                {{ post.username }}
                            </p>
                            <p class="text-gray-500 text-xs">
                                {{ formatDate(post.createdAt) }}
                            </p>
                        </div>

                        <button @click="deletePost(post._id)" class="text-gray-400 hover:text-red-400 transition ml-2 cursor-pointer">
                            <TrashIcon class="w-5 h-5" />
                        </button>
                    </div>

                    <div class="flex items-center gap-2 justify-end flex-nowrap w-auto mt-2 md:mt-0">
                        <p class="hidden md:block text-sm font-medium text-gray-700 truncate max-w-[130px]">
                            {{ post.communityName }}
                        </p>

                        <img
                            v-if="post.communityImg"
                            :src="`${API}${post.communityImg}`"
                            class="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 object-cover"
                        />
                    </div>
                </div>

                <!-- TÍTULO -->
                <div class="px-4 pb-2">
                    <h3 class="text-lg md:text-xl font-semibold text-gray-900 leading-tight">
                        {{ post.title }}
                    </h3>
                </div>

                <!-- IMAGEM -->
                <div v-if="post.img_url" class="w-full bg-black bg-opacity-5">
                    <img
                        :src="`${API}${post.img_url}`"
                        class="w-full max-h-[450px] md:max-h-[550px] object-cover"
                    />
                </div>

                <!-- CURTIDAS -->
                <div class="px-4 py-3 flex items-center gap-3">
                    <button @click="toggleLike(post)" class="focus:outline-none" :disabled="post.liking">
                        <span
                            :class="post.liked ? 'text-red-500 scale-110' : 'text-gray-400'"
                            class="text-xl md:text-2xl transition"
                        >
                            ❤️
                        </span>
                    </button>

                    <span class="text-gray-700 text-sm font-medium">
                        {{ post.likes }} curtidas
                    </span>
                </div>

                <!-- DESCRIÇÃO -->
                <div class="px-4 text-gray-800 mb-3">
                    <span class="font-semibold mr-2">{{ post.username }}</span>
                    <span class="text-gray-700 break-words">{{ post.description }}</span>
                </div>

                <!-- COMENTÁRIOS -->
                <div class="px-4 mb-3 space-y-1">
                    <p
                        v-for="(comment, index) in post.comments"
                        :key="index"
                        class="text-sm text-gray-700 leading-snug break-words"
                    >
                        <span class="font-semibold text-gray-900">{{ comment.user }}:</span>
                        {{ comment.text }}
                    </p>
                </div>

                <!-- Divider -->
                <div class="border-t border-gray-200"></div>

                <!-- ADICIONAR COMENTÁRIO -->
                <div class="px-4 py-3 flex flex-col sm:flex-row items-center gap-3 bg-gray-50">

                    <!-- Campo -->
                    <input
                        v-model="post.newComment"
                        type="text"
                        placeholder="Adicione um comentário..."
                        class="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-green-600 focus:outline-none w-full"
                        @keyup.enter="addComment(post)"
                    />

                    <!-- Botão -->
                    <button
                        @click="addComment(post)"
                        :disabled="post.commenting"
                        class="text-green-700 font-semibold text-sm hover:text-green-900 transition w-full sm:w-auto"
                    >
                        {{ post.commenting ? "Publicando..." : "Publicar" }}
                    </button>
                </div>
            </div>
        </div>
    </Layout>
</template>

<script>
import Layout from "../../components/layout.vue";
import axios from "axios";
import { handleApiError } from "@/helpers/functions.js";
import { systemStore } from "@/stores/index.js";
import { useToast } from "vue-toastification";
import { TrashIcon } from "@heroicons/vue/24/outline";

export default {
    name: "Home",
    components: {TrashIcon, Layout },

    data() {
        return {
            API: import.meta.env.VITE_API,
            store: systemStore(),

            posts: [],
            loading: true,
            unauthorized: false,
        };
    },

    methods: {
        /* Formata data */
        formatDate(date) {
            return new Date(date).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
            });
        },

        /* Like / Unlike */
        toggleLike(post) {
            if (post.liking) return;

            post.liking = true;
            post.liked = !post.liked;
            post.likes += post.liked ? 1 : -1;

            setTimeout(() => {
                post.liking = false;
            }, 300);
        },

        /* Adiciona comentário */
        async addComment(post) {
            const toast = useToast();

            if (!post.newComment?.trim()) {
                toast.error("Digite um comentário.");
                return;
            }

            post.commenting = true;

            try {
                post.comments.push({
                    user: this.store.user.username,
                    text: post.newComment,
                });

                post.newComment = "";

            } catch (err) {
                toast.error("Erro ao comentar.");
            } finally {
                post.commenting = false;
            }
        },

        async deletePost(id) {
            try {
                const response = await axios.delete(`api/posts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.data.success) {
                    useToast().success("Post deletado com sucesso.");
                    window.location.reload();
                }
            } catch (err) {
                useToast().error("Erro ao deletar o post.");
            }
        },

        /* Carrega posts da API */
        async loadData() {
            try {
                const communityId = this.$route.params.id;

                let endpoint = "";

                if (communityId) {
                    // Feed por comunidade
                    endpoint = `/api/communities/${communityId}/posts`;
                } else {
                    // Feed geral
                    endpoint = `/api/posts`;
                }

                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.data.success) {
                    this.posts = response.data.posts.map((p) => ({
                        ...p,
                        newComment: "",
                        commenting: false,
                        liking: false,
                    }));
                }

            } catch (err) {
                if (err.response?.status === 404) {
                    this.unauthorized = true;
                }

                handleApiError(err);
            } finally {
                this.loading = false;
            }
        }
    },

    mounted() {
        this.loadData();
    }
};
</script>
