const router = require( "express" ).Router();
const hf = require( "./model.js" );

router.get( "/", ( req, res ) =>
{
  hf.find()
    .then( response => res.status( 200 ).json( { data: response, jwt: req.decodeToken } ) )
    .catch( error => res.send( { error } ) );
} );

module.exports = router;