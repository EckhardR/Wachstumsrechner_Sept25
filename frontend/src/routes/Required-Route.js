import React, {useEffect, useState} from "react";
import { useLocation, useNavigate, Outlet} from "react-router-dom";
import LoadingSpinner from "../utils/loading-spinner.js";

import { useAuth } from "../services/AuthProvider.js"

export const ProtectedRoute = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();    
    const location = useLocation();
   
    useEffect(() => {
        setIsLoading(!isAuthenticated);
    }, [isAuthenticated])
    if (isLoading) {
        return <LoadingSpinner center/>
    } else {
        if (isAuthenticated) {
            return <Outlet/>;
            // return <Navigate to="/login" state={{from: location}}/>;
        } else {
            // return <Outlet/>;
            navigate({to: '/login', from: location})
        }
    }
};

export default ProtectedRoute;