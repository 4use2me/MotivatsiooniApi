
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from "@/views/AuthView.vue"; // AuthView tuleb views kaustast
import LoggedInUserView from "@/views/LoggedInUserView.vue";
import AdminView from "@/views/AdminView.vue";
import RandomMotivation from '../components/RandomMotivation.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: "/auth",
      name: "AuthView",
      component: AuthView,
    },
    {
      path: "/admin",
      name: "AdminView",
      component: AdminView,
    },
    {
      path: "/loggedin/:username",
      name: "LoggedInUserView",
      component: LoggedInUserView,
      props: true, // Edasta parameeter propsina
    },
    {
      path: '/random',
      name: 'random',
      component: RandomMotivation,
    },
  ],
})

export default router
