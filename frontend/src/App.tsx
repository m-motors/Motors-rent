import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Folder from "./pages/Folder";
import FolderCreate from "./pages/foldercreate.tsx";
import Profile from "./pages/Profile.tsx";
import VoitureDetail from "./pages/VoitureDetail.tsx";
import User from "./pages/UserDetail.tsx"
import Admin from "./pages/AdminDetail.tsx"
import AddVehicle from "./components/vehicles/AddVehicle.tsx";

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
  {
    path: "voitures/:id",
    element: <VoitureDetail />,
    errorElement: <div>ERROR</div>
  },
  {
    // path: "user/:id",
    path: "/user",
    element: <User />,
    errorElement: <div>ERROR</div>
  },
  {
    // path: "/admin/:id"
    path: "/admin",
    element: <Admin />,
    errorElement: <div>Error</div>
  },
  {
    path: "/addVehicle",
    element: <AddVehicle />,
    errorElement: <div>Error</div>
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
