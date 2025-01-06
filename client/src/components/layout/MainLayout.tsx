import { Layout, Menu, MenuProps } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";

import Sider from "antd/es/layout/Sider";

const MainLayout = () => {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Dashboard",
      children: [
        {
          key: "A1",
          label: "Users",
        },
        {
          key: "A2",
          label: "Admins",
        },
      ],
    },
    {
      key: "2",
      label: "Profile",
    },
    {
      key: "3",
      label: "Projects",
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "4rem",
          }}
        >
          <h1 style={{ height: "20px", textAlign: "center" }}>My Portal</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={items}
          style={{
            marginTop: "1rem",
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            content
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
