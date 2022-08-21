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
	<Panel space='flag1' />
	<Panel space='flag2' />
	<ButtonGhost space='flag1' />
	<ButtonGhost space='flag2' />
</Context.Provider>;

type WithSpace = {
	space: string;
};

const Panel = ({space}: WithSpace) => {
	const {useStorePath, dispatch} = useContext(Context);
	const flag = useStorePath([space]);
	return (
		<div className='App'>
			<button onClick={() => {
				dispatch({...stateSlice.actions.set(!flag), space});
			}} >{flag ? 'disable' : 'enable'}</button>
			<span>{flag ? 'enabled' : 'disabled'}</span>
		</div>
	);
};

const ButtonGhost = ({space}: WithSpace) => {
	useReducer(space, stateSlice.reducer);
	const {useStorePath, dispatch} = useContext(Context);
	const flag = useStorePath([space]);
	useEffect(() => {
		if (flag) {
			const id = setTimeout(() => {
				dispatch({...stateSlice.actions.set(false), space});
			}, 1000);
			return () => {
				clearTimeout(id);
			};
		}
	}, [flag, dispatch]);
	return null;
};

export default App;
