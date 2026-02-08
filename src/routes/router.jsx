import { createBrowserRouter } from "react-router";
import { MainLayout } from "../Layouts/MainLayout";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { UserDashboard } from "../pages/UserDashboard";
import { VendorDashboard } from "../pages/VendorDashboard";
import { AdminDashboard } from "../pages/AdminDashboard";
import { AddTicket } from "../pages/vendorsDashboard/AddTicket";
import { MyAddedTickets } from "../pages/vendorsDashboard/MyAddedTickets";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/signup",
        element: <Register></Register>,
      },
      {
        path: "/dashboard/user",
        element: <UserDashboard></UserDashboard>,
      },
      {
        path: "/dashboard/vendor",
        element: <VendorDashboard></VendorDashboard>,
        children: [
          {
            path: "/dashboard/vendor/addTicket",
            element: <AddTicket></AddTicket>,
          },
          {
            path: "/dashboard/vendor/myAddedTickets",
            element: <MyAddedTickets></MyAddedTickets>,
          },
        ],
      },
      {
        path: "/dashboard/admin",
        element: <AdminDashboard></AdminDashboard>,
      },
    ],
  },
]);
