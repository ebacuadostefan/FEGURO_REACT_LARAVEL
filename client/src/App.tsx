import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Users from "./pages/user/Users";

const router = createBrowserRouter([
  {
    path: "/users",
    element: 
      <Users />
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;