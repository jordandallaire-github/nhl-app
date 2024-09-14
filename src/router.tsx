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
          <Route path="/equipe" element={<Teams />} />
          <Route path="/equipe/:teamAbbrev" element={<Team />} />
          <Route path="/equipe/:teamAbbrev/:playerSlug" element={<Player />} />
        </Route>
      </>
    ), { /* basename: "/projets/dist/" */ /*Change the basename to your url project location ex : https://jordandallaire.ca/projets/dist/ dist being the folder containing all the project*/}
  );
  
  export default router;