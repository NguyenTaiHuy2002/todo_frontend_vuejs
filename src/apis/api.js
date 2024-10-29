import axios from 'axios';

const API_URL = 'http://localhost:3000/todo-list';

export const fetchTodos = (userId) => {
    return axios.get(`${API_URL}/${userId}`);
};

export const addTodo = (item) => {
    return axios.post(API_URL, item);
};

// export const updateStatusTodo = (id, completed) => {
//     return axios.put(`${API_URL}/${id}`, {completed});
// }


export const updateItemTodo = (id, dataUpdate) => {
    return axios.put(`${API_URL}/${id}`, dataUpdate);
}

export const deleteTodo = (id) => {
    return axios.delete(`${API_URL}/${id}`);
}

export const removeTaskCompleted = (userId) => {
    return axios.delete(`${API_URL}/completed`,{
        params: {
            userId: userId
        }
    })
}

export const searchTask = (id, key) => {
    return axios.get(`${API_URL}/search`, {
        params: {
            userId: id,
            keyword: key
        }
    })
}

export const filterByDate = (id, start, end) => {
    return axios.get(`${API_URL}/filter-by-date`, {
        params: {
            userId: id,
            startDate: start,
            endDate: end
        }
    })
}