import { defineStore } from 'pinia'

export const systemStore = defineStore('store', {
    state: () => ({
        user: null,
    }),
})
