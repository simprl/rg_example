import React, {createContext, useContext, useEffect} from 'react';
import {createSlice, configureStore} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {getUseStorePath} from 'use-store-path';
import './App.css';

export const stateSlice = createSlice({
	name: 'flag',
	initialState: false,
	reducers: {
		set: (state, action: PayloadAction<boolean>) => action.payload,
	},
});

const store = configureStore({reducer: stateSlice.reducer});

const exStore = {
	...store,
	useStorePath: getUseStorePath(store),
};

const Context = createContext(exStore);

const App = () => <Context.Provider value={exStore}>
	<Panel />
	<ButtonGhost />
</Context.Provider>;

const Panel = () => {
	const {useStorePath, dispatch} = useContext(Context);
	const flag = useStorePath([]);
	return (
		<div className='App'>
			<button onClick={() => {
				dispatch(stateSlice.actions.set(!flag));
			}} >{flag ? 'disable' : 'enable'}</button>
			<span>{flag ? 'enabled' : 'disabled'}</span>
		</div>
	);
};

const ButtonGhost = () => {
	const {useStorePath, dispatch} = useContext(Context);
	const flag = useStorePath([]);
	useEffect(() => {
		if (flag) {
			const id = setTimeout(() => {
				dispatch(stateSlice.actions.set(false));
			}, 1000);
			return () => {
				clearTimeout(id);
			};
		}
	}, [flag, dispatch]);
	return null;
};

export default App;
