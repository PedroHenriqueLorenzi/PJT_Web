<template>
    <div class="min-h-screen flex bg-gray-100">

        <!-- ============================
             COLUNA ESQUERDA (DESKTOP)
        ============================ -->
        <div
            class="hidden lg:flex w-1/2 bg-green-700 text-white flex-col
                   items-center justify-center p-12"
        >
            <img
                src="@/assets/images/download.jpg"
                alt="Logo"
                class="w-32 h-32 rounded-full mb-6 shadow-lg"
            />

            <h1 class="text-4xl font-extrabold mb-2">Bem-vindo(a)!</h1>
            <p class="text-green-100 text-lg text-center max-w-sm">
                Crie sua conta e junte-se à nossa comunidade.
            </p>
        </div>

        <!-- ============================
             COLUNA DIREITA (FORM)
        ============================ -->
        <div
            class="flex flex-col justify-center w-full lg:w-1/2 px-6 sm:px-10 py-12
                   bg-white shadow-xl rounded-none lg:rounded-l-3xl"
        >
            <h2 class="text-3xl font-bold text-green-800 text-center mb-4">Registrar</h2>
            <p class="text-gray-500 text-center mb-8 text-sm">
                Preencha seus dados para criar sua conta
            </p>

            <!-- FORM -->
            <div class="space-y-4">

                <!-- Linha Nome + Username + Avatar -->
                <div
                    class="flex flex-col lg:flex-row lg:items-start lg:space-x-4
                           space-y-4 lg:space-y-0"
                >
                    <!-- Inputs -->
                    <div class="flex-1 space-y-4">
                        <Input
                            v-model="name"
                            type="text"
                            label="Nome completo"
                            placeholder="Digite seu nome completo"
                            :disabled="loading"
                        />

                        <Input
                            v-model="username"
                            type="text"
                            label="Nome de usuário"
                            placeholder="Digite seu nome de usuário"
                            :disabled="loading"
                        />
                    </div>

                    <!-- Avatar -->
                    <div class="flex flex-col items-center space-y-3">
                        <label class="text-gray-700 text-sm font-medium">Avatar</label>

                        <div class="relative group">
                            <!-- Prévia -->
                            <img
                                v-if="previewAvatar"
                                :src="previewAvatar"
                                class="w-24 h-24 rounded-full object-cover shadow-md border-2 border-green-600"
                            />

                            <!-- Placeholder -->
                            <div
                                v-else
                                class="w-24 h-24 rounded-full flex items-center justify-center
                                       bg-gray-100 border-2 border-dashed border-gray-300
                                       text-gray-400 text-sm"
                            >
                                Sem imagem
                            </div>

                            <!-- Botão overlay -->
                            <label
                                class="absolute inset-0 bg-black bg-opacity-50 rounded-full
                                       flex items-center justify-center text-white opacity-0
                                       group-hover:opacity-100 transition cursor-pointer"
                            >
                                <span class="text-xs font-semibold">Alterar</span>
                                <input
                                    type="file"
                                    @change="handleFileUpload"
                                    accept="image/*"
                                    class="hidden"
                                    :disabled="loading"
                                />
                            </label>
                        </div>

                        <p class="text-[11px] text-gray-500 text-center leading-tight">
                            JPG, PNG…
                        </p>
                    </div>
                </div>

                <!-- Email -->
                <Input
                    v-model="email"
                    type="email"
                    label="Email"
                    placeholder="Digite seu email"
                    :disabled="loading"
                />

                <!-- Senha -->
                <Input
                    v-model="password"
                    type="password"
                    label="Senha"
                    placeholder="Digite sua senha"
                    :disabled="loading"
                />

                <!-- Idade -->
                <Input
                    v-model="age"
                    type="number"
                    label="Idade"
                    placeholder="Digite sua idade"
                    :disabled="loading"
                />

                <!-- Notificações -->
                <div class="flex items-center text-sm">
                    <input
                        type="checkbox"
                        id="notification"
                        v-model="notification"
                        class="mr-2 accent-green-700"
                        :disabled="loading"
                    />
                    <label for="notification" class="text-gray-700">
                        Receber notificações
                    </label>
                </div>

                <!-- BOTÃO REGISTRAR -->
                <button
                    :disabled="loading"
                    @click="handleRegister"
                    :class="[
                        'w-full p-3 rounded-lg text-white font-semibold transition duration-300',
                        loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-700 hover:bg-green-800'
                    ]"
                >
                    {{ loading ? "Carregando..." : "Registrar" }}
                </button>
            </div>

            <p class="text-center text-gray-600 mt-6">
                Já possui conta?
                <router-link to="/login" class="text-green-700 font-semibold hover:underline">
                    Entrar
                </router-link>
            </p>

            <p class="text-center text-xs text-gray-400 mt-8">
                Feito por TPJ © 2025
            </p>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import router from "@/routes/index.js";
import { useToast } from "vue-toastification";
import Input from "@/components/Input.vue";

export default {
    name: "Register",

    data() {
        return {
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

    methods: {
        /* -----------------------------
           Preview simples do avatar
        ----------------------------- */
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Validação de tipo
            if (!file.type.startsWith("image/")) {
                useToast().error("Selecione uma imagem válida.");
                return;
            }

            // Validação leve de tamanho
            if (file.size > 5 * 1024 * 1024) {
                useToast().error("Imagem muito grande. Máx. 5MB.");
                return;
            }

            this.avatarFile = file;

            const reader = new FileReader();
            reader.onload = (e) => (this.previewAvatar = e.target.result);
            reader.readAsDataURL(file);
        },

        /* -----------------------------
           Converte imagem para Base64
        ----------------------------- */
        convertFileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        },

        /* -----------------------------
           Registra usuário
        ----------------------------- */
        async handleRegister() {
            const toast = useToast();

            // Validação dos campos
            if (!this.name.trim() ||
                !this.username.trim() ||
                !this.email.trim() ||
                !this.password.trim() ||
                !this.age
            ) {
                toast.error("Preencha todos os campos obrigatórios.");
                return;
            }

            this.loading = true;

            try {
                let avatarBase64 = null;

                if (this.avatarFile) {
                    avatarBase64 = await this.convertFileToBase64(this.avatarFile);
                }

                const payload = {
                    name: this.name.trim(),
                    username: this.username.trim(),
                    email: this.email.trim(),
                    password: this.password,
                    age: this.age,
                    notification: this.notification,
                    avatar_url: avatarBase64,
                };

                const response = await axios.post("/api/register", payload);

                if (response.data.success) {
                    toast.success("Registro realizado com sucesso!");
                    router.push("/login");
                }
            } catch (err) {
                console.error(err);
                toast.error("Erro ao registrar usuário.");
            } finally {
                this.loading = false;
            }
        },
    },

    components: { Input },
};
</script>
