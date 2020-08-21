const router = require( 'express' ).Router();
const bcryptjs = require( "bcryptjs" );
const Users = require( "../users/model" );
const constant = require( "../config/constants" );
const jwt = require( "jsonwebtoken" );

router.post( '/register', ( req, res ) => 
{
  console.log( "express" );
  const user = req.body;
  const rounds = process.env.BRCYPT || 8;

  const hash = bcryptjs.hashSync( user.password, rounds );
  user.password = hash;

  Users.add( user )
    .then( response => res.status( 201 ).json( { data: response } ) )
    .catch( error => res.status( 500 ).json( { message: error } ) )
} );

const signToken = user => jwt.sign( { subject: user.id, username: user.username }, constant.JWT_SECRET, { expiresIn: "1d" } )

router.post( '/login', ( req, res ) => 
{
  const user = req.body;
  Users.findBy( { username: user.username } )
    .then( ( [ response ] ) =>
    {
      if( response && bcryptjs.compareSync( user.password, response.password ) )
        res.status( 200 ).json( { message: "Welcome", token: signToken( response ) } )
      else
        res.status( 401 ).json( { message: "Invalid Credentials" } );
    } )
    .catch( error => res.status( 500 ).json( { error : "User Not Found!!!" } ) )
} );

module.exports = router;