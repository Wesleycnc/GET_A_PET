// Função para envontrar o usuário através do token
const jwt = require('jsonwebtoken')

const User = require('../models/User')

// get user by jwt token

const getUserByToken = async (token) => {
    if(!token) {
        return res.status(401).json({message: 'Acesso Negado!'})
        
    }

    // Decodificar o token
    const decoded = jwt.verify(token, 'nossosecret') 
    
    const userId = decoded.id

    // Fazer com o que o usuário chegue pelo id
    const user = await User.findOne({_id: userId})

    return user
}

module.exports = getUserByToken