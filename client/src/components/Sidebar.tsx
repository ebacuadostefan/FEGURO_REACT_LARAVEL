import { NavLink } from "react-router-dom";
import Logo from "../assets/react.svg";

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
      <div className="d-flex flex-row align-items-center gap-2">
        <img className="d-md-block" src={Logo} alt="Logo" />
        <h3 className="App-Name">React N Laravel</h3>
      </div>
      <ul className="list-unstyled d-flex flex-column gap-4 mt-4">
        {menuItems.map((item, index) => (
          <li key={index} className="d-flex align-items-center gap-3">
            <NavLink
              to={item.route}
              title={item.route}
              className={({ isActive }) =>
                isActive
                  ? "d-flex text-white text-decoration-none sidebar-link active"
                  : "d-flex text-white text-decoration-none sidebar-link"
              }>
              <i className={item.icon}></i>
              <span className="d-none d-md-inline">{item.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;