import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    notification: null,
  },
  reducers: {
    showNotification(state, action) {
      state.notification = {
        message: action.payload.message,
        type: action.payload.type, //success,error, info
        open: action.payload.open, //notification bar to be open or close
      };
    },
  },
});
export const uiActions = uiSlice.actions;
export default uiSlice;
