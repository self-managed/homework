import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/Index.vue'),
      },
      {
        path: '/products',
        name: 'ProductsList',
        component: () => import('../views/Products.vue'),
      },
      {
        path: '/product/:id',
        name: 'ProductDetail',
        component: () => import('../views/Product.vue'),
      },
      {
        path: '/cart',
        name: 'Cart',
        component: () => import('../views/Cart.vue'),
      },
    ],
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router