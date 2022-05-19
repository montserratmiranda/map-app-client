import { TravelExplore } from "@mui/icons-material"
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import * as React from "react"
import "./login.css"

export default function Login({setShowLogin, setCurrentUsername, user}){
    const [error, setError] = React.useState(false);
    const usernameRef = React.useRef()
    const passwordRef = React.useRef()

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const credentials = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        };

        try{
            const res = await axios.post("https://map-app-backend.herokuapp.com/users/login", credentials);
            setCurrentUsername(res.data.username)
            setShowLogin(false);
        }catch(err){
            console.log(err)
            setError(true)
        }    
    }
    return (
        <div className="loginContainer">
            <div className="logo">
                <TravelExplore/>
                Travels Unraveled
            </div>
            <form onSubmit= {handleSubmit}>
            <input autoFocus placeholder="Username" ref={usernameRef} />
            <input 
            type="password" 
            placeholder="Password" 
            min="6"
            ref={passwordRef}/>
            <button 
            className="loginButton" type="submit"> 
            Login
            </button>
            {error && <span className="failure"> Oops! Something went wrong, try again.</span>}
            </form>
            <CancelIcon 
            className="loginCancel"  
            onClick={()=>setShowLogin(false)}/>
        </div>
    )
}