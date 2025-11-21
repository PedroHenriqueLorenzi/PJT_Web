<template>
    <Layout>
        <!-- Container principal -->
        <div
            v-if="!loading"
            class="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6 sm:p-8"
        >
            <!-- Título da página -->
            <h1 class="text-3xl font-bold text-green-800 mb-2">Criar Novo Post</h1>
            <p class="text-gray-500 mb-8 text-sm">
                Compartilhe algo com sua comunidade.
            </p>

            <!-- ------- Seleção da comunidade ------- -->
            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <!-- Nome do campo -->
                    Comunidade
                </label>

                <select
                    v-model="selectedCommunityId"
                    class="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 bg-white
                           focus:ring-2 focus:ring-green-600 focus:outline-none"
                >
                    <option disabled value="">Selecione uma comunidade</option>

                    <!-- Lista dinâmica -->
                    <option
                        v-for="community in communities"
                        :key="community._id"
                        :value="community._id"
                    >
                        {{ community.name }}
                    </option>
                </select>
            </div>

            <!-- ------- Upload de imagem ------- -->
            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Imagem de capa
                </label>

                <!-- Área da imagem responsiva -->
                <div
                    class="relative group w-full h-40 sm:h-48 rounded-xl overflow-hidden 
                           border-2 border-gray-200 shadow-sm bg-gray-50
                           hover:shadow-md transition-all"
                >
                    <!-- Prévia da imagem -->
                    <img
                        v-if="imagePreview"
                        :src="imagePreview"
                        alt="Prévia da imagem"
                        class="w-full h-full object-cover"
                    />

                    <!-- Estado sem imagem -->
                    <div
                        v-else
                        class="w-full h-full flex items-center justify-center text-gray-400 text-sm"
                    >
                        Nenhuma imagem
                    </div>

                    <!-- Botão overlay -->
                    <label
                        class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center 
                               justify-center text-white text-xs font-semibold opacity-0 
                               group-hover:opacity-100 transition cursor-pointer"
                    >
                        Alterar imagem
                        <input type="file" @change="handleFileUpload" accept="image/*" class="hidden" />
                    </label>
                </div>
            </div>

            <!-- ------- Campo título ------- -->
            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Título</label>

                <input
                    v-model="title"
                    type="text"
                    placeholder="Digite o título do post"
                    class="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 bg-white
                           focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
            </div>

            <!-- ------- Campo descrição ------- -->
            <div class="mb-8">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição
                </label>

                <textarea
                    v-model="description"
                    rows="5"
                    placeholder="No que está pensando?"
                    class="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 bg-white resize-none
                           focus:ring-2 focus:ring-green-600 focus:outline-none"
                ></textarea>
            </div>

            <!-- ------- Botão de publicar ------- -->
            <div class="flex justify-end">
                <button
                    @click="createPost"
                    :disabled="isSubmitting"
                    :class="[
                        'px-5 py-3 rounded-lg font-semibold transition',
                        isSubmitting
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-green-700 text-white hover:bg-green-800 shadow-md'
                    ]"
                >
                    {{ isSubmitting ? "Publicando..." : "Publicar Post" }}
                </button>
            </div>
        </div>

        <!-- Spinner central enquanto carrega -->
        <Spinner v-else class="mt-20" />
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
    components: { Input, Layout, Spinner },

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
        /* Prévia da imagem */
        handleFileUpload(event: Event) {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            this.imageFile = file;

            const reader = new FileReader();
            reader.onload = (e) => (this.imagePreview = e.target?.result as string);
            reader.readAsDataURL(file);
        },

        /* Criar post */
        async createPost() {
            const toast = useToast();

            if (!this.selectedCommunityId)
                return toast.error("Selecione uma comunidade.");

            if (!this.title || !this.description)
                return toast.error("Título e descrição obrigatórios.");

            this.isSubmitting = true;

            try {
                const form = new FormData();
                form.append("title", this.title);
                form.append("description", this.description);

                if (this.imageFile) form.append("image", this.imageFile);

                const response = await axios.post(
                    `/api/communities/${this.selectedCommunityId}/posts`,
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (response.data.success) {
                    toast.success("Post criado com sucesso!");

                    /* Reset */
                    this.title = "";
                    this.description = "";
                    this.imageFile = "";
                    this.imagePreview = null;
                    this.selectedCommunityId = "";
                }
            } catch (err) {
                handleApiError(err);
            } finally {
                this.isSubmitting = false;
            }
        },

        /* Carregar comunidades */
        async loadData() {
            try {
                const response = await axios.get("/api/communities", {
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
