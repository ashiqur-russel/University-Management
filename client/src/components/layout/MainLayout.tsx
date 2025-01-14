import { Button, Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logOut } from "../../redux/features/auth/authSlice";

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const logOutHandler = () => {
    dispatch(logOut());
  };
  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header
          style={{
            padding: 0,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            htmlType="submit"
            style={{ marginRight: "20px" }}
            onClick={logOutHandler}
          >
            Logout
          </Button>
        </Header>
        <Content
          style={{ margin: "0", backgroundColor: "black", color: "gray" }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
