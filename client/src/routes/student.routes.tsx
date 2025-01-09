import { NavLink } from "react-router-dom";

import { ReactNode } from "react";
import OfferedCourse from "../pages/student/OfferedCourse";
import StudentDashBoard from "../pages/student/StudentDashBoard";

type TSideBarItems = {
  key: string;
  label: ReactNode;
  children?: TSideBarItems[];
};

export const studentPaths = [
  {
    name: "Dashboard",
    path: "dashboard",
    element: <StudentDashBoard />,
  },
  {
    name: "Offered Course",
    children: [
      {
        name: "Offered Course",
        path: "offered-course",
        element: <OfferedCourse />,
      },
    ],
  },
];

export const studentSidebarItems = studentPaths.reduce(
  (acc: TSideBarItems[], item) => {
    if (item.path && item.element) {
      acc.push({
        key: item.name,
        label: <NavLink to={`/admin/${item.path}`}>{item.name}</NavLink>,
      });
    }

    if (item.children) {
      acc.push({
        key: item.name,
        label: item.name,
        children: item.children.map((child) => ({
          key: child.name,
          label: <NavLink to={`/admin/${child.path}`}>{child.name}</NavLink>,
        })),
      });
    }
    return acc;
  },
  []
);
