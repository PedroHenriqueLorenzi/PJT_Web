<template>
    <Layout>
        <div v-if="!loading" class="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8">
            <h1 class="text-3xl font-bold text-green-800 mb-2">Criar Novo Post</h1>
            <p class="text-gray-500 mb-8 text-sm">
                Compartilhe uma ideia, notícia ou atualização com sua comunidade.
            </p>

            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Comunidade {{selectedCommunityId}}
                </label>
                <select
                    v-model="selectedCommunityId"
                    class="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-green-600 focus:outline-none"
                >
                    <option disabled value="">Selecione uma comunidade</option>
                    <option
                        v-for="community in communities"
                        :key="community._id"
                        :value="community._id"
                    >
                        {{ community.name }}
                    </option>
                </select>
            </div>

            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Imagem de capa
                </label>

                <div class="relative group w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-gray-50">
                    <img
                        v-if="imageFile"
                        :src="imageFile"
                        alt="Prévia da imagem"
                        class="w-full h-full object-cover"
                    />

                    <div
                        v-else
                        class="w-full h-full flex items-center justify-center text-gray-400 text-sm"
                    >
                        Nenhuma imagem
                    </div>

                    <label
                        class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 7l6 6m0 0l6-6m-6 6V3m6 18H6a2 2 0 01-2-2v-5m16 7V6a2 2 0 00-2-2h-5" />
                        </svg>
                        Alterar imagem
                        <input type="file" @change="handleFileUpload" accept="image/*" class="hidden" />
                    </label>
                </div>
            </div>

            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Título
                </label>
                <input
                    v-model="title"
                    type="text"
                    placeholder="Digite o título do post"
                    class="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
            </div>

            <div class="mb-8">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição
                </label>
                <textarea
                    v-model="description"
                    rows="5"
                    placeholder="No que está pensando hoje?"
                    class="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-green-600 focus:outline-none resize-none"
                ></textarea>
            </div>

            <div class="flex justify-end">
                <button
                    @click="createPost"
                    :disabled="isSubmitting"
                    :class="[
                        'px-6 py-3 rounded-lg font-semibold transition',
                        isSubmitting
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-green-700 hover:bg-green-800 text-white shadow-md'
                    ]"
                >
                    {{ isSubmitting ? "Publicando..." : "Publicar Post" }}
                </button>
            </div>
        </div>

        <Spinner v-else />
    </Layout>
</template>

<script lang="ts">
import axios from "axios";
import { useToast } from "vue-toastification";
import { handleApiError } from "@/helpers/functions";
import Spinner from "@/components/Spinner.vue";
import Layout from "@/components/layout.vue";
import Input from "@/components/Input.vue";

export default {
    name: "CreatePost",
    components: {Input, Layout, Spinner },

    data() {
        return {
            title: "",
            description: "",
            imageFile: "",
            imagePreview: null as string | null,
            selectedCommunityId: "",
            isSubmitting: false,
            communities: [] as any[],
            loading: true,
        };
    },

    methods: {
        handleFileUpload(event: Event) {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            if (!file.type.startsWith("image/")) {
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.imageFile = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        },

        async createPost() {
            const toast = useToast();
            if (!this.selectedCommunityId) return toast.error("Selecione uma comunidade.");
            if (!this.title || !this.description) return toast.error("Preencha o título e a descrição.");

            this.isSubmitting = true;
            try {
                const payload = {
                    title: this.title,
                    description: this.description,
                    image: this.imageFile,
                };

                const response = await axios.post(`/api/communities/${this.selectedCommunityId}/posts`, payload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.data.success) {
                    toast.success("Post criado com sucesso!");
                    this.title = "";
                    this.description = "";
                    this.imageFile = null;
                    this.imagePreview = null;
                    this.selectedCommunityId = "";
                }

            } catch (err) {
                handleApiError(err);
            } finally {
                this.isSubmitting = false;
            }
        },

        async loadData() {
            try {
                const response = await axios.get("/api/communities", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.data.success) {
                    this.communities = response.data.communities;
                }
            } catch (err) {
                handleApiError(err);
            } finally {
                this.loading = false;
            }
        }
    },

    mounted() {
        this.loadData();
    },
};
</script>
