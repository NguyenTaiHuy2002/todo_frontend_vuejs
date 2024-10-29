<template>
  <section class="main-wrap">
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      rel="stylesheet"
    />
    <h1 class="title mb-3">TASK MANAGER</h1>
    <div class="input_todo">
      <input
        type="text"
        v-model="inputValue"
        @keyup.enter="addItemTodo"
        class="input-text"
        placeholder="Example: Learning English..."
      />
      <button class="btn-add" v-on:click="addItemTodo">Add</button>
    </div>
    <div class="list_todo">
      <h3 class="mt-2">Todo List</h3>
      <div class="sub-list">
        <div class="btns-filter mb-3" v-if="!isMobile">
          <span>Filter:</span>
          <button
            class="btn-filter"
            :class="{ active: filterStatus === 'completed' }"
            v-on:click="filterTaskComplete"
          >
            Task completed
          </button>
          <button
            class="btn-filter"
            :class="{ active: filterStatus === 'notCompleted' }"
            v-on:click="filterTaskNotComplete"
          >
            Task not completed
          </button>
          <button class="btn-filter" :class="{ active: filterStatus === 'hidden' }" v-on:click="filterTaskHidden">Hidden list</button>
          <button class="btn-filter" v-on:click="resetFilter">Reset filter</button>
        </div>
        
        <div class="btns-filter-mobile mb-3" v-if="isMobile">
          <span>Filter:</span>
          <span class="btn-choose-type" @click="toggleFilterMobile" :class="{ isActivedFilterMobile: isOpenFilterGroupMobile }" >Choose type filter <i class="fa-solid fa-chevron-down"></i></span>
          <ul class="btns-filter-group" @click="toggleFilterMobile" v-if="isOpenFilterGroupMobile">
            <li>
              <button class="btn-filter mb-2 w-100" :class="{ active: filterStatus === 'completed' }" v-on:click="filterTaskComplete">Task completed</button>
            </li>
            <li>
              <button class="btn-filter mb-2 w-100" :class="{ active: filterStatus === 'notCompleted' }" v-on:click="filterTaskNotComplete">Task not completed</button>
            </li>
            <li>
              <button class="btn-filter mb-2 w-100" :class="{ active: filterStatus === 'hidden' }" v-on:click="filterTaskHidden">Hidden list</button>
            </li>
            <li>
              <button class="btn-filter mb-2 w-100" v-on:click="resetFilter">Reset filter</button>
            </li>
          </ul>
        </div>

        <div class="btn-filter-extend mb-3">
          
          <span
            @click="toggleFilterExtend"
            :class="{ isActived: isOpenFilterExtend }"
            >Filter more <i class="fa-solid fa-chevron-down"></i
          ></span>
        </div>
      </div>
      <div class="filter-extend-wrap mb-3" v-if="isOpenFilterExtend">
        <div class="filter-extend-item mb-3">
          <span class="filter-extend-tittle">Search:</span>
          <div class="filter-extend-input-group">
            <input
              class="filter-extend-input"
              v-model="keywordQuery"
              @keyup.enter="searchItem"
              type="text"
              placeholder="Search..."
            />
            <button class="filter-extend-btn" @click="searchItem">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
        <div class="filter-extend-item">
          <span class="filter-extend-tittle">Filter date to date:</span>
          <div class="filter-extend-input-group">
            <input
              v-model="startDate"
              @change="filterByDateToDate"
              class="filter-extend-input me-1"
              type="date"
            />
            <input
              v-model="endDate"
              @change="filterByDateToDate"
              class="filter-extend-input"
              type="date"
            />
          </div>
        </div>
      </div>

    <draggable v-model="listItems" @end="onEnd" @start="onDragStart" :animation="200" :group="{ name: 'items' }">
      <template #item="{ element }">
        <transition-group name="slide" tag="ul" class="list">
          <li :key="element.id" class="item">
            <input type="checkbox" v-model="element.completed" @change="updatedItem(element)" />
            <div class="item-content">
              <div class="edit-item" v-if="isEditing(element)">
                <input type="text" v-model="editedItemTittle" @keyup.enter="updatedItem(element)" class="edit-input" />
                <span class="btn-save" @click="updatedItem(element)">
                  <i class="fa-solid fa-check"></i>
                </span>
              </div>

              <span v-else class="px-2 item-tittle" :class="{ checked: element.completed }"> {{ element.tittle }} </span>
              &nbsp;
              <span v-if="element.completed" class="complete-text px-2">(Completed)</span>
            </div>
            <div class="button">
              <span class="mx-2 icon-pin" :class="{ isPinned: element.isPinned }" @click="togglePin(element)">
                <i class="fa-solid fa-thumbtack"></i>
              </span>
              <span class="mx-2" @click="hiddenItem(element)" >
                <i :class="element.isHiddened ? 'fa-solid fa-eye-slash' : 'fa-regular fa-eye'"></i>
              </span>
              <span class="mx-2" @click="editItem(element)">
                <i class="fa-solid fa-pen"></i>
              </span>
              <span class="mx-2" @click="deleteItemTodo(element)">
                <i class="fa-solid fa-trash"></i>
              </span>
            </div>
          </li>
        </transition-group>
      </template>
    </draggable>
    </div>
    <div class="text-end">
      <span
        class="clear-task"
        :class="{ disabled: !hasItemCompleted }"
        v-on:click="removeAllTaskCompleted()"
        >Clear all task completed</span
      >
    </div>
  </section>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from "vue";
import {
  fetchTodos,
  addTodo,
  updateItemTodo,
  deleteTodo,
  removeTaskCompleted,
  searchTask,
  filterByDate,
} from '../apis/api'
import "../assets/style.css";
import { useStore } from "vuex";
import draggable from "vuedraggable";
// import Swal from 'sweetalert2' // Import SweetAlert2
import { useToast } from 'vue-toastification'


export default {
  name: "ToDos",
  components: {
    draggable,
  },
  setup() {
    const inputValue = ref(""); 
    const originalItems = ref([]); //Danh sách gốc
    const filterStatus = ref("all"); //trạng thái lọc
    const store = useStore(); // stỏre lưu trữ thông tin auth
    const editedItemTittle = ref(""); // Tiêu đề mục đang chỉnh sửa

    const editingItemId = ref(null); //item đang sửa
    const isOpenFilterExtend = ref(false); //đóng mở filter more
    const isOpenFilterGroupMobile = ref(false); //đóng mở filter group moblie
    const keywordQuery = ref(""); // key search
    const searchResult = ref([]); // ds search
    const startDate = ref(""); 
    const endDate = ref("");
    const isMobile = ref(window.innerWidth < 740);
    
    const toast = useToast();

    const handleResize = () => {
      isMobile.value = window.innerWidth < 740;
    };

    // Computed
    const listItems = computed(() => {
      // let filteredItems;
      let filteredItems = originalItems.value.slice(); // Tạo bản sao của mảng

      // Lọc các item theo trạng thái
      if (filterStatus.value === "completed") {
        filteredItems = originalItems.value.filter((item) => item.completed);
      } else if (filterStatus.value === "notCompleted") {
        filteredItems = originalItems.value.filter((item) => !item.completed);
      } else if(filterStatus.value === "hidden") {
        filteredItems = originalItems.value.filter((item) => item.isHiddened);
      }else  {
        filteredItems = originalItems.value.filter((item) => !item.isHiddened);
      }

      //Lọc theo tìm kiếm
      if (searchResult.value.length > 0 && keywordQuery.value.trim() !== "") {
        filteredItems = searchResult.value;
      } else if (keywordQuery.value.trim() !== "") {
        filteredItems = [];
      }

      //lọc theo khoảng ngày
      if (
        searchResult.value.length > 0 &&
        startDate.value !== "" &&
        endDate.value !== ""
      ) {
        filteredItems = searchResult.value;
      } else if (
        searchResult.value.length == 0 &&
        startDate.value !== "" &&
        endDate.value !== ""
      ) {
        filteredItems = [];
      }

      // Sắp xếp các item để đưa item "gim" lên trên
      return filteredItems.sort((a, b) => {
           // Đưa item "gim" lên trước
        if (b.isPinned !== a.isPinned) {
          return b.isPinned ? 1 : -1;
        }
        return (a.order) - (b.order); // Item "gim" lên trước
      });
    });

    const hasItemCompleted = computed(() => {
      return originalItems.value.some((item) => item.completed);
    });

    // List danh sách
    const fetchAllTodos = async () => {
      try {
        const response = await fetchTodos(store.state.user.id);
        originalItems.value = response.data; // Cập nhật nếu dữ liệu là đối tượng chứa todos
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    //Thêm item
    const addItemTodo = async () => {
      if (inputValue.value.trim() !== "") {
        const currentOrder = originalItems.value.filter(item => item.user_id === store.state.user.id).length + 1;
        const newTodo = {
          tittle: inputValue.value,
          user_id: store.state.user.id,
          order: currentOrder
        };
        try {
          const response = await addTodo(newTodo);
          console.log(newTodo);

          originalItems.value.push(response.data); // Giả định rằng backend trả về todo mới
          inputValue.value = "";
        } catch (error) {
          console.error("Error adding todo:", error);
        }
      }
    };

    //Thông tin item đc sửa
    const editItem = (item) => {
      editingItemId.value = item.id;
      editedItemTittle.value = item.tittle;
    };

    const updatedItem = async (item) => {
      try {
        if (editedItemTittle.value && editedItemTittle.value !== item.tittle) {
          item.tittle = editedItemTittle.value; // Chỉ cập nhật tittle nếu có thay đổi
        }
        await updateItemTodo(item.id, item);
        editingItemId.value = null; // Đặt lại ID để đóng chế độ sửa
        editedItemTittle.value = null;
      } catch (error) {
        console.error("Lỗi", error);
      }
    };
    //kiểm tra xem có đang đc sửa hay ko
    const isEditing = (item) => {
      
      return editingItemId.value === item.id;
    };

    //ẩn item
    const hiddenItem = async (item) => {
      item.isHiddened = !item.isHiddened;
      await updateItemTodo(item.id, item);
    }

    //Xóa item
    const deleteItemTodo = async (item) => {
      try {
        await deleteTodo(item.id);
        originalItems.value = originalItems.value.filter(
          (todo) => todo.id !== item.id
        );
      } catch (error) {
        console.error("Lỗi", error);
      }
    };

    // Xóa tất cả các task đã hoàn thành
    const removeAllTaskCompleted = async () => {
      try {
        await removeTaskCompleted(store.state.user.id);
        fetchAllTodos();
      } catch (error) {
        console.error("Lỗi", error);
      }
    };

    //Tìm kiếm
    const searchItem = async () => {
      filterStatus.value = "all";

      if (keywordQuery.value.trim() === "") {
        searchResult.value = originalItems.value; // Trả lại danh sách gốc nếu từ khóa trống
        console.log(searchResult.value);
        return;
      }
      const response = await searchTask(
        store.state.user.id,
        keywordQuery.value
      );
      searchResult.value = response.data;
    };

    // Lọc theo ngày tháng
    const filterByDateToDate = async () => {
      filterStatus.value = "all";
      const response = await filterByDate(
        store.state.user.id,
        startDate.value,
        endDate.value
      );
      searchResult.value = response.data;
    };

    // Ghim item
    const togglePin = async (item) => {
      item.isPinned = !item.isPinned; // Chuyển đổi trạng thái isPinned
      updatedItem(item); // Gọi API để lưu trạng thái mới nếu cần thiết
    };

    //show danh sách hoàn thành
    const filterTaskNotComplete = () => {
      filterStatus.value = "notCompleted";
    };

    //show danh sách hoàn thành
    const filterTaskComplete = () => {
      filterStatus.value = "completed";
    };

    //show ds item ẩn
    const filterTaskHidden = () => {
      filterStatus.value = "hidden";
    };

    // hiển thị danh sách ko filter
    const resetFilter = () => {
      filterStatus.value = "all";
      keywordQuery.value = "";
      startDate.value = "";
      endDate.value = "";
    };

    // đóng mở filter more
    const toggleFilterExtend = () => {
      isOpenFilterExtend.value = !isOpenFilterExtend.value;
    };

     // đóng mở filter more
    const toggleFilterMobile = () => {
      isOpenFilterGroupMobile.value = !isOpenFilterGroupMobile.value;
    };

    // kéo thả item
    const onEnd = async (event) => {
      
      // ngăn kéo khi đang thực hiện các chức năng lọc
      if(filterStatus.value !== "all" || keywordQuery.value !== "" &&  searchResult.value.length > 0 || startDate.value !== "" && endDate.value !== "" && searchResult.value.length >0 ){
        toast.error('Vui lòng tắt bộ lọc để thực hiện chức năng này!', {
        position: 'top-right', 
        timeout: 3000,
        closeOnClick: true, 
      })
        return
      }

      //item kéo
      const movedItem = listItems.value[event.oldIndex];
      //vị trí mới
      const targetIndex = event.newIndex;

      // Xóa mục đã kéo khỏi danh sách
      listItems.value.splice(event.oldIndex, 1);

      // Chèn mục đã kéo vào vị trí mới
      listItems.value.splice(targetIndex, 0, movedItem);

      // Cập nhật thứ tự mới cho tất cả các mục
      listItems.value.forEach((item, index) => {
        item.order = index + 1; // Đánh số lại từ 1 cho toàn bộ danh sách
      });

      try {
        // cập nhật thứ tự cho tất cả các mục bị ảnh hưởng
        await Promise.all(listItems.value.map(item => updatedItem(item)));
      } catch (error) {
        console.error("Lỗi cập nhật thứ tự", error);
      }
    };

    //đóng trạng thái chỉnh sửa khi kéo
    const onDragStart = () => {
      if (editingItemId.value !== null) {
        editingItemId.value = null; // Đóng chế độ chỉnh sửa
        editedItemTittle.value = ''; // Reset tiêu đề
      }

    }

    onMounted(() => {
      fetchAllTodos();
      filterTaskNotComplete();
      filterTaskComplete();
      resetFilter();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    })

    return {
      inputValue, 
      originalItems,
      listItems,
      filterStatus,
      editedItemTittle,
      hasItemCompleted,
      isOpenFilterExtend,
      isOpenFilterGroupMobile,
      keywordQuery,
      startDate,
      endDate,
      isMobile,
      // fetchAllTodos,
      addItemTodo,
      editItem,
      updatedItem,
      isEditing,
      hiddenItem,
      deleteItemTodo,
      removeAllTaskCompleted,
      filterTaskNotComplete,
      filterTaskComplete,
      filterTaskHidden,
      resetFilter,
      togglePin,
      toggleFilterExtend,
      toggleFilterMobile,
      searchItem,
      filterByDateToDate,
      onEnd,
      onDragStart
    };
  },
};
</script>
