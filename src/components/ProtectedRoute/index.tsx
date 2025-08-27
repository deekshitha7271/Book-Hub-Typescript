import Cookies from 'js-cookie'
import { Navigate } from 'react-router'

type ProtectedRouteProps={
    children:React.ReactNode
}
const ProtectedRoute = ({children}:ProtectedRouteProps) => {
    const jwtToken = Cookies.get('jwt_token')
    if(jwtToken==undefined){
        return <Navigate to="/login"/>
    }
    return children


}
export default ProtectedRoute