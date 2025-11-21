<template>
    <Layout>
        <!-- Container principal responsivo -->
        <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-8 mt-10">

            <!-- Título -->
            <h1 class="text-2xl md:text-3xl font-bold text-green-800 mb-2">
                Configurações da Conta
            </h1>

            <p class="text-gray-500 mb-6 md:mb-8 text-sm">
                Atualize suas informações pessoais e preferências abaixo.
            </p>

            <!-- Grid responsivo: 1 coluna no mobile / 2 no desktop -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <!-- Coluna esquerda: Inputs -->
                <div class="space-y-4">
                    <!-- Nome -->
                    <Input
                        v-model="name"
                        type="text"
                        label="Nome completo"
                        placeholder="Digite seu nome completo"
                    />

                    <!-- Username -->
                    <Input
                        v-model="username"
                        type="text"
                        label="Nome de usuário"
                        placeholder="Digite seu nome de usuário"
                    />

                    <!-- Email -->
                    <Input
                        v-model="email"
                        type="email"
                        label="Email"
                        placeholder="Digite seu email"
                    />

                    <!-- Senha nova -->
                    <Input
                        v-model="password"
                        type="password"
                        label="Nova senha"
                        placeholder="Deixe em branco se não quiser alterar"
                    />

                    <!-- Idade -->
                    <Input
                        v-model="age"
                        type="number"
                        label="Idade"
                        placeholder="Digite sua idade"
                    />

                    <!-- Checkbox notificação -->
                    <div class="flex items-center text-sm">
                        <input
                            type="checkbox"
                            id="notification"
                            v-model="notification"
                            class="mr-2 accent-green-700"
                        />
                        <label for="notification" class="text-gray-700">
                            Receber notificações
                        </label>
                    </div>
                </div>

                <!-- Coluna direita: Avatar -->
                <div
                    class="flex flex-col items-center justify-center space-y-4 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-6"
                >
                    <label class="text-gray-700 text-sm font-medium">Avatar</label>

                    <!-- Imagem do avatar -->
                    <div class="relative group">
                        <!-- Se houver preview -->
                        <img
                            v-if="previewAvatar"
                            :src="avatarSrc"
                            class="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow-md border-2 border-green-600"
                        />

                        <!-- Estado sem imagem -->
                        <div
                            v-else
                            class="w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 text-sm"
                        >
                            Sem imagem
                        </div>

                        <!-- Botão sobreposto: alterar avatar -->
                        <label
                            class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
                        >
                            <span class="text-xs font-semibold">Alterar</span>
                            <input type="file" @change="handleFileUpload" accept="image/*" class="hidden" />
                        </label>
                    </div>

                    <p class="text-xs text-gray-500">Formatos aceitos: JPG, PNG (máx. 5MB)</p>
                </div>
            </div>

            <!-- Botões -->
            <div class="mt-10 flex flex-col sm:flex-row justify-end gap-3">
                
                <!-- Botão salvar -->
                <button
                    :disabled="loading"
                    @click="handleUpdate"
                    :class="[
                        'px-6 py-3 rounded-lg text-white font-semibold transition duration-300',
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'
                    ]"
                >
                    {{ loading ? 'Salvando...' : 'Salvar alterações' }}
                </button>

                <!-- Botão excluir conta -->
                <button
                    :disabled="loading"
                    @click="deleteAccount"
                    :class="[
                        'px-6 py-3 rounded-lg text-white font-semibold transition duration-300',
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800'
                    ]"
                >
                    Excluir conta
                </button>
            </div>
        </div>
    </Layout>
</template>

<script>
import Input from "@/components/Input.vue";
import Layout from "@/components/layout.vue";
import { useToast } from "vue-toastification";
import axios from "axios";
import { handleApiError } from "@/helpers/functions.js";

export default {
    name: "ConfigPage",

    components: { Input, Layout },

    data() {
        return {
            API: import.meta.env.VITE_API,
            name: "",
            username: "",
            email: "",
            password: "",
            age: "",
            notification: false,
            avatarFile: null,
            previewAvatar: null,
            loading: false,
        };
    },

    computed: {
        /* Retorna URL final do avatar */
        avatarSrc() {
            if (!this.previewAvatar) return null;

            if (
                typeof this.previewAvatar === "string" &&
                (this.previewAvatar.startsWith("data:") ||
                 this.previewAvatar.startsWith("http://") ||
                 this.previewAvatar.startsWith("https://"))
            ) {
                return this.previewAvatar;
            }

            return `${this.API}${this.previewAvatar}`;
        },
    },

    methods: {
        /* Carrega dados do usuário na montagem */
        async loadUserData() {
            try {
                const response = await axios.get("/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const user = response.data;

                this.name = user.name;
                this.username = user.username;
                this.email = user.email;
                this.age = user.age;
                this.notification = user.notification;
                this.previewAvatar = user.avatar_url;

            } catch (err) {
                handleApiError(err);
            }
        },

        /* Upload do avatar */
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            this.avatarFile = file;

            const reader = new FileReader();
            reader.onload = (e) => (this.previewAvatar = e.target.result);
            reader.readAsDataURL(file);
        },

        /* Salvar alterações */
        async handleUpdate() {
            this.loading = true;
            try {
                const formData = new FormData();

                formData.append("name", this.name);
                formData.append("username", this.username);
                formData.append("email", this.email);
                formData.append("age", this.age);
                formData.append("notification", this.notification);

                if (this.password) formData.append("password", this.password);
                if (this.avatarFile) formData.append("avatar", this.avatarFile);

                const response = await axios.patch("/api/users/me", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.data.success) {
                    useToast().success("Informações atualizadas com sucesso!");
                }
            } catch (err) {
                useToast().error("Erro ao atualizar perfil.");
            } finally {
                this.loading = false;
            }
        },

        /* Excluir conta */
        async deleteAccount() {
            try {
                this.loading = true;

                const confirmed = confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.");
                if (!confirmed) return (this.loading = false);

                const response = await axios.delete("/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.data.success) {
                    useToast().success("Até nunca mais.");
                    localStorage.removeItem("token");
                    this.$router.push("/login");
                }
            } catch (err) {
                useToast().error("Erro ao excluir conta.");
            } finally {
                this.loading = false;
            }
        },
    },

    mounted() {
        this.loadUserData();
    },
};
</script>
