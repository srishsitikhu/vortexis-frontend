import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NotificationType = "error" | "success" | "warning" | "";

type InitialStateType = {
  message: string;
  type: NotificationType;
  visible: boolean;
};

const initialState: InitialStateType = {
  message: "",
  type: "",
  visible: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{ message: string; type: NotificationType }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.visible = true;
    },

    hideNotification: (state) => {
      state.message = "";
      state.type = "";
      state.visible = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
