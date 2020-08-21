const db = require( "../database/dbConfig" );

const find = () => db( "users" );
const findBy = filter => db( "users" ).where( filter );
const add = user => db( "users" ).insert( user, "id" );

module.exports = { find, findBy, add };