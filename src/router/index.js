import { createRouter, createWebHistory } from 'vue-router';
import ItemDetails from '../views/ItemDetails.vue'
import AddItem from '../views/AddItem.vue';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/add-item',
    name: 'AddItem',
    component: AddItem
  },
  {
    path: '/item-details/:itemId',
    name: 'ItemDetails',
    component: ItemDetails,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;