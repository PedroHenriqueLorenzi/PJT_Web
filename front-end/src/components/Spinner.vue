<template>
    <div class="fixed inset-0 flex items-center justify-center z-50">
        <FontAwesomeIcon
            icon="fa-solid fa-spinner"
            class="text-lg animate-spin"
        />
    </div>
</template>

<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
    import { library } from "@fortawesome/fontawesome-svg-core";
    import { faSpinner } from "@fortawesome/free-solid-svg-icons";

    library.add(faSpinner);
    export default {
        name: "Spinner",
        components: { FontAwesomeIcon },
    };
</script>
