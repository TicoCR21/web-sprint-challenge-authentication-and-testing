const request = require( "supertest" );
const server = require( "./server.js" );
const db = require( "../database/dbConfig" );

describe( "server", () =>
{
  beforeEach( () => db( "users" ).truncate() );
} );