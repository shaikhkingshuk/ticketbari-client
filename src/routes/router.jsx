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
import TransactionHistory from "../pages/usersDashboard/TransactionHistory";
import RevenueOverview from "../pages/vendorsDashboard/RevenueOverview";
import ManageTickets from "../pages/adminDashboard/ManageTickets";
import ManageUsers from "../pages/adminDashboard/ManageUsers";
import PrivateRoute from "../privateRoute/PrivateRoute";
import { UserProfile } from "../pages/usersDashboard/UserProfile";
import { VendorProfile } from "../pages/vendorsDashboard/VendorProfile";
import { AdminProfile } from "../pages/adminDashboard/AdminProfile";
import { HomePage } from "../pages/HomePage";
import { AdvertiseTickets } from "../pages/adminDashboard/AdvertiseTickets";
import { CanclePayment } from "../components/CanclePayment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        index: true,
        element: <HomePage></HomePage>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/myTickets",
        element: (
          <PrivateRoute>
            <MyBookedTickets></MyBookedTickets>
          </PrivateRoute>
        ),
      },
      {
        path: "/signup",
        element: <Register></Register>,
      },
      {
        path: "/allTickets",
        element: (
          <PrivateRoute>
            <AllTickets></AllTickets>
          </PrivateRoute>
        ),
      },
      {
        path: "/tickets/:id",
        element: (
          <PrivateRoute>
            <TicketDetails></TicketDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess></PaymentSuccess>,
      },
      {
        path: "/dashboard/user",
        element: (
          <PrivateRoute>
            <UserDashboard></UserDashboard>
          </PrivateRoute>
        ),

        children: [
          {
            index: true,
            element: <UserProfile></UserProfile>,
          },
          {
            path: "/dashboard/user/myBookedTickets",
            element: <MyBookedTickets></MyBookedTickets>,
          },
          {
            path: "/dashboard/user/paymentCancel",
            element: <CanclePayment></CanclePayment>,
          },
          {
            path: "/dashboard/user/transactions",
            element: <TransactionHistory></TransactionHistory>,
          },
        ],
      },

      {
        path: "/dashboard/vendor",
        element: (
          <PrivateRoute>
            <VendorDashboard></VendorDashboard>
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <VendorProfile></VendorProfile>,
          },
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
          {
            path: "/dashboard/vendor/revenueOverview",
            element: <RevenueOverview></RevenueOverview>,
          },
        ],
      },

      {
        path: "/dashboard/admin",
        element: (
          <PrivateRoute>
            <AdminDashboard></AdminDashboard>
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminProfile></AdminProfile>,
          },
          {
            path: "/dashboard/admin/manageTickets",
            element: <ManageTickets></ManageTickets>,
          },
          {
            path: "/dashboard/admin/advertiseTickets",
            element: <AdvertiseTickets></AdvertiseTickets>,
          },
          {
            path: "/dashboard/admin/manageUsers",
            element: <ManageUsers></ManageUsers>,
          },
        ],
      },
    ],
  },
]);
