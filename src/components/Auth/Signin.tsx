import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import "../../styles.css";
// components
import Snackbar from "../Snackbar";
// auth
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import firebaseAuth from "../../util/FirebaseServices/auth";
import { createStudentAccount, createTeacherAccount } from "../../util/PostRequests";
import { useAuth } from "../../hocs/AuthProvider";


interface SigninData {
  email: string;
  password: string;
}

interface SignupData extends SigninData {
  name: string;
  student: boolean;
}

export default function Signin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [signin, setSignin] = useState<boolean>(false);
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    name: '',
    password: '',
    student: true
  });
  const [signinData, setSigninData] = useState<SigninData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.teacher) navigate("/teacher/app");
      else if (user.student) navigate("/student/app");
    }
  }, [user, navigate])

  const handleSignupTextChange = (e: React.ChangeEvent<HTMLInputElement>) => 
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
  
  const handleRadioButtonClicked = (e: React.ChangeEvent<HTMLInputElement>) =>
        setSignupData({ ...signupData, student: !signupData.student });

  const handleSigninTextChange = (e: React.ChangeEvent<HTMLInputElement>) => 
        setSigninData({ ...signinData, [e.target.name]: e.target.value });

  const handleSigninClicked = (e: React.MouseEvent<HTMLButtonElement>) => setSignin(!signin);

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createUserWithEmailAndPassword(firebaseAuth, signupData.email, signupData.password)
    .then( async (user) => {
      if (signupData.student) {
        await createStudentAccount(user.user.uid, signupData.name, signupData.email);
        setSignin(false);
      }
      else {
        await createTeacherAccount(user.user.uid, signupData.name, signupData.email);
        setSignin(false);
      }
    })
    .catch(err =>  {
      let errorMessage = (err as Error).message;
      if (errorMessage === 'Firebase: Error (auth/email-already-in-use).') errorMessage = 'Account already exist.';
      else if (errorMessage.search('(auth/weak-password)') !== -1 ) errorMessage = 'Weak Password.';
      
      setError(errorMessage)
    });
  }

  const handleSignin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signInWithEmailAndPassword(firebaseAuth, signinData.email, signinData.password)
    .catch(err => {
      let errorMessage = (err as Error).message;
      if (errorMessage === 'Firebase: Error (auth/user-not-found).') errorMessage = 'Account does not exist.';
      else if (errorMessage === 'Firebase: Error (auth/wrong-password).') errorMessage = 'Wrong password.';
      
      setError(errorMessage)
    });
  }

  return (
    <>
      <div className={`container ${signin ? "right-panel-active" : ""}`}  id="container">

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-right">
              <h1>Welcome!</h1>
              <p>Don't have an account yet?</p>
              <button className="ghost" id="signUp" onClick={handleSigninClicked}>Sign Up</button>
            </div>
            
            <div className="overlay-panel overlay-left">
              <h1>Ready?</h1>
              <p>Login your account to start</p>
              <button className="ghost" id="signIn" onClick={handleSigninClicked}>Sign In</button>
            </div>
          </div>
        </div>

        <div className="form-container sign-in-container">
          <form className="form-main" method="post" onSubmit={handleSignin}>
            <div className="logo-container">
              <img src="https://swingsearch.com/wp-content/uploads/2020/02/cropped-logo-new-p.png" alt="LOGO" />
            </div>
            <h1 id="signin">Sign in</h1>
              <input type="email" placeholder="Email" name="email" value={signinData.email} onChange={handleSigninTextChange} required />
              <input type="password" placeholder="Password" name="password" value={signinData.password} onChange={handleSigninTextChange} required />
                <a href="/">Forgot your password?</a>
                <button type="submit">Sign In</button>
          </form>
        </div>

        <div className="form-container sign-up-container">
          <form className="form-main" method="post" onSubmit={handleSignup}>
              <div className="logo-container">
                <img src="https://swingsearch.com/wp-content/uploads/2020/02/cropped-logo-new-p.png" alt="LOGO" />
              </div>

              <h1 id="signup">Sign Up</h1>

              <div className="wrapper">
                <input type="radio" name="select" id="student" checked={signupData.student} onChange={handleRadioButtonClicked} />
                <input type="radio" name="select" id="teacher" checked={!signupData.student} onChange={handleRadioButtonClicked} />
                <label htmlFor ="student" className="option student">
                  <span>Student</span>
                </label>
                <label htmlFor ="teacher" className="option teacher">
                    <span>Teacher</span>
                </label>
              </div>

              <div className="logo-container" />

              <input type="text" placeholder="Name" name="name" value={signupData.name} onChange={handleSignupTextChange} required />
              <input type="email" placeholder="Email" name="email" value={signupData.email} onChange={handleSignupTextChange} required />
              <input type="password" placeholder="Password" name="password" value={signupData.password} onChange={handleSignupTextChange} required />

              <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>

      <Snackbar 
        open={error !== null}
        handleClose={() => setError(null)}
        message={error as string}
        severity="error"
      />
    </>
  )
}