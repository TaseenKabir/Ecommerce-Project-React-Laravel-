import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from './context/Auth';

const UserSidebar = () => {

    const {logout} = useContext(AuthContext);
        
    // Active link styling function
    // const linkClass = ({ isActive }) => {
    //     return isActive 
    //         ? 'active-link text-info' 
    //         : 'text-dark';
    // }

    // For logout 
    const handleLogoutClick = (e) => {
        e.preventDefault();
        logout();
    }

  return (
    <div className="card shadow mb-5 sidebar">
      <div className="card-body p-4">
        <ul className="list-unstyled mb-0">
          <li className="mb-2">
            <NavLink to="/account">
              Account
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/account/orders">
              Orders
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/admin/products">
              Change Password
            </NavLink>
          </li>
          <li className="mb-2">
            {/* Logout with NavLink - prevent default navigation */}
            <NavLink 
              to="#" 
              onClick={handleLogoutClick}
            >
              Logout &nbsp;
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
              </svg>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default UserSidebar