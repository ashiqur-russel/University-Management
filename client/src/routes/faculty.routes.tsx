import { NavLink } from "react-router-dom";

import { ReactNode } from "react";
import FacultyDashboard from "../pages/faculty/facultyDashboard";
import OfferedCourse from "../pages/faculty/OfferedCourse";

type TSideBarItems = {
  key: string;
  label: ReactNode;
  children?: TSideBarItems[];
};

export const facultyPaths = [
  {
    name: "Dashboard",
    path: "dashboard",
    element: <FacultyDashboard />,
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

export const facultySidebarItems = facultyPaths.reduce(
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
