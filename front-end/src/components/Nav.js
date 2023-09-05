import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {


    const auth = localStorage.getItem('user');
    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate('/signup');
        console.warn("apple")
    }
    return (

        <div>
<img alt="logo" src="https://e0.pxfuel.com/wallpapers/403/340/desktop-wallpaper-p-name-fire-theme-letter-p.jpg" className="logo"></img>
            {

                auth ?
                    <ul className="nav-ul">
                        <li>
                            <Link to="/">producs</Link> </li>
                        <li><Link to="/add">add producs</Link></li>
                      
                        {/* <li><Link to="/update">update product</Link></li> */}
                        <li><Link to="/profile">profile</Link></li>
                        <li><Link onClick={logout} to="/signup">logout({JSON.parse(auth).name})</Link></li>
                    </ul>
                    :
                    <ul className="nav-ul nav-right">
                        <li><Link to="/signup">signup</Link></li>
                        <li><Link to="/login">login</Link></li>
                    </ul>
            }





        </div>
    );
}

export default Nav;