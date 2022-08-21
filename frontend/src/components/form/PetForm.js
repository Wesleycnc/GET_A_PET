import {useState} from 'react'

import formStyles from './Form.module.css'

import Input from './Input'

import Select from './Select'


function PetForm({handleSubmit, petData, btnText}) {
const [pet, setPet] = useState(petData || {})
const [preview, setPreview] = useState([])
const colors = ["Branco", "Preto", "Cinza", "Caramelo", "Mesclado"]

function onFileChange(e) {
    // Para imprimir as imagens tenho que passar para um array por que ele é passado por um filename
    setPreview(Array.from(e.target.files))
    setPet({...pet, images: [...e.target.files]})
}
function handleOnChange(e) {
    setPet({...pet, [e.target.name]: e.target.value})
}

function handleColor(e) {
    setPet({...pet, color: e.target.options[e.target.selectedIndex].text})
}

function submit(e) {
    e.preventDefault()
    handleSubmit(pet)
}
    return(
        <form onSubmit={submit} className={formStyles.form_container}>
            <div className={formStyles.preview_pet_images}>
                {/* Pegar imagens que foram enviadas pelo preview */}
                {preview.length > 0 
                ? preview.map((image, index) => (
                    <img src={URL.createObjectURL(image)} alt={pet.name} key={`${pet.name}+${index}`} />
                )) : 
                /* Pegar imagens que foram cadastradas */
                pet.images && 
                pet.images.map((image, index) => (
                <img src={`${process.env.REACT_APP_API}/images/pets/${image}`} alt={pet.name} key={`${pet.name}+${index}`} />
                    ))
                }
            </div>
        <Input
            text="Imagens do Pet"
            type="file"
            name="images"
            handleOnChange={onFileChange}
            multiple={true}    
        />
        <Input
            text="Nome do pet"
            type="text"
            name="name"
            placeholder="Digite o nome"
            handleOnChange={handleOnChange}
            value={pet.name || ''}    
        />
        <Input
            text="Idade do pet"
            type="text"
            name="age"
            placeholder="Digite a idade"
            handleOnChange={handleOnChange}
            value={pet.age || ''}    
        />
        <Input
            text="Peso do pet"
            type="number"
            name="weight"
            placeholder="Digite o peso"
            handleOnChange={handleOnChange}
            value={pet.weight || ''}    
        />
        <Select
        name="color"
        text="Selecione a cor"
        options={colors}
        handleOnChange={handleColor}
        value={pet.color || ''} />
        <input type="submit" value={btnText} />
        </form>
    )
}

export default PetForm