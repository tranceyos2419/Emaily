import axios from 'axios';
import { FETCH_USER } from './types';

// export const fetchUser = () => {
//     return function (dispatch) {
//         axios
//             .get('/api/current_user')
//             .then(res => dispatch({
//                 type: FETCH_USER,
//                 payload: res
//             }))
//     }
// }

//I can call dispatch function which is already exist inside of Redux store.
// dispatch function eventually has to return an action
export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user');
    dispatch({
        type: FETCH_USER,
        payload: res.data
    })
}

export const handleToken = (token) => async dispatch => {
    console.log('token ' + JSON.stringify(token))
    const res = await axios.post('/api/stripe', token);
    dispatch({ type: FETCH_USER, payload: res.data })
}
