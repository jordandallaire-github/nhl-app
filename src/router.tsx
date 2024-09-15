import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
  } from "react-router-dom";
  
  import Layout from './components/layout/layout.tsx';
  import Home from './pages/home.tsx'
  import Teams from "./pages/team.tsx";
  import Team from "./pages/single-team.tsx";
  import Player from "./pages/single-player.tsx";
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/equipes" element={<Teams />} />
          <Route path="/equipes/:teamCommonName" element={<Team />} />
          <Route path="/equipes/:teamCommonName/:playerSlug" element={<Player />} />
        </Route>
      </>
    ), { /* basename: "/projets/dist/" */ /*Change the basename to your url project location ex : https://jordandallaire.ca/projets/dist/ dist being the folder containing all the project*/}
  );
  
  export default router;