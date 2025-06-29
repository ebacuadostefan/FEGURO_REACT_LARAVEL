import React, { useState, useRef, useEffect } from "react";
import LogoutForm from "./forms/LogoutForm";
import DefaultAvatar from "../assets/default-profile.png";

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getUserFromStorage = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };

  const handleUserFullname = () => {
    const parsedUser = getUserFromStorage();
    return parsedUser?.name ?? "";
  };

  const handleUserAvatar = () => {
    const parsedUser = getUserFromStorage();
    return parsedUser?.avatar ?? DefaultAvatar;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-info shadow-lg w-100 px-4 py-2 d-flex justify-content-end align-items-center position-sticky top-0">
      <div className="position-relative" ref={dropdownRef}>
        <span
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="d-flex align-items-center gap-2 text-black"
          style={{ cursor: "pointer" }}>
          <img src={handleUserAvatar()} alt="Avatar" style={{width: "32px", height: "32px"}}/>
          {handleUserFullname()}
        </span>

        {dropdownOpen && (
          <div
            className="dropdown-menu show mt-2 end-0"
            style={{ right: 0, left: "auto", position: "absolute" }}>
            <a href="/profile" className="dropdown-item">
              <i className="bi bi-person"></i> My Profile
            </a>
            <LogoutForm />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;