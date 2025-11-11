<template>
    <Layout>
        <div v-if="!loading" class="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8">
            <h1 class="text-3xl font-bold text-green-800 mb-2">Criar Novo Post</h1>
            <p class="text-gray-500 mb-8 text-sm">
                Compartilhe uma ideia, notícia ou atualização com sua comunidade.
            </p>

            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Comunidade
                </label>
                <select
                    v-model="selectedCommunityId"
                    class="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-green-600 focus:outline-none"
                >
                    <option disabled value="">Selecione uma comunidade</option>
                    <option
                        v-for="community in communities"
                        :key="community.id"
                        :value="community.id"
                    >
                        {{ community.name }}
                    </option>
                </select>
            </div>

            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Imagem de capa
                </label>
                <div
                    class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-600 transition"
                    @click="$refs.fileInput.click()"
                >
                    <input
                        type="file"
                        accept="image/*"
                        ref="fileInput"
                        class="hidden"
                        @change="handleImageUpload"
                    />
                    <div v-if="imagePreview">
                        <img
                            :src="imagePreview"
                            alt="Preview"
                            class="mx-auto rounded-lg max-h-64 object-cover shadow-md"
                        />
                    </div>
                    <div v-else class="text-gray-400">
                        <span class="text-sm">Clique para selecionar uma imagem</span>
                    </div>
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

export default {
    name: "CreatePost",
    components: { Layout, Spinner },

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
        handleImageUpload(event: Event) {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                this.imageFile = file;
                this.imagePreview = URL.createObjectURL(file);
            }
        },

        async createPost() {
            const toast = useToast();
            if (!this.selectedCommunityId) return toast.error("Selecione uma comunidade.");
            if (!this.title || !this.description) return toast.error("Preencha o título e a descrição.");

            this.isSubmitting = true;
            try {
                const formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                if (this.imageFile) formData.append("image", this.imageFile);

                const response = await axios.post(
                    `/api/communities/${this.selectedCommunityId}/posts`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                toast.success("Post criado com sucesso!");
                this.title = "";
                this.description = "";
                this.imageFile = null;
                this.imagePreview = null;
                this.selectedCommunityId = "";
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
