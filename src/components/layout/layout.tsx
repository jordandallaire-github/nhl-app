import { Outlet } from "react-router-dom";
import Footer from "../commons/footer";
import Header from "../commons/header";

function Layout() {
  return (
    <>
      <Header />
        <main>
            <Outlet />
        </main> 
      <Footer />
    </>
  );
}
export default Layout;