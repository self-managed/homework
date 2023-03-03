import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js'

let productModal = null;
let delProductModal = null;

const app = createApp({
    data() {
        return {
            base_url: 'https://vue3-course-api.hexschool.io/v2',
            api_path: 'snowman',
            products: [],
            isNew: false,
            tempProduct: {
                imagesUrl: [],
            },
            pagination: {},
        }
    },
    mounted() {
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
                .catch((err) => {
                    alert(err.response.data.message);
                    window.location = 'login.html';
                })
        },
        getData(page = 1) {
            const url = `${this.base_url}/api/${this.api_path}/admin/products/?page=${page}`;
            axios.get(url)
                .then((response) => {
                    const { products, pagination } = response.data;
                    this.products = products;
                    this.pagination = pagination;
                })
                .catch((err) => {
                    alert(err.response.data.message);
                    //window.location = 'login.html';
                })
        },
        openModal(isNew, item) {
            if (isNew === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
            } else if (isNew === 'edit') {
                this.tempProduct = { ...item };
                this.isNew = false;
                productModal.show();
            } else if (isNew === 'delete') {
                this.tempProduct = { ...item };
                delProductModal.show();
            }
        },
    }
});

// Paging
app.component('pagination', {
    template: '#pagination',
    props: ['pages'],
    methods: {
        emitPages(item) {
            this.$emit('emit-pages', item);
        },
    },
});

// Add/Edit product component
app.component('productModal', {
    template: '#productModal',
    props: ['product', 'isNew'],
    data() {
        return {
            base_url: 'https://vue3-course-api.hexschool.io/v2',
            api_path: 'snowman',
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false,
            backdrop: 'static'
        })
    },
    methods: {
        updateProduct() {
            // Add
            let url = `${this.base_url}/api/${this.api_path}/admin/product`;
            let http = 'post';

            // Edit
            if (!this.isNew) {
                url = `${this.base_url}/api/${this.api_path}/admin/product/${this.product.id}`;
                http = 'put';
            }

            axios[http](url, {
                data: this.product,
            })
                .then((response) => {
                    alert(response.data.message);
                    this.hideModal();
                    this.$emit('update');
                })
                .catch((err) => {
                    alert(err.response.data.message);
                })
        },
        createImages() {
            this.product.imagesUrl = [];
            this.product.imagesUrl.push('');
        },
        openModal() {
            productModal.show();
        },
        hideModal() {
            productModal.hide();
        }
    }
})

// Delete Product
app.component('delProductModal', {
    template: '#delProductModal',
    props: ['item'],
    data() {
        return {
            base_url: 'https://vue3-course-api.hexschool.io/v2',
            api_path: 'snowman',
        }
    },
    mounted() {
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false,
            backdrop: 'static',
        });
    },
    methods: {
        delProduct() {
            const url = `${this.base_url}/api/${this.api_path}/admin/product/${this.item.id}`;
            axios.delete(url)
                .then((response) => {
                    alert(response.data.message);
                    this.hideModal();
                    this.$emit('update');
                })
                .catch((err) => {
                    alert(err.response.data.message);
                })

        },
        openModal() {
            delProductModal.show();
        },
        hideModal() {
            delProductModal.hide();
        }
    },
});

app.mount('#app');