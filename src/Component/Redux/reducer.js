import { combineReducers } from "redux";
import {
  FETCH_MENU_REQUEST,
  FETCH_MENU_SUCCESS,
  FETCH_MENU_FAILURE,
  FETCH_GETUSER_REQUEST,
  FETCH_GETUSER_SUCCESS,
  FETCH_GETUSER_FAILURE,
} from "./action";

const menuReducer = (
  state = { loading: false, data: [], error: null },
  { type, payload }
) => {
  switch (type) {
    case FETCH_MENU_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_MENU_SUCCESS:
      return {
        ...state,
        loading: false,
        data: Array.isArray(payload) ? payload : [],
        error: null,
      };
    case FETCH_MENU_FAILURE:
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};

const GetUser = (
  state = { loading: false, data: [], error: null },
  { type, payload }
) => {
  switch (type) {
    case FETCH_GETUSER_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_GETUSER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: Array.isArray(payload) ? payload : [],
        error: null,
      };
    case FETCH_GETUSER_FAILURE:
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};
const rootReducer = combineReducers({
  item: menuReducer,
  getuser: GetUser,
});

export default rootReducer;
