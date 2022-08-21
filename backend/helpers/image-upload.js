const multer = require('multer')
const path = require('path')

// Destination to store the images
const imageStorage = multer.diskStorage({
    destination:function (req, res, cb) {
        let folder = ""

        //identificar pela a url a pasta que o usuário vai enviar as imagens 
        if(req.baseUrl.includes("users")) {
            folder = "users"
        } else if (req.baseUrl.includes("pets")) {
            folder = "pets"
        }

        cb(null, `public/images/${folder}`)
    } ,
    filename: function (req, file, cb) {
        // Pegar o nome original do arquivo e achar a extensão dele
        // Usar o math.floor e random para gerar numeros aleatórios para enviar várias fotos ao banco
        cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname))
    },
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        // verificar se o usuário esta mandando a imagem em jpeg ou png se não estiver retorna uma mensagem a ele. 
        if(!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("Por favor, envie apenas jpg ou png!"))
        }
        // continuar se o usuário não cair no if
         cb(undefined, true)
    },
   
})

module.exports = { imageUpload }