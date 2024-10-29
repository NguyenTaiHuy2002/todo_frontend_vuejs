<template>
  <head>
    <!-- Bootstrap CSS -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
  </head>

  <!-- Bootstrap CSS -->

  <section class="">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card bg-dark text-white" style="border-radius: 1rem">
            <div class="card-body p-5 text-center">
              <h2 class="fw-bold mb-2 text-uppercase">Register</h2>
              <p class="text-white-50 mb-5">
                Please enter your email and password to register account!
              </p>
              <form @submit.prevent="register" class="mb-md-5 mt-md-4 pb-5">

                <div data-mdb-input-init class="form-outline form-white mb-4">
                  <label class="form-label" for="typeEmailX">Username</label>
                  <input v-model="username" class="form-control form-control-lg" required/>
                </div>

                <div data-mdb-input-init class="form-outline form-white mb-4">
                  <label class="form-label" for="typePasswordX">Password</label>
                  <input v-model="password" type="password" id="typePasswordX" class="form-control form-control-lg" required />
                </div>

                <div data-mdb-input-init class="form-outline form-white mb-4">
                  <label class="form-label" for="typePasswordX">Confirm password</label>
                  <input v-model="confirm_password" type="password" id="typePasswordX" class="form-control form-control-lg" required/>
                </div>
                
                <p class="error-validate" v-if="error">{{error}}</p>

                <button data-mdb-button-init data-mdb-ripple-init class="btn btn-outline-light btn-lg px-5 mt-5" type="submit" >
                  Register
                </button>

                <!-- <div
                  class="d-flex justify-content-center text-center mt-4 pt-1"
                >
                  <a href="#!" class="text-white"
                    ><i class="fab fa-facebook-f fa-lg"></i
                  ></a>
                  <a href="#!" class="text-white"
                    ><i class="fab fa-twitter fa-lg mx-4 px-2"></i
                  ></a>
                  <a href="#!" class="text-white"
                    ><i class="fab fa-google fa-lg"></i
                  ></a>
                </div> -->
              </form>

              <div>
                <p class="mb-0">
                  Have an account?
                  <router-link to="/login-view" class="text-white-50 fw-bold">Log in</router-link>
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
import { ref } from 'vue'
import {registerUser} from '../apis/auth'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2' // Import SweetAlert2

export default {
  setup() {
    const router = useRouter();
    const username = ref('')
    const password = ref('')
    const confirm_password = ref('')
    const error = ref(null)

    const register = async () => {
      error.value = null;

      if(password.value !== confirm_password.value){
        error.value= "Password does not match!";
        return;
      }
      try {
        await registerUser({username: username.value, password: password.value});
        // Hiển thị thông báo thành công với SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Register Success!',
          text: 'You have successfully signed in.',
          timer: 4000,
          showConfirmButton: true,
        }).then (() => {
          router.push('/login-view')
        })
      } catch (err) {
          
          error.value = err.response.data.message;
      }
    }

    return {
      username,
      password,
      confirm_password,
      error,
      register,
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