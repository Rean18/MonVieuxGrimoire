const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;


exports.signup = (req, res, next) => {
    console.log('Request body', req.body)
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => {
                    console.log('User created successfully'); 
                    res.status(201).json({ message: 'Utilisateur créé !' });
                })
                .catch(error => {
                    console.error('Error saving user:', error); 
                    res.status(500).json({ error });
                });
        })
        .catch(error => {
            console.error('Error hashing password:', error); 
            res.status(500).json({ error });
        });
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user){
                res.status(401).json({ message: 'La combinaison mot de passe / email est incorrecte'})
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if(!valid) {
                            res.status(401).json({message: 'La combinaison mot de passe / email est incorrecte' })
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    secretKey,
                                    { expiresIn: '24h'}
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch( error => res.status(500).json({ error }));
};