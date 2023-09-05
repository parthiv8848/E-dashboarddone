import React,{useEffect} from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate=useNavigate();

    useEffect(()=>{
        const auth=localStorage.getItem('user');
        if(auth){
            navigate('/');
        }
    },[navigate]) 


    const Handlelogin = async () => {
        let result = await fetch('https://e-dashboarddone.vercel.app/login', {
            method: 'post',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        console.warn(result);

        if(result.name){
            localStorage.setItem("user", JSON.stringify(result));
            navigate('/');
        }else{
            alert("please enter correct details");
        }
       

    }


    return (
        <div className="login">
            <h1> login page </h1>

            <input className="inputbox" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="enter email" />
            <input className="inputbox" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="enter password" />
            <button className="appbutton" onClick={Handlelogin} type="button">login </button>
        </div>
    )
}

export default Login;
