import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { sidebarItemsGenerate } from "../../utils/sidebarItemGenerate";
import { adminPaths } from "../../routes/admin.routes";
import { facultyPaths } from "../../routes/faculty.routes";
import { studentPaths } from "../../routes/student.routes";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

const Sidebar = () => {
  const user = useAppSelector(selectCurrentUser);
  let sidebarItems;

  const userRole = {
    ADMIN: "admin",
    FACULTY: "faculty",
    STUDENT: "student",
  };

  switch (user!.role) {
    case userRole.ADMIN:
      sidebarItems = sidebarItemsGenerate(adminPaths, userRole.ADMIN);
      break;
    case userRole.FACULTY:
      sidebarItems = sidebarItemsGenerate(facultyPaths, userRole.FACULTY);
      break;
    case userRole.STUDENT:
      sidebarItems = sidebarItemsGenerate(studentPaths, userRole.STUDENT);
      break;

    default:
      break;
  }
  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{ height: "100vh", position: "sticky", top: "0", left: "0" }}
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
        items={sidebarItems}
        style={{
          marginTop: "1rem",
        }}
      />
    </Sider>
  );
};

export default Sidebar;
