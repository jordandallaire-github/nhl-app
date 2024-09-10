import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
  } from "react-router-dom";
  
  import Layout from './components/layout/layout.tsx';
  import Home from './pages/home.tsx'
  import Other from './pages/other.tsx';
  import Player from "./pages/player.tsx";
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/other" element={<Other />} />
          <Route path="/player" element={<Player />} />
        </Route>
      </>
    ), { /* basename: "/projets/dist/" */ /*Change the basename to your url project location ex : https://jordandallaire.ca/projets/dist/ dist being the folder containing all the project*/}
  );
  
  export default router;