<template>
    <Layout>
        <!-- Container geral -->
        <div class="max-w-2xl mx-auto mt-8 px-4 space-y-6">

            <!-- Título do feed -->
            <h2 class="text-3xl font-semibold tracking-wide mb-4 text-center text-gray-800">
                Feed
            </h2>

            <!-- Estado: sem posts -->
            <div
                v-if="posts.length === 0"
                class="flex flex-col items-center justify-center text-center py-16 text-gray-500"
            >
                <p class="text-lg font-medium mb-2">Nada por aqui ainda...</p>
                <p class="text-sm mb-6">Comece buscando comunidades para ver novos posts!</p>

                <!-- Botão buscar comunidades -->
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
                <!-- -------- HEADER -------- -->
                <div class="flex items-center justify-between p-4 gap-3 flex-wrap">
                    
                    <!-- Info do usuário -->
                    <div class="flex items-center min-w-[180px]">
                        <img
                            :src="`${API}${post.userAvatar}`"
                            alt="User avatar"
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
                    </div>

                    <!-- Info da comunidade -->
                    <div
                        class="flex items-center gap-2 justify-end w-full md:w-auto mt-2 md:mt-0"
                    >
                        <p class="text-sm font-medium text-gray-700 truncate max-w-[130px]">
                            {{ post.communityName }}
                        </p>

                        <img
                            v-if="post.communityImg"
                            :src="`${API}${post.communityImg}`"
                            alt="Community avatar"
                            class="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 object-cover"
                        />
                    </div>
                </div>

                <!-- -------- TÍTULO DO POST -------- -->
                <div class="px-4 pb-2">
                    <h3 class="text-lg md:text-xl font-semibold text-gray-900 leading-tight">
                        {{ post.title }}
                    </h3>
                </div>

                <!-- -------- IMAGEM -------- -->
                <div v-if="post.img_url" class="w-full bg-black bg-opacity-5">
                    <img
                        :src="`${API}${post.img_url}`"
                        alt="Post image"
                        class="w-full max-h-[450px] md:max-h-[550px] object-cover"
                    />
                </div>

                <!-- -------- CURTIDAS -------- -->
                <div class="px-4 py-3 flex items-center gap-3">
                    <button @click="toggleLike(post)" class="focus:outline-none">
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

                <!-- -------- DESCRIÇÃO -------- -->
                <div class="px-4 text-gray-800 mb-3">
                    <span class="font-semibold mr-2">{{ post.username }}</span>
                    <span class="text-gray-700 break-words">{{ post.description }}</span>
                </div>

                <!-- -------- COMENTÁRIOS -------- -->
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

                <!-- -------- ADICIONAR COMENTÁRIO -------- -->
                <div class="px-4 py-3 flex flex-col sm:flex-row items-center gap-3 bg-gray-50">

                    <!-- Campo de comentário -->
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
                        class="text-green-700 font-semibold text-sm hover:text-green-900 transition w-full sm:w-auto"
                    >
                        Publicar
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

export default {
    name: "Home",
    components: { Layout },

    data() {
        return {
            API: import.meta.env.VITE_API,
            store: systemStore(),

            posts: [],
        };
    },

    methods: {
        /* Formata a data do post */
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
            post.liked = !post.liked;
            post.likes += post.liked ? 1 : -1;
        },

        /* Adicionar comentário */
        addComment(post) {
            if (!post.newComment?.trim()) return;

            post.comments.push({
                user: this.store.user.username,
                text: post.newComment,
            });

            post.newComment = "";
        },

        /* Carrega posts */
        async loadData() {
            try {
                const response = await axios.get("/api/posts", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.data.success) {
                    this.posts = response.data.posts;
                }
            } catch (err) {
                handleApiError(err);
            }
        }
    },

    mounted() {
        this.loadData();
    }
};
</script>
