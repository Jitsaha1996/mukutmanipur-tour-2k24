import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../common/user';
import { getFromLocalStorage, saveToLocalStorage } from './localStorage';



interface UserState {
    userData: IUser | null;
}

const initialState: UserState = {
    userData: getFromLocalStorage('userData') || null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.userData = action.payload;
            saveToLocalStorage('userData', action.payload);
        },
        clearUser: (state) => {
            state.userData = null;
            localStorage.removeItem('userData');
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
