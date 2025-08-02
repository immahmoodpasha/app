import { useJWT } from "./jwtContextProvider";
import { Navigate,Outlet } from "react-router-dom";


const ProtectedRoute = () => {
    const {isAuthenticated} = useJWT();

    if (!isAuthenticated){
        return <Navigate to='/' replace />
    }

    return <Outlet />;
}

export default ProtectedRoute;