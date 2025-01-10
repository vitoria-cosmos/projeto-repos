import RoutesApp from './routes';
import { BrowserRouter } from 'react-router-dom';

import GlobalStyle from './styles/global';
function App() {
  return (
    <>
      <GlobalStyle/>
      <BrowserRouter>
          <RoutesApp/>
      </BrowserRouter>
    </>
    
    
  );
}

export default App;
