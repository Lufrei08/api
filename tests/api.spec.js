const app = require('../bin/www');

let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
const base_url = 'http://localhost:3000';

chai.use(chaiHttp);

let testUserSignup = {
    username: 'Usuario',
    password: 'User01@',
    email: 'usuario@gmail.com'
};

let testUserLogin = {
    username: 'Usuario',
    password: 'User01@'
};

let testTask = {
    conteudo: 'Testar testes'
};

let testStatus = {
    status: true
};

let idTask = {};
let idUser = {};
let token = '';

describe('Teste automatizados na API', () => {

    it('Deve criar um usuário', (done) => {
        chai.request(base_url)
            .post('/signup')
            .send(testUserSignup)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('Deve logar um usuário já criado', (done) => {
        chai.request(base_url)
            .post('/login')
            .send(testUserLogin)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.equal(true);
                idUser = res.body._id;
                token = res.body.token;
                done();
            });
    });

    it('Deve criar uma task', (done) => {
        chai.request(base_url)
            .post('/index')
            .set('authorization', 'Bearer ' + token)
            .send(testTask)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    /*it('Deve entregar as tasks do usuario', (done) => {
        chai.request(base_url)
            .get('/index')
            .set('authorization', 'Bearer ' + token)
            .send(idUser)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });*/

    it('Deve realizar logout', (done) => {
        chai.request(base_url)
            .post('/logout')
            .set('authorization', 'Bearer ' + token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.equal(true);
                token = res.body.token;
                done();
            });
    });

    /*after(done => {
        let User = require('../models/User');
        User.findByIdAndDelete({ "_id": idUser })
            .then(ok => {
                console.log('Apagou')
                done();
            })
            .catch(error => {
                console.log('Error: ', error)
                done(error)
            })
    })*/
});