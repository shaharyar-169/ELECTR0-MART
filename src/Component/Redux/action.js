import { fetchDataMenu, fetchDataGetUser } from "./api";

export const FETCH_MENU_REQUEST = "FETCH_MENU_REQUEST";
export const FETCH_MENU_SUCCESS = "FETCH_MENU_SUCCESS";
export const FETCH_MENU_FAILURE = "FETCH_MENU_FAILURE";

export const fetchMenu = (userId, code) => async (dispatch) => {
  dispatch({ type: FETCH_MENU_REQUEST });
  try {
    const data = await fetchDataMenu(userId, code);

    dispatch({ type: FETCH_MENU_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_MENU_FAILURE, payload: error.message });
  }
};

export const FETCH_GETUSER_REQUEST = "FETCH_GETUSER_REQUEST";
export const FETCH_GETUSER_SUCCESS = "FETCH_GETUSER_SUCCESS";
export const FETCH_GETUSER_FAILURE = "FETCH_GETUSER_FAILURE";

export const fetchGetUser = (userId, code) => async (dispatch) => {
  dispatch({ type: FETCH_GETUSER_REQUEST });
  try {
    const data = await fetchDataGetUser(userId, code);

    dispatch({ type: FETCH_GETUSER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_GETUSER_FAILURE, payload: error.message });
  }
};
