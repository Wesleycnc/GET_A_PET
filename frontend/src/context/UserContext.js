import {createContext} from 'react'

import useAuth from '../hooks/useAuth'

const Context = createContext()

// aqui pegaremos o children para fazer a sinalização para qual componentes ele vai passar os dados
function UserProvider({children}) {
    const {authenticated, register, logout, login} = useAuth()

    return (
        <Context.Provider value={{authenticated, register, logout, login}}>
            {children}
        </Context.Provider>
    )
}

export {Context, UserProvider}