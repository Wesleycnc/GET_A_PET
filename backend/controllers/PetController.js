const Pet = require("../models/Pet")

// helpers 
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {
    // create a pet

    static async create (req, res) {
        const {name, age, weight, color } = req.body

        const images = req.files

        const available = true

        // images upload

      
        //validation



        if(!name) {
            res.status(422).json({message: "O nome é obrigatório!"})
            return
        }

        if(!age) {
            res.status(422).json({message: "A idade é obrigatório!"})
            return
        }
        if(!weight) {
            res.status(422).json({message: "O peso é obrigatório!"})
            return
        }
        if(!color) {
            res.status(422).json({message: "A cor é obrigatório!"})
            return
        }
        if(images.length === 0) {
            res.status(422).json({message: "A imagem é obrigatório!"})
            return
        }
        // get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)


        // create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            }
        })

        //Vou receber um array de objetos com dados da imagem e mandar para outro array só com os nomes das propriedades
        images.map((image) => {
            pet.images.push(image.filename)
        })

        try {
            // Salvando o pet no banco de dados
            const newPet = await pet.save()
            res.status(201).json({
                message: 'Pet cadastrado com sucesso!',
                newPet,
            })
            
        } catch (error) {
            res.status(500).json({message: error })
        }

    }

    //Pegar todos os pets cadastrados 
    static async getAll (req, res) {
        // pegar todos os pets sem nenhum filtro, e com o metodo sort para ordenar os pets mais novos.
        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({
            pets: pets,
        })
    }

    // Pegar todos os pets do usuário
    static async getAllUserPets(req, res) {
        // get user from token 
        const token = getToken(req)
        const user = await getUserByToken(token)
        // Filtrar usuário pelo user._id e ordenar em ordem crescente
        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt')

        res.status(200).json({
            pets,
        })
    }

    // Resgatar todas as adoções 
    static async getAllUserAdoptions(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'adopter._id': user._id}).sort('-createdAt')

        res.status(200).json({
            pets,
        })
    }

    static async getPetById (req, res) {
        const id = req.params.id

        // Verificar se o id está correto com a função ObjectId.isValid(id) se não vai retornar uma mensagem de erro.
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido! '})
            return
        }
        // Verificar se existe um pet com esse id
        const pet = await Pet.findOne({_id: id})

        //se não existir o pet com esse id fazemos if para retornar uma mensagem.
        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
        }
        // Se tiver o sistema é continuado retornando para ele os pets
        res.status(200).json({
            pet: pet,
        })
    }

    static async removePetById (req, res) {
        const id = req.params.id
        //Verificar se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido! '})
            return
        }
        // Verificar se existe um pet com esse id
        const pet = await Pet.findOne({_id: id})

        //se não existir o pet com esse id fazemos if para retornar uma mensagem.
        if(!pet) {
        res.status(404).json({message: 'Pet não encontrado'})
        return
        }

        //Verificar se o usuário logado registrou o pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        // comparando o id do usuario com o pet registrado 
        //Forçar o id a virar uma string com toString()
        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Holve um problema em processar a sua solicitção, tente novamente mais tarde!'})
            return
        }
        // Passando por as validações o sistema vai dar continuidade removendo o pet do sistema com o metodo findByIdAndRemove()
        await Pet.findByIdAndRemove(id)
        res.status(200).json({message: 'Pet removido com sucesso'})

        
    }
    // Atualizar os pets
    static async updatePet(req, res){
        // Aqui pegaremos todos os dados do body 
        const id = req.params.id

        const {name, age, weight, color, available } = req.body

        const images = req.files

        const updatedData = {}

        // Checar se o pet existe
         const pet = await Pet.findOne({_id: id})

        //se não existir o pet com esse id fazemos if para retornar uma mensagem.
        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
        }
        
        //Verificar se o usuário logado registrou o pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        // comparando o id do usuario com o pet registrado 
        //Forçar o id a virar uma string com toString()
        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Holve um problema em processar a sua solicitção, tente novamente mais tarde!'})
            return
        }

        if(!name) {
            res.status(422).json({message: "O nome é obrigatório!"})
            return
        } else {
            updatedData.name = name
        }

        if(!age) {
            res.status(422).json({message: "A idade é obrigatório!"})
            return
        } else {
            updatedData.age = age
        }
        if(!weight) {
            res.status(422).json({message: "O peso é obrigatório!"})
            return
        } else {
            updatedData.weight = weight
        }
        if(!color) {
            res.status(422).json({message: "A cor é obrigatório!"})
            return
        } else {
            updatedData.color = color
        }
        if(images.length > 0) {
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
        }
        await Pet.findByIdAndUpdate(id, updatedData)

        res.status(200).json({message: 'Pet atualizado com sucesso!!'})
    }
    // Agendar 
    static async schedule(req, res) {
        // Passar primeiro o id do PET
        const id = req.params.id

        // Checar se o pet existe
        const pet = await Pet.findOne({_id: id})

        //se não existir o pet com esse id fazemos if para retornar uma mensagem.
        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }
        //Verificar se o usuário logado registrou o pet
        const token = getToken(req)
        const user = await getUserByToken(token)
  
        // comparando o id do usuario com o pet registrado se for igual vai dar uma mensagem de erro
        //Forçar o id a virar uma string com toString()
        // Aqui usaremos o método equals() para fazer a comparação.
        if (pet.user._id.equals(user._id)) {
            res.status(422).json({
              message: 'Você não pode agendar uma visita com seu próprio Pet!',
            })
            return
          }

          // Checar se o usuário ja agendou a visita
          if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
              res.status(422).json({
                message: 'Você já agendou uma visita para este Pet!',
              })
              return
            }
            }

            // Adicionar o usuário como adotante do pet
            pet.adopter = {
                _id: user._id,
                name: user.name,
                image: user.image,
            }

            await Pet.findByIdAndUpdate(pet._id, pet)

            res.status(200).json({message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`})
          }

        // Concluir adoção do pet
        static async concludeAdoption(req, res) {

        const id = req.params.id

             // Checar se o pet existe
        const pet = await Pet.findOne({_id: id})

        //se não existir o pet com esse id fazemos if para retornar uma mensagem.
        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }
        //Verificar se o usuário logado registrou o pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        // comparando o id do usuario com o pet registrado 
        //Forçar o id a virar uma string com toString()
        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Holve um problema em processar a sua solicitção, tente novamente mais tarde!'})
            return
        }

        pet.available = false

        await Pet.findByIdAndUpdate(id, pet) 

            res.status(200).json({
                message: "Parabéns! o ciclo de adoção foi finalizado com sucesso"
            })
        }

        }
        
    


