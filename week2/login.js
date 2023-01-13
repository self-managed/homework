import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js'
const base_url = "https://vue3-course-api.hexschool.io/v2"

const app = {
    data() {
        return {
            user: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            axios.post(`${base_url}/admin/signin`, this.user)
                .then((resp) => {
                    console.log(resp);
                    const { token, expired } = resp.data;
                    document.cookie = `hexschool=${token}; expires=${expired};`
                    window.location = './products.html'
                })
                .catch((err) => {
                    console.log(err);
                })
        },


    },
    mounted() {

    }

}

createApp(app).mount('#app');