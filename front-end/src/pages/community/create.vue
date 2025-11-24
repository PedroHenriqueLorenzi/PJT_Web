<template>
    <Layout>
        <!-- Container principal responsivo -->
        <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-8 mt-6 md:mt-10">

            <!-- Título da página -->
            <h1 class="text-2xl md:text-3xl font-bold text-green-800 mb-2">
                Criar Comunidade
            </h1>

            <!-- Texto de instrução -->
            <p class="text-gray-500 mb-6 md:mb-8 text-sm">
                Preencha as informações abaixo para criar uma nova comunidade.
            </p>

            <!-- Grid responsiva -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <!-- Inputs principais -->
                <div class="space-y-4">

                    <!-- Nome -->
                    <Input
                        v-model="form.name"
                        type="text"
                        label="Nome da Comunidade"
                        placeholder="Digite o nome"
                    />

                    <!-- Descrição -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                            v-model="form.description"
                            placeholder="Descreva a comunidade"
                            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500 resize-none"
                            rows="4"
                        ></textarea>
                    </div>

                    <!-- Tipo -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>

                        <select
                            v-model="form.type"
                            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-700">
                            <option value="">Selecione um tipo</option>

                            <option
                                v-for="option in typeOptions"
                                :key="option.value"
                                :value="option.value"
                            >
                                {{ option.label }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Upload imagem -->
                <div class="flex flex-col items-center justify-center space-y-4 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-6">

                    <label class="text-gray-700 text-sm font-medium">Imagem da Comunidade</label>

                    <div class="relative group">
                        <!-- Preview -->
                        <img
                            v-if="previewImage"
                            :src="previewImage"
                            class="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover shadow-md border-2 border-green-600"
                        />

                        <!-- Placeholder -->
                        <div
                            v-else
                            class="w-32 h-32 md:w-40 md:h-40 rounded-xl flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 text-sm"
                        >
                            Sem imagem
                        </div>

                        <!-- Botão trocar imagem -->
                        <label
                            class="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
                        >
                            <span class="text-xs font-semibold">Alterar</span>
                            <input type="file" @change="handleFileUpload" accept="image/*" class="hidden" />
                        </label>
                    </div>
                </div>
            </div>

            <!-- Botão -->
            <div class="mt-10 flex justify-end">
                <button
                    :disabled="loading"
                    @click="createCommunity"
                    :class="[
                        'px-6 py-3 rounded-lg text-white font-semibold transition duration-300 flex items-center gap-2',
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'
                    ]"
                >
                    {{ loading ? 'Criando...' : 'Criar Comunidade' }}
                    <Spinner v-if="loading" />
                </button>
            </div>
        </div>
    </Layout>
</template>

<script lang="ts">
/* Imports */
import axios from "axios";
import { useToast } from "vue-toastification";
import Layout from "@/components/layout.vue";
import Input from "@/components/Input.vue";
import Spinner from "@/components/Spinner.vue";

export default {
    name: "CreateCommunity",

    data() {
        return {
            /* Formulário */
            form: {
                name: "",
                description: "",
                type: "",
            },

            /* Estado do upload */
            previewImage: "",
            imageFile: null as File | null,

            /* Loading do botão */
            loading: false,

            typeOptions: [
                { value: "course", label: "Curso" },
                { value: "sports", label: "Esportes" },
                { value: "student_club", label: "Clube Estudantil" },
                { value: "library", label: "Biblioteca" },
                { value: "research_group", label: "Grupo de Pesquisa" },
                { value: "lab", label: "Laboratório" },
                { value: "extension_project", label: "Projeto de Extensão" },
                { value: "event", label: "Evento Universitário" }
            ]
        };
    },

    methods: {
        // ------------------------------------------
        // Upload da imagem
        // ------------------------------------------
        handleFileUpload(event: Event) {
            const file = (event.target as HTMLInputElement).files?.[0];
            const toast = useToast();

            if (!file) return;

            /* Validações básicas */
            if (!file.type.startsWith("image/")) {
                return toast.error("O arquivo deve ser uma imagem.");
            }

            if (file.size > 5 * 1024 * 1024) {
                return toast.error("A imagem deve ter no máximo 5 MB.");
            }

            this.imageFile = file;

            const reader = new FileReader();
            reader.onload = (e) => this.previewImage = e.target?.result as string;
            reader.readAsDataURL(file);
        },

        // ------------------------------------------
        // Criar comunidade
        // ------------------------------------------
        async createCommunity() {
            const toast = useToast();

            /* Validações */
            if (!this.form.name.trim())
                return toast.error("O nome da comunidade é obrigatório.");

            if (this.form.name.length < 3)
                return toast.error("O nome deve ter pelo menos 3 caracteres.");

            if (!this.form.description.trim())
                return toast.error("A descrição é obrigatória.");

            if (this.form.description.length < 10)
                return toast.error("A descrição deve ter pelo menos 10 caracteres.");

            if (!this.form.type)
                return toast.error("Selecione um tipo de comunidade.");

            this.loading = true;

            try {
                const data = new FormData();

                data.append("name", this.form.name);
                data.append("description", this.form.description);
                data.append("type", this.form.type);

                if (this.imageFile) {
                    data.append("image", this.imageFile);
                }

                const response = await axios.post("/api/communities", data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.data.success) {
                    toast.success("Comunidade criada com sucesso!");

                    /* Reset */
                    this.form = { name: "", description: "", type: "" };
                    this.previewImage = "";
                    this.imageFile = null;
                }
            } catch (err) {
                console.error(err);
                toast.error("Erro ao criar comunidade.");
            } finally {
                this.loading = false;
            }
        },
    },

    components: { Layout, Input, Spinner },
};
</script>
