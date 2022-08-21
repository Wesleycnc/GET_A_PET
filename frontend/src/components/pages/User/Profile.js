import api from '../../../utils/api'


import {useState, useEffect} from 'react'


import styles from './Profile.module.css'
import formStyles from '../../form/Form.module.css'

import Input from '../../form/Input'

import useFlashMessage from '../../../hooks/useFlashMessage'
import RoundedImage from '../../layout/RoundedImage'


function Profile() {
    const [user, setUser] = useState({})
    const [preview, setPreview] = useState()
    // Aqui pegaremos o token
    const [token] = useState(localStorage.getItem('token') || '')
    const {setFlashMessage} = useFlashMessage()

    useEffect(() => {
        //Pegar o usuário por meio do token
        api.get('/users/checkuser',{
            headers: {
                // Garantir que o token vai ser enviado de forma correta
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setUser(response.data)
        })

    }, 
    // Aqui criamos uma dependencia para que o use effect tenha o token
    [token])

    // essa função vai permir que o usuário coloque sua primeira imagem e para que ele possa atualizar futuramente
    function onFileChange(e) {
        setPreview(e.target.files[0])
        setUser({...user, [e.target.name]: e.target.files[0] })
    }
    function handleChange(e) {
    setUser({...user, [e.target.name]: e.target.value})
    }

    async function handleSubmit(e) {
    e.preventDefault()

    let msgType = 'Success'
    
    const formData = new FormData()
    
    // Pegar a chave do objeto do usuário que estou preenchendo no useState e fazer uma transferência para cada chave que eu tiver, por meio do foreach no formData
    await Object.keys(user).forEach((key) => 
    // dar um append em formData, nisso vai gerar um objeto preenchido de formData com os dados do usuário.
        formData.append(key, user[key])
    )
    // Chamar a api 
    const data = await api.patch(`/users/edit/${user._id}`, formData, {
        headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
            // Fazer que o express entenda que este formulário pode ir dados de imagem
            'Content-Type': 'multipart/form-data'
        }
    }).then((response) => {
        return response.data
    }).catch((err) => {
        msgType = 'error'
        return err.response.data
    })

    setFlashMessage(data.message, msgType)
    }

    return(

        <section>
        <div className={styles.profile_header}>
            <h1>Perfil</h1>
            {/* Aqui faremos uma condicional: se user image ou preview estiver preenchido eu vou exibir alguma coisa se não estiver não vai ser preechido nada.  */}
            {(user.image || preview) && (
                // Aqui vamos colocar que a src da imagem: se tiver preview eu vou ter que criar uma URL baseado no objeto da imagem ou seja o usuário trocou de imagem eu tenho um preview. Para criar isso usaremos o URL.createObjectURL(preview)
                <RoundedImage src={preview ? URL.createObjectURL(preview) : `${process.env.REACT_APP_API}/images/users/${user.image}`}
                alt={user.name} />
            )}
        </div>
        <form onSubmit={handleSubmit} className={formStyles.form_container}>
            <Input
            text="imagem"
            type="file"
            name="image" 
            handleOnChange={onFileChange}/>
            <Input
            text="E-mail"
            type="email"
            name="email" 
            placeholder="Digite o seu email"
            handleOnChange={handleChange}
            value={user.email || ''}/>
            <Input
            text="Nome"
            type="text"
            name="name" 
            placeholder="Digite o seu nome"
            handleOnChange={handleChange}
            value={user.name || ''}/>
            <Input
            text="Telefone"
            type="text"
            name="phone" 
            placeholder="Digite o seu telefone"
            handleOnChange={handleChange}
            value={user.phone || ''}/>
            <Input
            text="Senha"
            type="password"
            name="password" 
            placeholder="Digite a sua senha"
            handleOnChange={handleChange}/>
            <Input
            text="Confirmação de senha"
            type="password"
            name="confirmpassword" 
            placeholder="Confirme sua senha"
            handleOnChange={handleChange} />

        <input type="submit" value="Editar"/>

                
        </form>
        </section>
    )
}

export default Profile