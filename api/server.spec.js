const request = require( "supertest" );

const server = require( "./server.js" );
const db = require( "../database/dbConfig.js" );

describe( "server", () =>
{
  beforeEach( () => db( "users" ).truncate() );

  describe( "GET", () =>
  {
    describe( "/", () =>
    {
      it( "Api Running", () => request( server ).get( "/" ).expect( { api: "running..." } ) );
      it( "Status 200", done => request( server ).get( "/" ).then( response => { expect( response.status ).toBe( 200 ); done(); } ) );
      it( "Testing Res Value", () => request( server ).get( "/" ).then( response => expect( response.body.api ).toBe( "running..." ) ) );
    } );

    describe( "/api/jokes", () =>
    {

      it( "Returns JSON", () =>
      {
        request( server ).get( "/api/jokes" ).then( response => expect( response.type ).toMatch( /json/i ) );
      } );

      it( "Getting Jokes", async () => 
      {
        await( request( server ).post( "/api/auth/register" ).send( { username: "Tico", password: "password" } ) );
        let result = await( request( server ).post( "/api/auth/login" ).send( { username: "Tico", password: "password" } ) );
        expect( result.statusCode ).toBe( 200 );
        expect( result.statusCode ).not.toBe( 401 );
        await( request( server ).post( "/api/auth/login" ).send( { username: "Tico", password: "password" } ) ).then( async response => 
          {
            const token = JSON.parse( response.res.text ).token;
            await request( server ).get( "/api/jokes" ).set( "authorization", token ).then( w => { console.log( w.statusCode ) } );
          } )
      } );
    } );
  } );

  describe( "POST", () =>
  {
    describe( "/register", () =>
    {
      it( "201 OK", async () => 
      {
        await( request( server ).post( "/api/auth/register" ).send( { username: "Tico1", password: "password" } ) );
        expect( await db( "users" ) ).toHaveLength( 1 );

        await( request( server ).post( "/api/auth/register" ).send( { username: "Tico2", password: "password" } ) );
        expect( await db( "users" ) ).toHaveLength( 2 );

        await( request( server ).post( "/api/auth/register" ).send( { username: "Tico2", password: "password" } ) );
        expect( await db( "users" ) ).not.toHaveLength( 3 );
      } );

      it( "Testing No Username Duplicates", async () => 
      {
        let result = await( request( server ).post( "/api/auth/register" ).send( { username: "Tico", password: "password" } ) );
        expect( await db( "users" ) ).toHaveLength( 1 );
        expect( result.statusCode ).toBe( 201 );

        let result2 = await( request( server ).post( "/api/auth/register" ).send( { username: "Tico", password: "password" } ) );
        expect( await db( "users" ) ).toHaveLength( 1 );
        expect( result2.statusCode ).not.toBe( 201 );
      } );
    } )

    describe( "/login", () =>
    {
      it( "Login Successful - 200", async () =>
      {
        await( request( server ).post( "/api/auth/register" ).send( { username: "Tico", password: "password" } ) );
        let result = await( request( server ).post( "/api/auth/login" ).send( { username: "Tico", password: "password" } ) );
        expect( result.statusCode ).toBe( 200 );
        expect( result.statusCode ).not.toBe( 401 );
      } );

      it( "Login Failure - 401", async () =>
      {
        let result = await( request( server ).post( "/api/auth/login" ).send( { username: "Tico", password: "password" } ) );
        expect( result.statusCode ).not.toBe( 200 );
        expect( result.statusCode ).toBe( 401 );
      } );
    } );
  } );
} );