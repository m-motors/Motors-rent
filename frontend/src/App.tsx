import axios from "axios";
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import Folder from "./pages/Folder";
import Error from "./pages/Error.tsx"
import AuthPage from "./pages/AuthPage.tsx";
import ApplicationForm from "./pages/ApplicationForm.tsx";
import Profile from "./pages/Profile.tsx";
import User from "./pages/UserDetail.tsx";
import Admin from "./pages/AdminDetail.tsx"
import VehicleDetail from "./pages/VehicleDetail.tsx";
import UserApplications from "./pages/UserApplication.tsx";
import AddVehicle from "./components/vehicles/AddVehicle.tsx";
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
  const host = import.meta.env.VITE_API_HOST;

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const result: any = await axios.get(`${host}/`);
        console.log(result);
        alert(`✅ API accessible\n🔗 Hôte : ${host}\n🎉 Résultat : ${result.data}`);
      } catch (error: any) {
        alert(`❌ Erreur API\n🔗 Hôte : ${host}\n🚨 Erreur : ${error.message || error}\n📌 Contacter l'administrateur.`);
      }
    };

    fetchHealth();
  }, [host]);

  return <RouterProvider router={router} />;
};

export default App;
