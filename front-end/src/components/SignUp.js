import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
const SignUp=()=>{



    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();

useEffect(()=>{
    const auth=localStorage.getItem('user');
    if(auth){
        navigate('/');
    }
},[navigate])   



const collectiondata=async()=>{
    console.warn(name,email,password);
    let result=await fetch('https://e-dashboarddone-is2yvystt-parthiv8848.vercel.app/register',{
        method:'post',
        body:JSON.stringify({name,email,password}),
        headers:{
            'content-type':'application/json'
        },
    });
    result=await result.json();
    console.warn(result);
    localStorage.setItem("user",JSON.stringify(result));
     navigate('/');
    
}

    return(
<div className="register">
    <h1>
        Register
    </h1>

    <input className="inputbox"  type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="enter name"/>
    <input className="inputbox" type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="enter email"/>
    <input  className="inputbox"  type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="enter password"/>
     <button className="appbutton" onClick={collectiondata}  type="button">SignUp </button>


</div>

    )
}

export default SignUp;
