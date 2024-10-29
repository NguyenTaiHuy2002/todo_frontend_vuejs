import { createRouter, createWebHistory } from 'vue-router';
import ToDo from './components/ToDo.vue';
import LoginPage from './pages/login-page.vue'
import Welcome from './components/WelcomePage.vue'
import SignupPage from './pages/register-page.vue'
import { store } from './stores/userAuth'; // Import store từ file store.js


const routes = [
    {
        path: '/',
        component: Welcome
    }, // Sử dụng 'component' thay vì 'components'
    {
        path: '/login-view',
        component: LoginPage
    },
    {
        path: '/register-view',
        component: SignupPage
    },
    {
        path: '/to-do',
        component: ToDo,
        meta: {requireAuth: true}
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Route Guard để kiểm tra xác thực
router.beforeEach((to, from, next) => {
    const isAuthenticated = store.state.isAuthenticated; // Lấy trạng thái xác thực từ Vuex
  
    if (to.matched.some(record => record.meta.requireAuth) && !isAuthenticated) {
      // Nếu route yêu cầu xác thực và người dùng chưa xác thực
      next('/login-view'); // Chuyển hướng về trang đăng nhập
    } else {
      next(); // Nếu không, cho phép tiếp tục
    }
  });

export default router; // Xuất router