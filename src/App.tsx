import type * as React from 'react';

interface IAppProps {
  appName?: string;
}

const App: React.FunctionComponent<IAppProps> = ({ appName }) => {
  return <div>{appName ? appName : "App Root Component"}</div>;
};

export default App;
