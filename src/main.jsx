import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './index.css'
import './styles/globals.css';

import { CometChat } from '@cometchat/chat-sdk-javascript';

const appID = import.meta.env.VITE_COMETCHAT_APP_ID;
const region = import.meta.env.VITE_COMETCHAT_REGION;

const appSettings = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(region)
  .build();

CometChat.init(appID, appSettings).then(
  () => {
    console.log("CometChat (Core SDK) se inicializó correctamente.");
    
    const root = createRoot(document.getElementById('root'));
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  },
  (error) => {
    console.error("Error al inicializar CometChat:", error);
    const root = createRoot(document.getElementById('root'));
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
);
