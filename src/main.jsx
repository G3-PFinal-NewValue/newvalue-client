import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import './index.css';
import './styles/globals.css';
import './styles/cometchat.css';

import { CometChat } from '@cometchat/chat-sdk-javascript';
import {
  CometChatUIKit,
  UIKitSettingsBuilder,
} from '@cometchat/chat-uikit-react';
import { CometChatCalls } from '@cometchat/calls-sdk-javascript';

const appID = import.meta.env.VITE_COMETCHAT_APP_ID;
const region = import.meta.env.VITE_COMETCHAT_REGION;
const authKey = import.meta.env.VITE_COMETCHAT_AUTH_KEY;

if (typeof window !== 'undefined') {
  window.CometChatCalls = window.CometChatCalls || CometChatCalls;
  window.CometChatUIKitCalls = window.CometChatUIKitCalls || CometChatCalls;
}

const renderApp = () => {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

const initializeCometChat = async () => {
  try {
    const appSettings = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();

    await CometChat.init(appID, appSettings);
    console.log('CometChat (Core SDK) se inicializó correctamente.');

    try {
      const callAppSettings = new CometChatCalls.CallAppSettingsBuilder()
        .setAppId(appID)
        .setRegion(region)
        .build();

      await CometChatCalls.init(callAppSettings);
      console.log('CometChat Calls SDK se inicializó correctamente.');
    } catch (callsInitError) {
      console.warn('No se pudo inicializar el Calls SDK:', callsInitError);
    }

    const uiKitSettingsBuilder = new UIKitSettingsBuilder()
      .setAppId(appID)
      .setRegion(region)
      .subscribePresenceForAllUsers()
      .setAutoEstablishSocketConnection(true);

    if (authKey) {
      uiKitSettingsBuilder.setAuthKey(authKey);
    }

    await CometChatUIKit.init(uiKitSettingsBuilder.build());
    console.log('CometChat UIKit se inicializó correctamente.');

    try {
      CometChatUIKit.enableCalling();
      console.log('Llamadas habilitadas en CometChat UIKit.');
    } catch (callingError) {
      console.warn('No se pudo habilitar la extensión de llamadas:', callingError);
    }
  } catch (error) {
    console.error('Error al inicializar CometChat o UIKit:', error);
  } finally {
    renderApp();
  }
};

initializeCometChat();
