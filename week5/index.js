import userProductModal from './userProductModal.js';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

const api_base = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'snowman';

Vue.createApp({
  data() {
    return {
      loadingStatus: {
        loadingItem: '',
      },
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    getProducts() {
      const url = `${api_base}/api/${api_path}/products`;
      axios.get(url)
        .then((response) => {
          this.products = response.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getProduct(id) {
      const url = `${api_base}/api/${api_path}/product/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.get(url)
        .then((response) => {
          this.loadingStatus.loadingItem = '';
          this.product = response.data.product;
          this.$refs.userProductModal.openModal();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    addToCart(id, qty = 1) {
      const url = `${api_base}/api/${api_path}/cart`;
      this.loadingStatus.loadingItem = id;
      const cart = {
        product_id: id,
        qty,
      };

      this.$refs.userProductModal.hideModal();
      axios.post(url, { data: cart })
        .then((response) => {
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    updateCart(data) {
      this.loadingStatus.loadingItem = data.id;
      const url = `${api_base}/api/${api_path}/cart/${data.id}`;
      const cart = {
        product_id: data.product_id,
        qty: data.qty,
      };
      axios.put(url, { data: cart })
        .then((response) => {
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
          this.loadingStatus.loadingItem = '';
        });
    },
    deleteAllCarts() {
      const url = `${api_base}/api/${api_path}/carts`;
      axios.delete(url)
        .then((response) => {
          alert(response.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getCart() {
      const url = `${api_base}/api/${api_path}/cart`;
      axios.get(url)
        .then((response) => {
          this.cart = response.data.data;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    removeCartItem(id) {
      const url = `${api_base}/api/${api_path}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.delete(url)
        .then((response) => {
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    createOrder() {
      const url = `${api_base}/api/${api_path}/order`;
      const order = this.form;
      axios.post(url, { data: order })
        .then((response) => {
          alert(response.data.message);
          this.$refs.form.resetForm();
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
})
  .component('userProductModal', userProductModal)
  .mount('#app');