import { NavLink } from "react-router-dom";

interface MenuItem {
  route: string;
  title: string;
}

const Sidebar = () => {
  const menuItems: MenuItem[] = [
    { route: "/users", title: "Users" },
  ];

  return (
    <div
      className="position-fixed top-0 left-0 bg-dark text-white p-4 z-50 sidebar">
      <h2 className="d-md-block">React N Laravel</h2>
      <ul className="list-unstyled d-flex flex-column gap-4 mt-4">
        {menuItems.map((item, index) => (
          <li key={index} className="d-flex align-items-center gap-3">
            <NavLink
              to={item.route}
              className={({ isActive }) =>
                isActive
                  ? "d-flex text-white text-decoration-none sidebar-link active"
                  : "d-flex text-white text-decoration-none sidebar-link"
              }>
              <i className="bi bi-people fs-4"></i>
              <span className="d-none d-md-inline">{item.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;