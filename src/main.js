import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import router
import {store} from './stores/userAuth'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App); // Tạo instance của ứng dụng
app.use(Toast, {
    position: POSITION.TOP_CENTER,  // Vị trí hiển thị toast (giữa phía trên màn hình)
    timeout: 3000,                  // Thời gian hiển thị của toast (3 giây)
    closeOnClick: true,              // Đóng toast khi click vào
    pauseOnHover: true,              // Dừng đếm thời gian khi hover chuột vào
})
app.use(store);
app.use(router); // Sử dụng router
app.mount('#app'); // Gắn ứng dụng vào phần tử HTML
