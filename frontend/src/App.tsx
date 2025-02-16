import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Folder from "./pages/folder";
import FolderCreate from "./pages/foldercreate.tsx";
import Profile from "./pages/Profile.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <div>ERROR</div>,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <div>ERROR</div>,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <div>ERROR</div>,
  },
  {
    path: "/folder",
    element: <Folder />,
    errorElement: <div>ERROR</div>,
  },
  {
    path: "/foldercreate",
    element: <FolderCreate />,
    errorElement: <div>ERROR</div>,
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <div>ERROR</div>,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />; // Fournir le routeur à l'application
};

export default App;
