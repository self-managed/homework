import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    data() {
        return {
            base_url: 'https://vue3-course-api.hexschool.io/v2',
            user: {
                username: '',
                password: '',
            }
        }
    },
    methods: {
        login() {
            const api = `${this.base_url}/admin/signin`;

            axios.post(api, this.user)
                .then((response) => {
                    //save token value
                    const { token, expired } = response.data;
                    document.cookie = `hexToken=${token};expires=${new Date(expired)};`
                    window.location = './products.html';
                })
                .catch((err) => {
                    alert(err.response.data.message);
                })
        }
    }
}).mount('#app');