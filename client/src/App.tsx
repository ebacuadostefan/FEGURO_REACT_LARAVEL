import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login"
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/user/Users";

const router = createBrowserRouter([
  {
    path: '/',
    element: 
      <Login />
  },
  {
    path: '/login',
    element: 
      <Login />
  },
  {
    path: "/dashboard",
    element:(
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
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;