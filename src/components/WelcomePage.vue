<template>
  <div>
    <h1 class="animated-title">WELCOME TO TODOS</h1>
  </div>
</template>

<style scoped>
#app {
  padding-top: unset !important;
  padding-bottom: unset !important;
}
  

div {
  display: flex;
  justify-content: center; /* Căn giữa theo chiều ngang */
  align-items: center; /* Căn giữa theo chiều dọc */
  width: 100%;
  height: 100vh; /* Chiều cao toàn màn hình */
  background: linear-gradient(to right, #767af5, #f7af85);
}

h1 {
  font-size: 70px;
  text-align: center;
  font-family: cursive;
  font-weight: 600;
  color: #fff;
  animation: zoomFade 1s ease-in-out; /* Hiệu ứng động */
}

/* Định nghĩa hiệu ứng động với @keyframes */
  @keyframes zoomFade {
    0% {
      transform: scale(0.7); /* Bắt đầu với kích thước nhỏ */
      opacity: 0.1; /* Bắt đầu mờ */
    }
    50% {
      transform: scale(1.2); /* Bắt đầu với kích thước nhỏ */
      opacity: 1; /* Bắt đầu mờ */
    }
    100% {
      transform: scale(1); /* Trở về kích thước ban đầu */
      opacity: 1; /* Duy trì hiển thị rõ */
    }
  }
</style>
