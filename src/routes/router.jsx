import { createBrowserRouter } from "react-router";
import { MainLayout } from "../Layouts/MainLayout";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { UserDashboard } from "../pages/UserDashboard";
import { VendorDashboard } from "../pages/VendorDashboard";
import { AdminDashboard } from "../pages/AdminDashboard";
import { AddTicket } from "../pages/vendorsDashboard/AddTicket";
import { MyAddedTickets } from "../pages/vendorsDashboard/MyAddedTickets";
import { AllTickets } from "../pages/AllTickets";
import { TicketDetails } from "../pages/TicketDetails";
import VendorRequestedBookings from "../pages/vendorsDashboard/VendorRequestedBookings";
import MyBookedTickets from "../pages/usersDashboard/MyBookedTickets";
import PaymentSuccess from "../pages/usersDashboard/PaymentSuccess";

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
        path: "/allTickets",
        element: <AllTickets></AllTickets>,
      },
      {
        path: "/tickets/:id",
        element: <TicketDetails></TicketDetails>,
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess></PaymentSuccess>,
      },
      {
        path: "/dashboard/user",
        element: <UserDashboard></UserDashboard>,
        children: [
          {
            path: "/dashboard/user/myBookedTickets",
            element: <MyBookedTickets></MyBookedTickets>,
          },
        ],
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
          {
            path: "/dashboard/vendor/requestedBookings",
            element: <VendorRequestedBookings></VendorRequestedBookings>,
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
