import { createBrowserRouter } from "react-router-dom";

import AuthContainer from "../Layout/AuthContainer";
import MainContainer from "../Layout/MainContainer";

import RegisterUser from "../pages/Auth/RegisterUser";
import Login from "../pages/Auth/Login";
import Home from "../pages/Home";

import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import ProfilePage from "../pages/ProfilePage";

const router = createBrowserRouter([
    {
        path: "/",
        children: [
            // Authentication Pages
            {
                element: <AuthContainer />,
                children: [
                    {
                        index: true,
                        element: (
                            <PublicRoute>
                                <RegisterUser />
                            </PublicRoute>
                        )
                    },
                    {
                        path: "/login",
                        element: (
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        )
                    }
                ]
            },
            // Authentication Pages
            {
                element: (
                    <ProtectedRoute>
                        <MainContainer />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: "dashboard",
                        element: <Home />
                    },
                    {
                        path:"profile",
                        element:<ProfilePage />
                    }
                ]
            }

        ]
    }
])

export default router;