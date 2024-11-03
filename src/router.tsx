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
  import MainSchedule from "./pages/schedule.tsx";
  import MainStanding from "./pages/standing.tsx";
  import MainStatsLeader from "./pages/stats.tsx";
  import MainMatch from "./pages/single-match.tsx";
  import MainMatchVideos from "./pages/single-match-videos.tsx";
  import MainSearch from "./pages/search.tsx";
  import MainFollowPage from "./pages/follow-player.tsx";
  
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/equipes" element={<Teams />} />
          <Route path="/calendrier" element={<MainSchedule />} />
          <Route path="/match/:teamAbbrs/:year/:month/:day/:matchId" element={<MainMatch />} />
          <Route path="/match/:teamAbbrs/:year/:month/:day/:matchId/video" element={<MainMatchVideos />} />
          <Route path="/classements" element={<MainStanding />} />
          <Route path="/statistiques" element={<MainStatsLeader />} />
          <Route path="/joueurs-suivis" element={<MainFollowPage />} />
          <Route path="/recherche" element={<MainSearch />} />
          <Route path="/equipes/:teamCommonName" element={<Team />} />
          <Route path="/equipes/:teamCommonName/joueur/:playerSlug" element={<Player />} />
        </Route>
      </>
    ), { /* basename: "/projets/dist/" */ /*Change the basename to your url project location ex : https://jordandallaire.ca/projets/dist/ dist being the folder containing all the project*/}
  );
  
  export default router;