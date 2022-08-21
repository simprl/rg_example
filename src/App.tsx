import React, {createContext, useContext, useEffect} from 'react';
import {createSlice, configureStore} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {reducer as dynamicReducer} from '@simprl/dynamic-reducer';
import {getUseStorePath} from 'use-store-path';
import './App.css';
import {Reducer} from 'redux';

export const stateSlice = createSlice({
	name: 'flag',
	initialState: false,
	reducers: {
		set: (state, action: PayloadAction<boolean>) => action.payload,
	},
});

const {reducer, addReducer} = dynamicReducer();
const store = configureStore({reducer});
const useReducer = (name: string, reducer: Reducer) => {
	useEffect(
		() => addReducer(name, reducer, store.dispatch),
		[name, reducer],
	);
};

const exStore = {
	...store,
	useStorePath: getUseStorePath(store),
	useReducer,
};

const Context = createContext(exStore);

const App = () => <Context.Provider value={exStore}>
	<Panel />
	<ButtonGhost />
</Context.Provider>;

const Panel = () => {
	const {useStorePath, dispatch} = useContext(Context);
	const flag = useStorePath(['flag1']);
	return (
		<div className='App'>
			<button onClick={() => {
				dispatch({...stateSlice.actions.set(!flag), space: 'flag1'});
			}} >{flag ? 'disable' : 'enable'}</button>
			<span>{flag ? 'enabled' : 'disabled'}</span>
		</div>
	);
};

const ButtonGhost = () => {
	useReducer('flag1', stateSlice.reducer);
	const {useStorePath, dispatch} = useContext(Context);
	const flag = useStorePath(['flag1']);
	useEffect(() => {
		if (flag) {
			const id = setTimeout(() => {
				dispatch({...stateSlice.actions.set(false), space: 'flag1'});
			}, 1000);
			return () => {
				clearTimeout(id);
			};
		}
	}, [flag, dispatch]);
	return null;
};

export default App;
