import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js'

let productModal = null;
let delProductModal = null;

createApp({
    data(){
        return {
            base_url: 'https://vue3-course-api.hexschool.io/v2',
            api_path: 'snowman',
            products: [],
            isNew: false,
            tempProduct: {
                imagesUrl: [],
            }
        }
    },
    mounted(){
        productModal = new bootstrap.Modal(document.getElementById('productModal'),{
            keyboard: false
        });

        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'),{
            keyboard: false
        });

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        this.checkLoginUser();
    },
    methods: {
        checkLoginUser() {
            const url = `${this.base_url}/api/user/check`;
            axios.post(url)
                .then(() => {
                    this.getData();
                })
                .catch((err)=> {
                    alert(err.response.data.message);
                    window.location='login.html';
                })
        },
        getData(){
            const url = `${this.base_url}/api/${this.api_path}/admin/products/all`;
            axios.get(url)
                .then((response) => {
                    this.products = response.data.products;
                })
                .catch((err) => {
                    alert(err.response.data.message);
                })
        },
        updateProduct() {
            let url = `${this.base_url}/api/${this.api_path}/admin/product`;
            let http = 'post';

            if(!this.isNew) {
                url = `${this.base_url}/api/${this.api_path}/admin/product/${this.tempProduct.id}`
                http = 'put'
            }

            axios[http](url, {
                data: this.tempProduct
            })
            .then(( response ) => {
                alert(response.data.message);
                productModal.hide();
                this.getData();
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        },
        openModal(isNew, item) {
            if(isNew === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
            } else if (isNew === 'edit'){
                this.tempProduct = { ...item };
                this.isNew = false;
                productModal.show();
            } else if (isNew === 'delete'){
                this.tempProduct = { ...item };
                delProductModal.show();
            }
        },
        delProduct() {
            const url = `${this.base_url}/api/${this.api_path}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then((response) => {
                    alert(response.data.message);
                    delProductModal.hide();
                    this.getData();
                })
                .catch((err) => {
                    alert(err.response.data.message);
                })
        },
        createImages(){
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        }
    }
}).mount('#app');