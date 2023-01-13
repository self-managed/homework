import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js'
const base_url = "https://vue3-course-api.hexschool.io/v2";
const api_path = 'snowman'

const app = {
  data() {
    return {
      products: [],
      selected: {}
    }
  },
  methods: {
    getData() {
      axios.get(`${base_url}/api/${api_path}/admin/products`)
        .then((resp) => {
          this.products = resp.data.products;
        })
        .catch((err) => {
          console.log(err);
        })
    },
    showDetail(item) {
      this.selected = { ...item };
    },
    checkAdmin() {
      axios.post(`https://vue3-course-api.hexschool.io/v2/api/user/check`)
        .then((resp) => {
          this.getData();
        })
        .catch((err) => {
          console.log(err);
          window.location = './login.html'
        })
    }
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschool\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;
    this.checkAdmin();
  }
}

createApp(app).mount('#app');