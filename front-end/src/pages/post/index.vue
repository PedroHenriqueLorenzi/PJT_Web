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
                    Comunidade
                </label>

                <select
                    v-model="selectedCommunityId"
                    :disabled="isSubmitting"
                    class="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 bg-white
                           focus:ring-2 focus:ring-green-600 focus:outline-none disabled:bg-gray-100"
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

            <!-- ------- Upload da imagem ------- -->
            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Imagem de capa
                </label>

                <div
                    class="relative group w-full h-40 sm:h-48 rounded-xl overflow-hidden 
                           border-2 border-gray-200 shadow-sm bg-gray-50 hover:shadow-md transition-all"
                >
                    <!-- Prévia -->
                    <img
                        v-if="imagePreview"
                        :src="imagePreview"
                        alt="Prévia da imagem"
                        class="w-full h-full object-cover"
                    />

                    <!-- Placeholder -->
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
                        <input
                            type="file"
                            @change="handleFileUpload"
                            accept="image/*"
                            class="hidden"
                            :disabled="isSubmitting"
                        />
                    </label>
                </div>
            </div>

            <!-- ------- Título ------- -->
            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Título</label>

                <input
                    v-model="title"
                    type="text"
                    :disabled="isSubmitting"
                    placeholder="Digite o título do post"
                    class="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 bg-white
                           focus:ring-2 focus:ring-green-600 focus:outline-none disabled:bg-gray-100"
                />
            </div>

            <!-- ------- Descrição ------- -->
            <div class="mb-8">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição
                </label>

                <textarea
                    v-model="description"
                    rows="5"
                    :disabled="isSubmitting"
                    placeholder="No que está pensando?"
                    class="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 bg-white resize-none
                           focus:ring-2 focus:ring-green-600 focus:outline-none disabled:bg-gray-100"
                ></textarea>
            </div>

            <!-- ------- Botão ------- -->
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

export default {
    name: "CreatePost",
    components: { Spinner, Layout },

    data() {
        return {
            title: "",
            description: "",
            imageFile: null as File | null,
            imagePreview: null as string | null,
            selectedCommunityId: "",
            isSubmitting: false,
            communities: [] as any[],
            loading: true,
        };
    },

    methods: {
        /* -----------------------------
           Lê imagem e cria preview
        ----------------------------- */
        handleFileUpload(event: Event) {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            /* Validação simples */
            if (!file.type.startsWith("image/")) {
                useToast().error("Selecione um arquivo de imagem válido.");
                return;
            }

            this.imageFile = file;

            const reader = new FileReader();
            reader.onload = (e) => (this.imagePreview = e.target?.result as string);
            reader.readAsDataURL(file);
        },

        /* -----------------------------
           Envia o post para a API
        ----------------------------- */
        async createPost() {
            const toast = useToast();

            /* Validações */
            if (!this.selectedCommunityId)
                return toast.error("Selecione uma comunidade.");

            if (!this.title.trim() || !this.description.trim())
                return toast.error("Título e descrição são obrigatórios.");

            this.isSubmitting = true;

            try {
                const form = new FormData();
                form.append("title", this.title.trim());
                form.append("description", this.description.trim());

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

                    /* Reset dos campos */
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

        /* -----------------------------
           Carrega comunidades disponíveis
        ----------------------------- */
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
