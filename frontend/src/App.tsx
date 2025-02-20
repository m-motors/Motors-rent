import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Error from "./pages/Error.tsx"
import AuthPage from "./pages/AuthPage.tsx";
import Auth from "./pages/Register.tsx";
import Login from "./pages/Login";
import Folder from "./pages/Folder";
import ApplicationForm from "./pages/ApplicationForm.tsx";
import Profile from "./pages/Profile.tsx";
import VehicleDetail from "./pages/VehicleDetail.tsx";
import User from "./pages/UserDetail.tsx"
import Admin from "./pages/AdminDetail.tsx"
import AddVehicle from "./components/vehicles/AddVehicle.tsx";
import UserApplications from "./pages/UserApplication.tsx";
import ModifyUser from "./pages/ModifyUser.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />
  },
  {
    path: "/AuthPage",
    element: <AuthPage />,
    errorElement: <Error />
  },
  {
    path: "/auth",
    element: <Auth />,
    errorElement: <Error />
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />
  },
  {
    path: "/folder",
    element: <Folder />,
    errorElement: <Error />
  },
  {
    path: "/voitures/:id/apply",
    element: <ApplicationForm />,
    errorElement: <Error />
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <Error />
  },
  {
    path: "voitures/:id",
    element: <VehicleDetail />,
    errorElement: < Error />
  },
  {
    // path: "user/:id",
    path: "/user",
    element: <User />,
    errorElement: < Error />
  },
  {
    // path: "/admin/:id"
    path: "/admin",
    element: <Admin />,
    errorElement: < Error />
  },
  {
    path: "/addVehicle",
    element: <AddVehicle />,
    errorElement: < Error />
  },
  {
    path: "/users/:userId/applications",
    element: <UserApplications />,
    errorElement: < Error />
  },
  {
    path: "/modifyUser/:id",
    element : <ModifyUser />,
    errorElement: <Error />
  }
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
