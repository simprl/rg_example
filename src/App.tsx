import React, {createContext, useContext, useEffect} from 'react';
import {createSlice, configureStore, AnyAction} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {reducer as dynamicReducer} from '@simprl/dynamic-reducer';
import {getUseStorePath} from 'use-store-path';
import './App.css';
import {Reducer} from 'redux';
import {useConstHandler} from 'use-constant-handler';
import {ghost, ghosts} from 'react-ghost';

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

const useSpaceAction = (space: string, actionCreator: () => AnyAction) => useConstHandler(() => {
	store.dispatch({space, ...actionCreator()});
});

const exStore = {
	...store,
	useStorePath: getUseStorePath(store),
	useReducer,
	useSpaceAction,
};

const Context = createContext(exStore);

const App = () => <Context.Provider value={exStore}>
	<div className='App'>
		<AppUi />
	</div>
	<AppGhost/>
</Context.Provider>;

type WithSpace = {
	space: string;
};

const Panel = ({space}: WithSpace) => {
	const {useStorePath, useSpaceAction} = useContext(Context);
	const flag = useStorePath([space]);

	const clickHandler = useSpaceAction(space, () => stateSlice.actions.set(!flag));

	return (
		<div>
			<button onClick={clickHandler} >{flag ? 'disable' : 'enable'}</button>
			<span>{flag ? 'enabled' : 'disabled'}</span>
		</div>
	);
};

const ButtonGhost = ({space}: WithSpace) => {
	useReducer(space, stateSlice.reducer);
	const {useStorePath, dispatch} = useContext(Context);
	const flag = useStorePath([space]);
	useEffect(() => {
		if (!flag) {
			const id = setTimeout(() => {
				dispatch({...stateSlice.actions.set(true), space});
			}, 1000);
			return () => {
				clearTimeout(id);
			};
		}
	}, [flag, dispatch]);
	return null;
};

const AppUi = () => {
	const {useStorePath} = useContext(Context);
	const flag1 = useStorePath(['flag1']);
	return <>
		<Panel space='flag1' />
		{flag1 && <Panel space='flag2' />}
	</>;
};

const AppGhost = () => {
	const {useStorePath} = useContext(Context);
	const flag1 = useStorePath<string>(['flag1']);
	return ghosts(
		ghost(ButtonGhost, {space: 'flag1'}),
		flag1 && ghost(ButtonGhost, {space: 'flag2'}),
	);
};

export default App;
