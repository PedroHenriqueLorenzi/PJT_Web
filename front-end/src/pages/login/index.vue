<template>
    <!-- Tela centralizada -->
    <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
        
        <!-- Card principal -->
        <div class="w-full max-w-md bg-white p-6 rounded-2xl shadow-md relative">

            <!-- Logo + título -->
            <div class="text-center mb-8">
                <img
                    src="@/assets/images/download.jpg"
                    alt="Logo"
                    class="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto object-cover"
                />

                <h1 class="text-green-800 text-3xl font-bold mt-3">Login</h1>

                <p class="text-gray-500 text-sm">
                    Bem-vindo! Faça login para continuar.
                </p>
            </div>

            <!-- -------- CAMPOS -------- -->
            <!-- Campo email -->
            <input
                v-model="email"
                type="email"
                placeholder="Email"
                class="w-full p-3 sm:p-4 mb-4 border border-gray-300 rounded-lg bg-gray-100
                       focus:outline-none focus:ring-2 focus:ring-green-600 transition"
            />

            <!-- Campo senha -->
            <input
                v-model="password"
                type="password"
                placeholder="Senha"
                class="w-full p-3 sm:p-4 mb-6 border border-gray-300 rounded-lg bg-gray-100
                       focus:outline-none focus:ring-2 focus:ring-green-600 transition"
            />

            <!-- -------- BOTÃO LOGIN -------- -->
            <button
                :disabled="loading"
                @click="handleLogin"
                :class="[
                    'w-full p-3 sm:p-4 mb-4 rounded-lg font-semibold text-white transition flex items-center justify-center',
                    loading ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-700 hover:bg-green-800 hover:shadow-md'
                ]"
            >
                {{ loading ? 'Carregando...' : 'Entrar' }}
            </button>

            <!-- Botão Moodle (desabilitado) -->
            <button
                class="w-full p-3 sm:p-4 mb-6 bg-red-500 rounded-lg flex items-center justify-center opacity-50 cursor-not-allowed"
                disabled
            >
                <span class="text-white font-semibold text-sm">
                    Continuar com o Moodle
                </span>
            </button>

            <!-- Registrar -->
            <p class="text-center text-gray-600 mt-4 text-sm">
                Não possui conta?
                <router-link
                    :to="{ name: 'register' }"
                    class="text-green-700 font-semibold hover:underline"
                >
                    Registrar
                </router-link>
            </p>

            <!-- Rodapé -->
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

export default {
    name: "Login",

    data() {
        return {
            email: "",
            password: "",
            loading: false,
        };
    },

    methods: {
        // Login básico
        async handleLogin() {
            if (!this.email || !this.password) {
                useToast().error("Preencha todos os campos!");
                return;
            }

            this.loading = true;

            try {
                const response = await axios.post("/api/login", {
                    email: this.email,
                    password: this.password,
                });

                if (response.data.success) {
                    useToast().success("Login realizado com sucesso!");
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem(
                        "user",
                        JSON.stringify(response.data.user)
                    );
                    router.push("/");
                }
            } catch (err) {
                useToast().error("Credenciais incorretas.");
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
