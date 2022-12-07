const jwt = require('jsonwebtoken');
const segredo = require('../config/chavetoken');
const User = require('../models/User');

module.exports = {
    jwtVerify: (req, res, next) => {
        let authorizationHeader = req.headers['authorization'];
        if (authorizationHeader) {
            var token = authorizationHeader.replace('Bearer ', '');
        } else {
            return res.status(401).json({
                success: false,
                msg: 'O envio do token é obrigatório!'
            });
        }


        if (token) {
            jwt.verify(token, segredo.segredoToken, function (err, tokenDecoded) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        msg: 'Falha ao verificar o token, tente novamente'
                    });
                } else {
                    let userId = tokenDecoded._id;

                    User.findOne({
                        _id: userId,
                        token: token
                    }, { username: 1, _id: 1 })
                        .then(user => {
                            if (user) {
                                req.user = user;
                                next();
                            } else {
                                return res.status(401).json({
                                    success: false,
                                    msg: 'Token não encontrado. Faça login novamente!'
                                });
                            }
                        })
                        .catch(error => {
                            return res.status(401).json({
                                success: false,
                                msg: 'Token inválido',
                                error: error.message
                            });
                        });
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                msg: 'O envio do token é obrigatório!'
            });
        }
    }
}
