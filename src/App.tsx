import React, {createContext, useContext, useMemo, useState} from 'react';
import './App.css';

type ContextInterface = {
	state: boolean;
	setState: (state: boolean) => void;
};

const Context = createContext<ContextInterface>({
	state: false,
	setState: (state: boolean) => undefined,
});

const App = () => {
	const [state, setState] = useState(false);
	const contextValue = useMemo(() => ({state, setState}), [state]);
	return <Context.Provider value={contextValue}>
		<Panel />
	</Context.Provider>;
};

const Panel = () => {
	const {state, setState} = useContext(Context);
	return (
		<div className='App'>
			<button onClick={() => {
				setState(!state);
			}} >{state ? 'disable' : 'enable'}</button>
			<span>{state ? 'enabled' : 'disabled'}</span>
		</div>
	);
};

export default App;
