let User = require('../models/User');

module.exports = {
    deleteUser: async (req, res, next) => {
        let idUser = req.user._id;

        try {
            let userDeleted = await User.findByIdAndDelete(idUser);
            res.status(200).json({ msg: 'Usuário deletado com sucesso!', user: userDeleted })
        } catch (error) {
            res.status(500).json({ msg: 'Não foi possível deletar este usuário', error: error.message });
        }
    }
}