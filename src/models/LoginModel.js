const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true},
    password: { type: String, required: true}
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async register() {
        // console.log('Registrando...');
        this.valida();

        if (this.errors.length > 0) return;

        await this.userExists();

        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
            this.body.password = bcryptjs.hashSync(this.body.password, salt);

        try {   
            this.user = await LoginModel.create(this.body)
        } catch (e) {
            console.log(e);
        }
        // console.log('Registrado na base de dados...');
    }

    async userExists() {
        const user = await LoginModel.findOne({
            email: this.body.email
        });
        if (user) this.errors.push('Usuário já cadastrado!')
    }

    valida() {
        // console.log('Validando...');
        this.cleanUp();

        //Email precisa ser válido
        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.');
        //Senha entre 3 e 50 chars
        if (this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
        // console.log('Validado 100%...');
    }

    cleanUp() {
        console.log('Cleaning that up...');
        for(const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            };
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        }
        console.log('Limpo!');
    }
}

module.exports = Login;