const jwt = require( "jsonwebtoken" );
const constant = require( "../config/constants.js" );

module.exports = ( req, res, next ) => 
{
  const token = req.headers.authorization;
  if( token )
  {
    jwt.verify( token, constant.JWT_SECRET, ( error, decodedToken ) =>
    {
      if( error )
        return res.status( 401 ).json( { message: "you do not have access!" } );
      req.decodedToken = decodedToken;
      next(); 
    } );
  }
  else
    res.status( 401 ).json( { you: 'shall not pass!' } );
};