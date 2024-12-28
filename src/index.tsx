import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { PathService } from "./services/PathService";
import { KanjiService } from "./services/KanjiService";

export const ServiceContext = React.createContext({});

const pathService: PathService = new PathService();
const kanjiService: KanjiService = new KanjiService(pathService);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <ServiceContext.Provider value={{pathService, kanjiService}}>
          <App />
      </ServiceContext.Provider>
  </React.StrictMode>
);
