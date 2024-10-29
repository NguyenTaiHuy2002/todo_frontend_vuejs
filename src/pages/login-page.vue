<template>
<head>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<!-- Bootstrap CSS -->


  <section class="">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card bg-dark text-white" style="border-radius: 1rem">
            <div class="card-body p-5 text-center">
              <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
              <p class="text-white-50 mb-5">
                Please enter your login and password!
              </p>
              <form @submit.prevent="login" class="mb-md-5 mt-md-4 pb-5">

                <div data-mdb-input-init class="form-outline form-white mb-4">
                  <label class="form-label" for="typeEmailX">Username</label>
                  <input
                    v-model="username"
                    id="typeEmailX"
                    class="form-control form-control-lg"
                    required
                  />
                </div>

                <div data-mdb-input-init class="form-outline form-white mb-4">
                  <label class="form-label" for="typePasswordX">Password</label>
                  <input
                    v-model="password"
                    type="password"
                    id="typePasswordX"
                    class="form-control form-control-lg"
                    required
                  />
                </div>
                <p v-if="error" class="error-validate"> {{ error}}</p> 

                <p class="small mb-5 pb-lg-2">
                  <a class="text-white-50" href="#!">Forgot password?</a>
                </p>

                <button
                  data-mdb-button-init
                  data-mdb-ripple-init
                  class="btn btn-outline-light btn-lg px-5"
                  type="submit"
                >
                  Login
                </button>
              </form>


              <div>
                <p class="mb-0">
                  Don't have an account?
                  <router-link to="/register-view" class="text-white-50 fw-bold">Sign Up</router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
// import router from '@/router'
import {loginUser} from '../apis/auth'
// import { useRoute } from 'vue-router'
import { ref } from 'vue'
import router from '@/router'
import {useStore} from 'vuex'
import Swal from 'sweetalert2' // Import SweetAlert2

export default {
  setup() {
    // router = useRoute()
    const username = ref('')
    const password = ref('')
    const error = ref(null)
    const store = useStore();


    const login = async () => {
      error.value = null;

      try {
        const response =  await loginUser({username: username.value, password: password.value});

        // Hiển thị thông báo thành công với SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Login Success!',
          text: 'You have successfully logged in.',
          timer: 4000,
          showConfirmButton: true,
        }).then (() => {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user)); // Lưu thông tin người dùng
          store.dispatch('login', response.user);
          router.push('/to-do')
        })
        // Lưu token vào localStorage
      } catch (err) {
        error.value = "Username or password is not correct!";
      }
    }
    return {
      username,
      password,
      error,
      login,
    }
  },
}
</script>

<style scoped>



.gradient-custom {
  /* fallback for old browsers */
  background: #6a11cb;

  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(
    to right,
    rgba(106, 17, 203, 1),
    rgba(37, 117, 252, 1)
  );

  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(
    to right,
    rgba(106, 17, 203, 1),
    rgba(37, 117, 252, 1)
  );
}

.error-validate {
  color: red;
}
</style>