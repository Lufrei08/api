const User = require("../models/User");

module.exports = {
    signup: (req, res, next) => {
        const { username, password, email } = req.body;

        const user = new User({ username, password, email });

        user.save()
            .then(userSaved => {
                return res.status(201).json(userSaved);
            })
            .catch(error => {
                return res.status(500).json(error.message);
            });
    },
    login: async (req, res, next) => {
        const { username, password } = req.body;

        let user = await User.findOne({ 'username': username });
        if (user != null) {
            user.comparePassword(password, (err, isMatch) => {
                if (isMatch && !err) {
                    user.generateAuthToken()
                        .then(sucesso => {
                            return res.status(200).json(sucesso);
                        })
                        .catch(error => {
                            return res.status(500).json(error);
                        });
                } else {
                    return res.status(401).json({ success: false, token: null, msg: "Senha incorreta!" });
                }
            });
        } else {
            return res.status(401).json({ success: false, token: null, msg: "Usuario não encontrado!" });
        }
    },
    logout: (req, res, next) => {
        const userId = req.user._id;

        User.updateOne(
            { _id: userId },
            {
                $set:
                {
                    token: null
                }
            })
            .then(user => {
                return res.status(200).json({
                    success: true,
                    token: null,
                    msg: 'Logout realizado com sucesso!'
                });
            })
            .catch(error => {
                return res.status(500).json({
                    success: false,
                    token: null,
                    msg: 'Erro ao realizar logout, tente novamente!'
                });
            })
    }

}