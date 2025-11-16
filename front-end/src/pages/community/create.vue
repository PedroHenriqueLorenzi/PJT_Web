<template>
    <Layout>
        <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
            <h1 class="text-3xl font-bold text-green-800 mb-2">Criar Comunidade</h1>
            <p class="text-gray-500 mb-8 text-sm">
                Preencha as informações abaixo para criar uma nova comunidade.
            </p>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Lado esquerdo -->
                <div class="space-y-4">
                    <Input
                        v-model="form.name"
                        type="text"
                        label="Nome da Comunidade"
                        placeholder="Digite o nome"
                    />
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                            v-model="form.description"
                            placeholder="Descreva a comunidade"
                            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500 resize-none"
                            rows="4"
                        ></textarea>
                    </div>

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

                <!-- Lado direito -->
                <div class="flex flex-col items-center justify-center space-y-4 border-l border-gray-200 pl-6">
                    <label class="text-gray-700 text-sm font-medium">Imagem da Comunidade</label>

                    <div class="relative group">
                        <img
                            v-if="previewImage"
                            :src="previewImage"
                            class="w-40 h-40 rounded-xl object-cover shadow-md border-2 border-green-600"
                        />
                        <div
                            v-else
                            class="w-40 h-40 rounded-xl flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 text-sm"
                        >
                            Sem imagem
                        </div>

                        <label
                            class="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
                        >
                            <span class="text-xs font-semibold">Alterar</span>
                            <input type="file" @change="handleFileUpload" accept="image/*" class="hidden" />
                        </label>
                    </div>

                    <p class="text-xs text-gray-500 text-center w-40">
                        Formatos aceitos: JPG, PNG (máx. 5MB)
                    </p>
                </div>
            </div>

            <div class="mt-10 flex justify-end">
                <button
                    :disabled="loading"
                    @click="createCommunity"
                    :class="[
                        'px-6 py-3 rounded-lg text-white font-semibold transition duration-300 cursor-pointer',
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
    // Aux;
    import axios from "axios";
    import {useToast} from "vue-toastification";

    // Components;
    import Layout from "@/components/layout.vue";
    import Input from "@/components/Input.vue";
    import Spinner from "@/components/Spinner.vue";

    export default {
        name: "CreateCommunity",

        data() {
            return {
                form: {
                    name: "",
                    description: "",
                    type: "",
                    img_url: "",
                },
                previewImage: "",
                loading: false,
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
                    this.previewImage = e.target?.result as string;
                };
                reader.readAsDataURL(file);
            },

            async createCommunity() {
                if (!this.form.name || !this.form.description || !this.form.type) {
                    return;
                }

                this.loading = true;
                try {

                    const payload = { ...this.form, img_url: this.previewImage };
                    const response = await axios.post("/api/communities", payload, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    if (response.data.success) {
                        useToast().success("Registro criado com sucesso!");
                        // Reset form;
                        this.form = { name: "", description: "", type: "", img_url: "" };
                        this.previewImage = "";
                    }
                } catch (err: any) {
                    console.error("Erro ao criar comunidade:", err);
                } finally {
                    this.loading = false;
                }
            },
        },

        components: {
            Spinner,
            Layout,
            Input
        },
    };
</script>
