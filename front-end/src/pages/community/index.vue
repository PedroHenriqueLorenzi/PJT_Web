<template>
    <Layout>
        <div class="p-6 max-w-5xl mx-auto">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-green-800">Comunidades</h1>
                    <p class="text-gray-500 text-sm mt-1">
                        Explore as comunidades disponíveis ou crie uma nova.
                    </p>
                </div>

                <RouterLink
                    to="/community/create"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-semibold shadow transition"
                >
                    + Nova Comunidade
                </RouterLink>
            </div>

            <div v-if="loading" class="text-gray-400">Carregando comunidades...</div>
            <div v-else-if="communities.length === 0" class="text-gray-400">
                Nenhuma comunidade encontrada.
            </div>

            <!-- Lista de comunidades -->
            <ul
                v-else
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <li
                    v-for="community in communities"
                    :key="community.id"
                    class="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col border border-gray-100"
                >
                    <!-- Imagem -->
                    <div class="relative mb-4">
                        <img
                            :src="community.img_url || defaultImage"
                            alt="Imagem da comunidade"
                            class="w-full h-40 object-cover rounded-xl border border-gray-200"
                        />
                        <span
                            class="absolute top-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full capitalize"
                        >
                            {{ community.type }}
                        </span>
                    </div>

                    <!-- Conteúdo -->
                    <div class="flex-1 flex flex-col justify-between">
                        <div>
                            <h2 class="text-lg font-semibold text-green-800 truncate">
                                {{ community.name }}
                            </h2>
                            <p class="text-gray-600 text-sm mt-1 line-clamp-3">
                                {{ community.description }}
                            </p>
                        </div>

                        <div class="mt-4 flex items-center justify-between text-xs text-gray-500">
                            <span>Criado em {{ formatDate(community.created_at) }}</span>
                            <button
                                @click="enterCommunity(community)"
                                class="text-green-700 font-medium hover:text-green-900 transition"
                            >
                                Entrar
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </Layout>
</template>

<script lang="ts">
import Layout from "@/components/layout.vue";
import { RouterLink } from "vue-router";

export default {
    name: "CommunityList",

    components: {
        Layout,
        RouterLink,
    },

    data() {
        return {
            loading: false,
            defaultImage:
                "https://placehold.co/300x200?text=Sem+Imagem&font=montserrat",
            communities: [
                {
                    id: 1,
                    name: "Clube de Programação",
                    description:
                        "Comunidade para alunos interessados em desenvolvimento de software, hackathons e maratonas de programação.",
                    type: "student_club",
                    created_by: 2,
                    img_url:
                        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
                    created_at: "2025-05-14T14:23:00Z",
                },
                {
                    id: 2,
                    name: "Departamento de Matemática",
                    description:
                        "Espaço para compartilhar pesquisas, eventos e materiais sobre matemática aplicada e pura.",
                    type: "department",
                    created_by: 1,
                    img_url:
                        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
                    created_at: "2024-11-09T10:45:00Z",
                },
                {
                    id: 3,
                    name: "Esportes Universitários",
                    description:
                        "Organização responsável por torneios, treinos e eventos esportivos dentro do campus.",
                    type: "sports",
                    created_by: 5,
                    img_url:
                        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=400&h=300&fit=crop",
                    created_at: "2025-03-02T09:00:00Z",
                },
                {
                    id: 4,
                    name: "Curso de Engenharia de Software",
                    description:
                        "Comunidade oficial do curso, com informações sobre disciplinas, TCCs, projetos e notícias.",
                    type: "course",
                    created_by: 3,
                    img_url:
                        "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop",
                    created_at: "2023-08-01T08:00:00Z",
                },
            ],
        };
    },

    methods: {
        formatDate(date: string) {
            return new Date(date).toLocaleDateString("pt-BR");
        },

        enterCommunity(community: any) {
            alert(`Entrando em: ${community.name}`);
        },
    },
};
</script>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
