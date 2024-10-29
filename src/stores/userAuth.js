// import { ref } from "vue";

// export function userAuth(){
//     const token = ref(localStorage.getItem('access_token'));
//     // const user = ref(localStorage.getItem('user'));
//     const user = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
    
//     const logout = () => {
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('user');
//         token.value = null;
//         user.value = null;
//       };
//     const isAuthenticated = () => {
//         return !!token.value;
//     }


//     return {
//         token,
//         user,
//         isAuthenticated,
//         logout,
//     }
// }

import { createStore } from "vuex"; 
export const store = createStore({
    state: {
        isAuthenticated: !!localStorage.getItem('access_token'),
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    },

    mutations: {
        setAuth(state, user){
            state.isAuthenticated = true;
            state.user = user;
        },
        clearAuth(state){
            state.isAuthenticated = false,
            state.user = null
        }
    },

    actions: {
        login({commit}, user){
            commit('setAuth', user);
        },
        logout({ commit }) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            commit('clearAuth');
          }
    }

})