const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-info shadow-lg w-100 px-4 py-2 d-flex justify-content-end align-items-center position-sticky top-0">
      <span className="d-flex align-items-center gap-2 text-white">
        <i className="bi bi-person-circle fs-4"></i>
        Profile
      </span>
    </nav>
  );
};

export default Navbar;
