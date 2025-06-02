import React, { useState, useRef, useEffect } from "react";
import LogoutForm from "./forms/LogoutForm";

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

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-info shadow-lg w-100 px-4 py-2 d-flex justify-content-end align-items-center position-sticky top-0">
      <div className="position-relative" ref={dropdownRef}>
        <span
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="d-flex align-items-center gap-2 text-white"
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-person-circle fs-4"></i>
          Profile
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