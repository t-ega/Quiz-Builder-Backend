import { Outlet } from "react-router-dom";
import SideBar from "./side-bar";
import Header from "../../components/header";
import { useContext } from "react";
import { AuthContext } from "../../utils/quiz-test.context";
const Layout = () => {
  const auth = useContext(AuthContext);
  return (
    <div>
      <Header
        heading="Administrator"
        text={auth.username}
        styles={{ position: "fixed" }}
      />
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
