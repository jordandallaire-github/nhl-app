import { createRoot } from 'react-dom/client'
import * as React from "react";
import router from './router';
import { RouterProvider } from "react-router-dom";
import Scrolly from './components/utils/scrolly';
import './styles/main.scss'

createRoot(document.getElementById("root")! ).render(
  <>
  <Scrolly/>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </>
);