import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ErrorHandler from "../../../handler/ErrorHandler";
import { User } from "../../../interfaces/users/User";
import { PaginatedUsers } from "../../../interfaces/users/PaginatedUsers";
import UserService from "../../../services/users/userService";
import Spinner from "../../Spinner";
import ToastNotification from "../../ToastNotification";

type ToastType = 'success' | 'error' | 'info' | 'warning';

const UsersTable = () => {
  const [state, setState] = useState<{
    loadingUsers: boolean;
    users: User[];
    currentPage: number;
    lastPage: number;
  }>({
    loadingUsers: true,
    users: [],
    currentPage: 1,
    lastPage: 1,
  });

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [toastState, setToastState] = useState<{
    isVisible: boolean;
    message: string;
    type: ToastType;
  }>({
    isVisible: false,
    message: "",
    type: "info",
  });

  const handleLoadUsers = (page = 1, search = "") => {
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

  const handleAddUser = () => {
    navigate('/users/add');
  };

  const handleEdit = (user: User) => {
    navigate(`/users/edit/${user.id}`);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    
    UserService.deleteUser(userToDelete.id)
      .then(() => {
        // Show success toast
        setToastState({
            isVisible: true,
            message: "User deleted successfully!",
            type: "success"
        });

        const pageToLoad = (state.users.length === 1 && state.currentPage > 1)
          ? state.currentPage - 1
          : state.currentPage;
        
        handleLoadUsers(pageToLoad, searchTerm);
      })
      .catch((error) => {
        // Show error toast
        setToastState({
            isVisible: true,
            message: "Failed to delete user. Please try again.",
            type: "error"
        });
        ErrorHandler(error, null);
      })
      .finally(() => {
        const closeButton = document.getElementById('closeDeleteModal');
        closeButton?.click();
        setUserToDelete(null);
      });
  };

  // Function to close the toast
  const handleCloseToast = () => {
    setToastState((prev) => ({ ...prev, isVisible: false }));
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= state.lastPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${i === state.currentPage ? "active" : ""}`}
        >
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

      {/* Header */}
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-6 text-md-end">
          <button onClick={handleAddUser} className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2">
            <i className="bi bi-plus-lg"></i>
            New User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table shadow-md table-striped">
          <thead>
            <tr className="table-dark">
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>
                <i className="bi bi-gear fs-4"></i>
              </th>
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
                      <button
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() => handleEdit(user)}>
                        <i className="bi bi-pencil-square fs-4"></i>
                        EDIT
                      </button>
                      <button
                        className="btn btn-danger d-flex align-items-center gap-2"
                        onClick={() => handleDelete(user)}
                        data-bs-toggle="modal"
                        data-bs-target="#deleteConfirmationModal">
                        <i className="bi bi-trash fs-4"></i>
                        DELETE
                      </button>
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

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteConfirmationModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete the user: <strong>{userToDelete?.name}</strong>?
              <br />
              <span className="text-danger">This action cannot be undone.</span>
            </div>
            <div className="modal-footer">
              <button type="button" id="closeDeleteModal" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
       {/* Toast Notification */}
        <ToastNotification
          message={toastState.message}
          type={toastState.type}
          onClose={handleCloseToast}
          isVisible={toastState.isVisible}
        />
    </section>
  );
};

export default UsersTable;