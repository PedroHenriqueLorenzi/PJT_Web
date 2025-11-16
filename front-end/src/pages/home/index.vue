<template>
    <Layout>
        <div class="max-w-2xl mx-auto mt-8 space-y-6">
            <h2 class="text-2xl font-bold mb-4">Feed</h2>

            <div
                v-for="post in posts"
                :key="post.id"
                class="bg-white rounded-xl shadow-md overflow-hidden border"
            >
                <div class="flex items-center p-4">
                    <img
                        :src="`${API}${post.userAvatar}`"
                        alt="User avatar"
                        class="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                        <p class="font-semibold">{{ post.username }}</p>
                        <p class="text-gray-500 text-sm">{{ formatDate(post.createdAt) }}</p>
                    </div>
                </div>

                <div class="w-full">
                    <img :src="`${API}${post.img_url}`" alt="Post image" class="w-full max-h-[500px] object-contain" />
                </div>

                <div class="px-4 py-2 flex items-center space-x-4">
                    <button
                        @click="toggleLike(post)"
                        class="focus:outline-none"
                    >
                        <span
                            :class="post.liked ? 'text-red-500' : 'text-gray-400'"
                            class="text-xl"
                        >
                            ❤️
                        </span>
                    </button>
                    <span class="text-gray-600 text-sm">{{ post.likes }} curtidas</span>
                </div>

                <div class="px-4 text-gray-800 mb-2">
                    <span class="font-semibold mr-1">{{ post.username }}</span>
                    {{ post.description }}
                </div>

                <div class="px-4 mb-2 space-y-1">
                    <p
                        v-for="(comment, index) in post.comments"
                        :key="index"
                        class="text-sm text-gray-700"
                    >
                        <span class="font-semibold">{{ comment.user }}:</span>
                        {{ comment.text }}
                    </p>
                </div>

                <div class="px-4 py-2 border-t flex items-center">
                    <input
                        v-model="post.newComment"
                        type="text"
                        placeholder="Adicione um comentário..."
                        class="flex-1 text-sm px-3 py-2 outline-none"
                        @keyup.enter="addComment(post)"
                    />
                    <button
                        @click="addComment(post)"
                        class="text-blue-500 font-semibold text-sm"
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
import {handleApiError} from "@/helpers/functions.js";

export default {
    name: "Home",
    components: { Layout },
    data() {
        return {
            API: import.meta.env.VITE_API,

            userName: "Thalles Dreissig",
            userAvatar: 'https://i.pravatar.cc/150?img=3',
            posts: null,
            // posts: [
            //     {
            //         id: 1,
            //         userName: "Thalles Dreissig",
            //         userAvatar: "https://i.pravatar.cc/150?img=3",
            //         image: "https://picsum.photos/600/400?random=1",
            //         caption: "Primeiro post! 🚀",
            //         date: new Date(),
            //         likes: 12,
            //         liked: false,
            //         comments: [
            //             { user: "Ana", text: "Ficou massa!" },
            //             { user: "João", text: "👏👏" },
            //         ],
            //         newComment: "",
            //     },
            //     {
            //         id: 2,
            //         userName: "Maria Clara",
            //         userAvatar: "https://i.pravatar.cc/150?img=6",
            //         image: "https://picsum.photos/600/400?random=2",
            //         caption: "Curtindo o dia 😎",
            //         date: new Date(),
            //         likes: 7,
            //         liked: false,
            //         comments: [],
            //         newComment: "",
            //     },
            // ],
        };
    },
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
            });
        },
        toggleLike(post) {
            post.liked = !post.liked;
            post.likes += post.liked ? 1 : -1;
        },
        addComment(post) {
            if (!post.newComment.trim()) return;
            post.comments.push({
                user: this.userName,
                text: post.newComment,
            });
            post.newComment = "";
        },

        async loadData() {
            try {
                const response = await axios.get("/api/posts", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.data.success) {
                    this.posts = response.data.posts;
                    console.log(response.data.posts);
                }
            } catch (err) {
                handleApiError(err);
            } finally {
                this.loading = false;
            }
        }
    },

    mounted() {
        this.loadData()
    }
};
</script>

<style scoped>
/* só pra dar um leve destaque ao input */
input::placeholder {
    color: #aaa;
}
</style>
