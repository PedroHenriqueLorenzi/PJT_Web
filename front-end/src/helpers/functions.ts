import { useToast } from "vue-toastification";
import router from "../routes/index.ts";

export function handleApiError(error: any): void {
    const toast = useToast();

    if (error.response) {
        const message = error.response.data?.message || "Erro inesperado no servidor.";

        switch (error.response.status) {
            case 400:
                toast.error("Requisição inválida. Verifique os dados e tente novamente.");
                break;

            case 401:
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                toast.error("Sessão expirada. Faça login novamente.");
                router.push("/login");
                break;

            case 403:
                toast.error("Você não tem permissão para realizar esta ação.");
                break;

            case 404:
                toast.error("Recurso não encontrado.");
                break;

            case 500:
                toast.error("Erro interno do servidor. Tente novamente mais tarde.");
                break;

            default:
                toast.error(message);
        }
    } else if (error.request) {
        toast.error("Sem resposta do servidor. Verifique sua conexão com a internet.");
    } else {
        toast.error(`Erro: ${error.message || "Ocorreu um erro desconhecido."}`);
    }

    console.error("API Error:", error);
}
