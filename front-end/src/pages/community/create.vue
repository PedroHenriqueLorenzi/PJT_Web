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
            <!-- 1 coluna no mobile / 2 colunas no desktop -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <!-- Lado esquerdo: inputs principais -->
                <div class="space-y-4">

                    <!-- Input nome da comunidade -->
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

                    <!-- Tipo da comunidade -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select
                            v-model="form.type"
                            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-700"
                        >
                            <option value="">Selecione um tipo</option>
                            <option value="course">Curso</option>
                            <option value="department">Departamento</option>
                            <option value="sports">Esportes</option>
                            <option value="student_club">Clube Estudantil</option>
                        </select>
                    </div>
                </div>

                <!-- Lado direito: upload de imagem -->
                <div class="flex flex-col items-center justify-center space-y-4 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-6">
                    
                    <!-- Título do upload -->
                    <label class="text-gray-700 text-sm font-medium">Imagem da Comunidade</label>

                    <!-- Pré-visualização da imagem -->
                    <div class="relative group">

                        <!-- Imagem escolhida -->
                        <img
                            v-if="previewImage"
                            :src="previewImage"
                            class="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover shadow-md border-2 border-green-600"
                        />

                        <!-- Placeholder sem imagem -->
                        <div
                            v-else
                            class="w-32 h-32 md:w-40 md:h-40 rounded-xl flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 text-sm"
                        >
                            Sem imagem
                        </div>

                        <!-- Botão de alterar imagem -->
                        <label
                            class="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
                        >
                            <span class="text-xs font-semibold">Alterar</span>
                            <input type="file" @change="handleFileUpload" accept="image/*" class="hidden" />
                        </label>
                    </div>

                    <!-- Texto auxiliar -->
                    <p class="text-xs text-gray-500 text-center w-40">
                        Formatos aceitos: JPG, PNG (máx. 5MB)
                    </p>
                </div>
            </div>

            <!-- Botão de criar -->
            <div class="mt-10 flex justify-end">
                <button
                    :disabled="loading"
                    @click="createCommunity"
                    :class="[
                        'px-6 py-3 rounded-lg text-white font-semibold transition duration-300 flex items-center gap-2',
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'
                    ]"
                >
                    <!-- Texto do botão -->
                    {{ loading ? 'Criando...' : 'Criar Comunidade' }}

                    <!-- Loader -->
                    <Spinner v-if="loading" />
                </button>
            </div>
        </div>
    </Layout>
</template>

<script lang="ts">
/* Imports principais */
import axios from "axios";
import { useToast } from "vue-toastification";

/* Componentes usados na página */
import Layout from "@/components/layout.vue";
import Input from "@/components/Input.vue";
import Spinner from "@/components/Spinner.vue";

export default {
    name: "CreateCommunity",

    data() {
        return {
            /* Objeto do formulário */
            form: {
                name: "",
                description: "",
                type: "",
                img_url: "",
            },

            /* Pré-visualização da imagem */
            previewImage: "",
            imageFile: null as File | null,

            /* Estado do botão */
            loading: false,
        };
    },

    methods: {
        /* Lê imagem e gera pré-visualização */
        handleFileUpload(event: Event) {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            if (!file.type.startsWith("image/")) return;
            if (file.size > 5 * 1024 * 1024) return;

            this.imageFile = file;

            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewImage = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        },

        /* Envia o formulário para o backend */
        async createCommunity() {
            if (!this.form.name || !this.form.description || !this.form.type) {
                return;
            }

            this.loading = true;

            try {
                const formData = new FormData();
                formData.append("name", this.form.name);
                formData.append("description", this.form.description);
                formData.append("type", this.form.type);

                if (this.imageFile) {
                    formData.append("image", this.imageFile);
                }

                const response = await axios.post("/api/communities", formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.data.success) {
                    useToast().success("Registro criado com sucesso!");

                    /* Reseta formulário */
                    this.form = { name: "", description: "", type: "", img_url: "" };
                    this.previewImage = "";
                    this.imageFile = null;
                }

            } catch (err) {
                console.error("Erro ao criar comunidade:", err);
            } finally {
                this.loading = false;
            }
        },
    },

    components: {
        Spinner,
        Layout,
        Input,
    },
};
</script>
