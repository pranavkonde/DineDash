import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import About from "./pages/about";
import Error from "./pages/error";
import Body from "./components/Body";
import RestaurantMenu from "./components/RestaurantMenu";
import Register from "./pages/register";
import VerifyUser from "./pages/verifyUser";
import Login from "./pages/login";
import CheckoutForm from "./components/Payment";
import Cart from "./components/Cart";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Success from "./components/Payment/Success";
import Cancel from "./components/Payment/Cancel";
import StripePayment from "./components/Payment";
import ForgotPassword from "./pages/forgot password";
import ResetPassword from "./pages/reset password";
import UpdateProfile from "./components/Profile";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Body />,
      },
      {
        path: "/help",
        element: <About />,
      },
      {
        path: "/restaurants/:id",
        element: <RestaurantMenu />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "/user/signin",
    element: <Login />,
  },
  {
    path: "/user/register",
    element: <Register />,
  },
  {
    path: "/user/verify",
    element: <VerifyUser />,
  },
  {
    path: "/payment",
    element: <StripePayment />,
  },
  {
    path: "/success",
    element: <Success />,
  },
  {
    path: "/cancel",
    element: <Cancel />,
  },
  {
    path: "/user/forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/user/resetPassword",
    element: <ResetPassword />,
  },
  {
    path: "/user/profile",
    element: <UpdateProfile />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={appRouter} />);
