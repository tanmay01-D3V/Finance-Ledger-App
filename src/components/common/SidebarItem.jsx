import { NavLink } from "react-router-dom";

const SidebarItem = ({
  icon,
  title,
  path
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
      `
      }
    >
      {icon}

      <span>{title}</span>
    </NavLink>
  );
};

export default SidebarItem;