const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');
  const { check, validationResult } = require('express-validator');
require('./passport'); // Your local passport file


let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.name, // This is the username you’re encoding in the JWT
    expiresIn: '7d', // This specifies that the token will expire in 7 days
    algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
  });
}


/* POST login. */

module.exports = (router) => {
  router.post(
    '/login', (req, res) => {
     
      passport.authenticate('local', { session: false }, (error, user, info) => {
        if (error || !user) {
          return res.status(400).json({
            message: 'Something is not right',
            user,
          });
        }
        req.login(user, { session: false }, (err) => {
          if (err) {
            res.send(err);
          }
          const token = generateJWTToken(user.toJSON());
          return res.json({ user, token });
        });
      })(req, res);
    },
  );
};