import { NavLink } from "react-router-dom";

const SidebarItem = ({
  icon,
  title,
  path,
  isCollapsed = false
}) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `
        flex
        items-center
        gap-4
        px-4
        py-3
        rounded-lg
        transition

        ${
          isActive
            ? "bg-gray-200 font-semibold"
            : "hover:bg-gray-100"
        }
        ${isCollapsed ? "justify-center" : ""}
      `
      }
      title={isCollapsed ? title : undefined}
    >
      {icon}
      {!isCollapsed && <span>{title}</span>}
    </NavLink>
  );
};

export default SidebarItem;