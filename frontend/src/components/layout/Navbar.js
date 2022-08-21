import {Link} from 'react-router-dom'
import { useContext } from 'react'
import styles from './Navbar.module.css'
import Logo from '../../assets/img/logo.png'

// Contexto
import {Context} from '../../context/UserContext'


function Navbar() {

    const {authenticated, logout} = useContext(Context)
    return(
     <nav className={styles.navbar}>
        <div className={styles.navbar_logo}>
            <img src={Logo} alt="Get A Pet"></img>
            <h2>Get A Pet</h2>
        </div>

        <ul>
        <li>
            <Link to="/">Adotar</Link>
        </li>
        {
            // Método para desaparecer outras funções da nav bar quando o usuário estiver logado
        authenticated ? (

        <>      
          <li>
            <Link to="/pet/myadoptions">Minhas adoções</Link>
        </li>
          <li>
            <Link to="/pet/mypets">Meus Animais</Link>
        </li>
          <li>
            <Link to="/user/profile">Perfil</Link>
        </li>
        
        <li onClick={logout}>Sair</li>  
        </>

        ) : ( 

        <>
  

        <li>
            <Link to="/login">Entrar</Link>
        </li>
        <li>
                <Link to="/register">Cadastrar</Link>
        </li>
        
        </>)
        }

        </ul>
     </nav>
    )
}

export default Navbar