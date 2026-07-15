import { createContext } from "react";


export const Globalvariale = createContext()

export const GlobalProvider = ({children}) =>{
    function greet(){
        alert('Hello')
    }
    function message(){
        alert('Welcome to Global context API')
    }
    
    const dataname ="Aryan"
    return(
        <Globalvariale.Provider value={{dataname,greet,message}}>
            {children}
        </Globalvariale.Provider>
    )
}

export const useGlobal = () => useContext(Globalvariale)
