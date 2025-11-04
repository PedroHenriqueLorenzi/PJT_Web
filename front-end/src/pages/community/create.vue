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
                        'px-6 py-3 rounded-lg text-white font-semibold transition duration-300',
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'
                    ]"
                >
                    {{ loading ? 'Criando...' : 'Criar Comunidade' }}
                </button>
            </div>

            <div v-if="successMessage" class="text-green-600 mt-4 text-sm font-medium">
                {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="text-red-600 mt-4 text-sm font-medium">
                {{ errorMessage }}
            </div>
        </div>
    </Layout>
</template>

<script lang="ts">
import Layout from "@/components/layout.vue";
import Input from "@/components/Input.vue";

export default {
    name: "CreateCommunity",
    components: { Layout, Input },

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
            successMessage: "",
            errorMessage: "",
        };
    },

    methods: {
        handleFileUpload(event: Event) {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            if (!file.type.startsWith("image/")) {
                this.errorMessage = "Apenas arquivos de imagem são permitidos.";
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                this.errorMessage = "A imagem deve ter no máximo 5MB.";
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewImage = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        },

        async createCommunity() {
            this.errorMessage = "";
            this.successMessage = "";

            if (!this.form.name || !this.form.description || !this.form.type) {
                this.errorMessage = "Por favor, preencha todos os campos obrigatórios.";
                return;
            }

            this.loading = true;
            try {
                const payload = { ...this.form, img_url: this.previewImage };
                const response = await fetch("/api/communities", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) throw new Error("Erro ao criar comunidade");

                this.successMessage = "Comunidade criada com sucesso!";
                this.form = { name: "", description: "", type: "", img_url: "" };
                this.previewImage = "";
            } catch (err: any) {
                this.errorMessage = err.message || "Erro ao criar comunidade.";
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
