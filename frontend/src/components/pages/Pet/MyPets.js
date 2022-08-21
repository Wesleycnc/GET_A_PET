import api from '../../../utils/api'

import styles from './Dashboard.module.css'

import {useState, useEffect} from 'react'

import { Link } from 'react-router-dom'

import RoundedImage from '../../layout/RoundedImage'

// hooks
import useFlashMessage from '../../../hooks/useFlashMessage'

function MyPets() {
    const [pets, setPets] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')
    const {setFlashMessage} = useFlashMessage()

    useEffect(() => {
        api.get('/pets/mypets',{
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            },
        })
        .then((response) => {
            setPets(response.data.pets)
        })
    }, [token])

    async function concludeAdoption(id) {
        let msgType = 'success'
        const data = await api.patch(`/pets/conclude/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            },
        }).then((response) => {
            return response.data
        }).catch((err) => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    // Remover Pet
    async function removePet(id) {
        let msgType = 'success'

        // Aqui usaremos o api.delete para remover um pet do sistema. Passaremos também headers: Athorization para o usuário conseguir excluir só o seu próprio pet.
        const data = await api.delete(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            // Aqui faremos uma constante Updated para ele identificar no banco qual pet foi excluido para excluir também no front-end
            //Na constante passaremos um filtro que vai retornar todos os pets que não tenham o id igual ao que foi excluido  
            const updatedPets = pets.filter((pet) => pet.id !== id)
            setPets(updatedPets)
            return response.data
        })
        .catch((err) => {
            msgType = 'error'
            return err.response.data
        })

        // Aqui exibiremos a mensagem caso o pet seja removido.
        setFlashMessage(data.message, msgType)
    }
    return(
        <section >
        <div className={styles.petslist_header}>

            <h1>Meus Pets</h1>
            <Link to="/pet/add">Cadastrar Pet</Link>
        </div>
            <div>
                {/* Aqui faremos uma codicional para futuramente exibirmos os pets: se a quantidade for maior que 0 ele vai exibir o parágrafo Meus Pets cadastrados. 
                se a quantidade for igual a 0 ele vai exibir Não há Pets cadastrados */}
                {pets.length > 0 && 
                   pets.map((pet) => (
                    <div className={styles.petlist_row} key={pet._id}>
                        <RoundedImage 
                        src={`${process.env.REACT_APP_API}/images/pets/${pet.images[0]}`} alt={pet.name}
                        width="px75"
                        />
                        <span className='bold'>{pet.name}</span>
                        <div className={styles.actions}>
                            {pet.available ? (<>
                                
                               {pet.adopter && (
                                <button className={styles.conclude_btn} onClick={() => {
                                    concludeAdoption(pet._id)
                                }}>Concluir adoção</button>
                               )}
                               <Link to={`/pet/edit/${pet._id}`}>Editar</Link>
                               {/* Colocaremos em uma função anonima para que ele espere que eu execute e ative a função anonima */}
                               <button onClick={() => {
                                removePet(pet._id)
                               }}>Excluir</button>
                            </>)
                            :
                            (
                                <p>Pet já adotado</p>
                            )}
                        
                        </div>

                    </div>
                   ))
                }
                
                {pets.length === 0 && 
                    <p>Não há Pets cadastrados</p>
                }
            </div>
        </section>
    )
}

export default MyPets