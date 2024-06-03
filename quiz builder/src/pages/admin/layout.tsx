import { Outlet } from "react-router-dom";
import SideBar from "./side-bar";
import Header from "../../components/header";

const Layout = () => {
  return (
    <div>
      <Header />
      <SideBar />
      <div className="layout">
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
