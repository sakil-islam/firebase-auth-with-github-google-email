import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../utils/init-firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, GithubAuthProvider, sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth';

const AuthContext = createContext({
    currentUser: null,
    register: () => Promise,
    login: () => Promise,
    logout: () => Promise,
    signInWithGoogle: () => Promise,
    signInWithGithub: () => Promise,
    forgotPassword: () => Promise,
    resetPassword: () => Promise,
})

export const useAuth = () => useContext(AuthContext)

export default function AuthContextProvider({ children }){
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
        })
        return () => {
            unsubscribe()
        }
    },[])

    function register(email, password){
        return createUserWithEmailAndPassword(auth, email, password)
    }
    function login(email, password){
        return signInWithEmailAndPassword(auth, email, password)
    }
    function logout(){
        return signOut(auth)
    }

    function signInWithGoogle(){
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider)
    }
    function signInWithGithub(){
        const provider = new GithubAuthProvider();
        return signInWithPopup(auth, provider)
    }
    function forgotPassword(email){
        return sendPasswordResetEmail(auth, email, {url: 'http://localhost:3000/login'})
    }
    function resetPassword(oobCode, newPassword) {
        return confirmPasswordReset(auth, oobCode, newPassword)
    }

    const value = {
        currentUser,
        register,
        login,
        logout,
        signInWithGoogle,
        signInWithGithub,
        forgotPassword,
        resetPassword
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}