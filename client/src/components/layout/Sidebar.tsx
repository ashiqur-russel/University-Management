import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { sidebarItemsGenerate } from "../../utils/sidebarItemGenerate";
import { adminPaths } from "../../routes/admin.routes";

const Sidebar = () => {
  return (
    <Sider breakpoint="lg" collapsedWidth="0">
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
        items={sidebarItemsGenerate(adminPaths, "admin")}
        style={{
          marginTop: "1rem",
        }}
      />
    </Sider>
  );
};

export default Sidebar;
