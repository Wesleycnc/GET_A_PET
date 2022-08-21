// api 
import api from '../utils/api'

import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import useFlashMessage from './useFlashMessage'

export default function useAuth() {
    const [authenticated, setAuthenticated] = useState(false)
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    
    useEffect(() => {
        // pegar o token
        const token = localStorage.getItem('token')

        //Verificar se o token chegou  
        if(token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticated(true)
        }
    }, [])

    async function register(user) {

        let msgText = 'Cadastro realizado com sucesso!'
        let msgType = 'sucess'

        try {
            const data = await api.post('/users/register', user).then((response) => {
                return response.data
            })
            await authUser(data)
        } catch (error) {
            // tratar erro
        msgText = error.response.data.message
        msgType = 'error'
        }

        setFlashMessage(msgText, msgType)
    }

    async function authUser(data) {

        setAuthenticated(true)

        localStorage.setItem('token', JSON.stringify(data.token))
        
        navigate("/");
    }
    // Fazer login no sistema
    async function login(user) {
        let msgText = 'Login realizado com sucesso'
        let msgType = 'Success'

        try {
            const data = await api.post('/users/login', user).then((reponse) => {
                return reponse.data
            })

            await authUser(data)

        } catch (error) {
            msgText = error.response.data.message
            msgType = 'error'
        }
        setFlashMessage(msgText, msgType)
    }

    // Deslogar do sistema
    function logout() {
        const msgText = 'O usuário foi deslogado!'
        const msgType = 'secess'

        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined
        navigate('/')

        setFlashMessage(msgText, msgType)
    }


    return { authenticated, register, logout, login }
}