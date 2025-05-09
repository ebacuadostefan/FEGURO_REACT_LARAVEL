import { useEffect, useState } from "react";
import ErrorHandler from "../../../handler/ErrorHandler";
import { Users } from "../../../interfaces/users/User";
import { PaginatedUsers } from "../../../interfaces/users/PaginatedUsers";
import UserService from "../../../services/userService";
import Spinner from "../../Spinner";

const UsersTable = () => {
  const [state, setState] = useState<{
    loadingUsers: boolean;
    users: Users[];
    currentPage: number;
    lastPage: number;
  }>({
    loadingUsers: true,
    users: [],
    currentPage: 1,
    lastPage: 1,
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleLoadUsers = (page = 1, search = '') => {
    setState((prev) => ({ ...prev, loadingUsers: true }));

    UserService.loadUsers(page, search)
      .then((res) => {
        if (res) {
          const paginated: PaginatedUsers = res.users;
          setState((prevState) => ({
            ...prevState,
            users: paginated.data,
            currentPage: paginated.current_page,
            lastPage: paginated.last_page,
          }));
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingUsers: false,
        }));
      });
  };

  useEffect(() => {
    handleLoadUsers(1, searchTerm);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleLoadUsers(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    if (page !== state.currentPage) {
      handleLoadUsers(page, searchTerm);
    }
  };

  const renderPagination = () => {
    const pages = [];

    for (let i = 1; i <= state.lastPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${i === state.currentPage ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    return (
      <nav className="mt-3">
        <ul className="pagination justify-content-center">{pages}</ul>
      </nav>
    );
  };

  return (
    <section className="w-100 h-100">
      <h2>Users Management</h2>
      {/* Table Header */}
      <div className="row mb-3">
        <div className="col-12 col-md-6 mb-2 z-index-0">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                <i className="bi bi-search"></i>
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}/>
          </div>
        </div>

        <div className="col-12 col-md-6 text-md-end">
          <button className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2">
            <i className="bi bi-plus-lg"></i>
            New User
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table shadow-md table-striped">
          <thead>
            <tr className="table-dark">
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th><i className="bi bi-gear fs-4"></i></th>
            </tr>
          </thead>
          <tbody>
            {state.loadingUsers ? (
              <tr className="align-middle">
                <td colSpan={4} className="text-center">
                  <Spinner />
                </td>
              </tr>
            ) : state.users.length > 0 ? (
              state.users.map((user, index) => (
                <tr className="align-middle" key={user.id}>
                  <td>{(state.currentPage - 1) * 10 + index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                      <div className="d-flex align-items-center gap-2">
                        <a className="btn btn-primary d-flex align-items-center gap-2">
                          <i className="bi bi-pencil-square fs-4"></i>
                          EDIT
                        </a>
                        <a className="btn btn-danger d-flex align-items-center gap-2">
                          <i className="bi bi-trash fs-4"></i>
                          DELETE
                        </a>
                      </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="align-middle">
                <td colSpan={4} className="text-center">
                  No Users Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {!state.loadingUsers && renderPagination()}
      </div>
    </section>
  );
};

export default UsersTable;