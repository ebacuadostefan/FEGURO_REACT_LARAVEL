// App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/user/Users";
import UserForm from "./pages/user/UserForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/add",
    element: (
      <ProtectedRoute>
        <UserForm
          setSubmitForm={undefined}
          setLoadingStore={undefined}
          onUserSubmitSuccess={(message) => {
            console.log("User added successfully:", message);
          }}
        />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/edit/:user_id",
    element: (
      <ProtectedRoute>
        <UserForm
          setSubmitForm={undefined}
          setLoadingStore={undefined}
          onUserSubmitSuccess={(message) => {
            console.log("User updated successfully:", message);
          }}
        />
      </ProtectedRoute>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;