<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <div class="w-full max-w-md bg-white p-6 rounded-xl shadow-md relative">
            <div class="text-center mb-8">
                <img src="@/assets/images/download.jpg" alt="Logo" class="w-24 h-24 rounded-full mx-auto" />
                <h1 class="text-green-800 text-3xl font-bold mt-2">Login</h1>
                <p class="text-gray-500 text-sm">Bem-vindo! Faça login para continuar.</p>
            </div>

            <input
                v-model="email"
                type="email"
                placeholder="Email"
                class="w-full p-4 mb-4 border border-gray-300 rounded-lg bg-gray-100"
            />
            <input
                v-model="password"
                type="password"
                placeholder="Senha"
                class="w-full p-4 mb-6 border border-gray-300 rounded-lg bg-gray-100"
            />

            <button
                :disabled="loading"
                :class="[
          'w-full p-4 mb-4 rounded-lg flex items-center justify-center font-semibold text-white cursor-pointer hover:shadow-lg transition duration-300 hover:bg-green-600',
          loading ? 'bg-gray-400' : 'bg-green-700'
        ]"
                @click="handleLogin"
            >
                {{ loading ? 'Carregando...' : 'Entrar' }}
            </button>

            <button
                class="w-full p-4 mb-6 bg-red-500 rounded-lg flex items-center justify-center opacity-50 cursor-not-allowed"
                disabled
            >
                <span class="text-white font-semibold">Continuar com o Moodle</span>
            </button>

            <p class="text-center text-gray-600 mt-4">
                Não possui conta?
                <router-link :to="{ name: 'register' }" class="text-green-700 font-semibold hover:underline">Registrar</router-link>
            </p>

            <p class="text-center text-sm text-gray-400 mt-8">
                Feito por TPJ © 2025
            </p>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
import router from "@/routes/index.js";
import { useToast } from "vue-toastification"

export default {
    name: 'Login',

    data() {
        return {
            email: '',
            password: '',
            loading: false,
        };
    },

    methods: {
        async handleLogin() {
            if (!this.email || !this.password) {
                alert('Preencha todos os campos!');
                return;
            }

            this.loading = true;

            try {

                const response = await axios.post('/api/login', {
                    email: this.email,
                    password: this.password,
                });

                if (response.data.success) {
                    useToast().success('Login realizado com sucesso!');
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    router.push('/');
                }

            } catch (err) {
                console.log(err);
                useToast().error('Erro ao fazer login. Verifique suas credenciais.');
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
