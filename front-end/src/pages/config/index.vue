<template>
    <Layout>
        <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
            <h1 class="text-3xl font-bold text-green-800 mb-2">Configurações da Conta</h1>
            <p class="text-gray-500 mb-8 text-sm">
                Atualize suas informações pessoais e preferências abaixo.
            </p>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <Input
                        v-model="name"
                        type="text"
                        label="Nome completo"
                        placeholder="Digite seu nome completo"
                    />
                    <Input
                        v-model="username"
                        type="text"
                        label="Nome de usuário"
                        placeholder="Digite seu nome de usuário"
                    />
                    <Input
                        v-model="email"
                        type="email"
                        label="Email"
                        placeholder="Digite seu email"
                    />
                    <Input
                        v-model="password"
                        type="password"
                        label="Nova senha"
                        placeholder="Deixe em branco se não quiser alterar"
                    />
                    <Input
                        v-model="age"
                        type="number"
                        label="Idade"
                        placeholder="Digite sua idade"
                    />
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

                <div class="flex flex-col items-center justify-center space-y-4 border-l border-gray-200 pl-6">
                    <label class="text-gray-700 text-sm font-medium">Avatar</label>

                    <div class="relative group">
                        <img
                            v-if="previewAvatar"
                            :src="avatarSrc"
                            class="w-32 h-32 rounded-full object-cover shadow-md border-2 border-green-600"
                        />
                        <div
                            v-else
                            class="w-32 h-32 rounded-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 text-sm"
                        >
                            Sem imagem
                        </div>

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

            <div class="mt-10 flex justify-end gap-2">
                <button
                    :disabled="loading"
                    @click="handleUpdate"
                    :class="[
                        'px-6 py-3 rounded-lg text-white font-semibold transition duration-300 cursor-pointer',
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'
                    ]"
                >
                    {{ loading ? 'Salvando...' : 'Salvar alterações' }}
                </button>

                <button
                    :disabled="loading"
                    @click="deleteAccount"
                    :class="[
                        'px-6 py-3 rounded-lg text-white font-semibold transition duration-300 cursor-pointer',
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800'
                    ]"
                >
                    {{ 'Excluir conta' }}
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
import {handleApiError} from "@/helpers/functions.js";

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
        avatarSrc() {
            if (!this.previewAvatar) return null;
            // se for data URL ou já um URL absoluto, use direto
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
        async loadUserData() {
            try {
                const response = await axios.get("/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
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

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            this.avatarFile = file;

            const reader = new FileReader();
            reader.onload = (e) => (this.previewAvatar = e.target.result);
            reader.readAsDataURL(file);
        },

        async handleUpdate() {
            this.loading = true;
            try {
                const formData = new FormData();

                formData.append("name", this.name);
                formData.append("username", this.username);
                formData.append("email", this.email);
                formData.append("age", this.age);
                formData.append("notification", this.notification);

                if (this.password) {
                    formData.append("password", this.password);
                }

                if (this.avatarFile) {
                    formData.append("avatar", this.avatarFile);
                }

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
                console.error(err);
                useToast().error("Erro ao atualizar perfil.");
            } finally {
                this.loading = false;
            }
        },

        async deleteAccount() {
            try {
                this.loading = true;
                const confirmed = confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.");
                if (!confirmed) {
                    this.loading = false;
                    return;
                }

                const response = await axios.delete("/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.data.success) {
                    useToast().success("Até nunca mais.");
                    localStorage.removeItem("token");
                    this.$router.push("/login");
                }
            } catch (err) {
                console.error(err);
                useToast().error("Erro ao excluir conta.");
            } finally {
                this.loading = false;
            }
        }
    },

    mounted() {
        this.loadUserData();
    },
};
</script>
