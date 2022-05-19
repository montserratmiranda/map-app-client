import { TravelExplore } from "@mui/icons-material"
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import * as React from "react"
import "./signup.css"

export default function SignUp({setShowSignUp}){
    const [success , setSucess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const usernameRef = React.useRef()
    const emailRef = React.useRef()
    const nationalityRef = React.useRef()
    const passwordRef = React.useRef()

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const newUser = {
            username:usernameRef.current.value,
            email:emailRef.current.value,
            nationality:nationalityRef.current.value,
            password: passwordRef.current.value
        };

        try{
            await axios.post("https://map-app-backend.herokuapp.com/users/signup", newUser);
            setError(false);
            setSucess(true);
        }catch(err){
            setError(true)
        }    
    }
    return (
        <div className="signUpContainer">
            <div className="logo">
                <TravelExplore/>
                Travels Unraveled
            </div>
            <form onSubmit= {handleSubmit}>
            <input type="text" placeholder="Username" ref={usernameRef} />
            <input type="email" placeholder="Email" ref={emailRef} />
            <input type="text" placeholder="Nationality" ref={nationalityRef}/>
            <input type="password" placeholder="Password" ref={passwordRef}/>
            <button className="signUpButton"> Sign Up</button>
            {success && <span className="success"> Sucess! Welcome aboard!</span>}
            {error && <span className="failure"> Oops! Something went wrong, try again.</span>}
            </form>
            <CancelIcon 
            className="signUpCancel"  
            onClick={()=>setShowSignUp(false)}/>
        </div>
    )
}