import { NavLink } from "react-router-dom";
import Logo from "../assets/App-Logo.svg";

interface MenuItem {
  route: string;
  title: string;
  icon: string;
}

const Sidebar = () => {
  const menuItems: MenuItem[] = [
    { route: "/dashboard", title: "Dashboard", icon: "bi bi-speedometer" },
    { route: "/users", title: "Users", icon: "bi bi-people"},
  ];

  return (
    <div
      className="position-fixed top-0 left-0 bg-dark text-white p-4 z-50 sidebar">
      <a href="/dashboard" className="sidebar-header d-flex flex-row align-items-center gap-2">
        <img src={Logo} alt="Logo" style={{ width: '48px', height: '48px', clipPath: 'circle()' }} />
        <h3 className="mb-0 App-Name text-white">React N Laravel</h3>
      </a>
      <ul className="list-unstyled d-flex flex-column sidebar-link-list">
        {menuItems.map((item, index) => (
          <li key={index} className="d-flex align-items-center gap-3">
            <NavLink
              to={item.route}
              title={item.title}
              className={({ isActive }) =>
                isActive
                  ? "d-flex text-white text-decoration-none sidebar-link active"
                  : "d-flex text-white text-decoration-none sidebar-link"
              }>
              <i className={`${item.icon} fs-4`}></i>
              <span className="link-name d-md-inline">{item.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;