const db = require( "../database/dbConfig.js" );
const hf = require( "./model.js" );

describe( "users model", () => 
{
  beforeEach( async () => 
  {
    await db( "users" ).truncate();
  } );

  describe( "add", () => 
  {
    it( "Empty Database", async () =>
    {
      expect( await db( "users" ) ).toHaveLength( 0 ); 
      expect( await db( "users" ) ).not.toHaveLength( 1 ); 
    } );

    it( "add 1 user", async () =>
    {
      await hf.add( { username: "Tico", password: "password" } );
      expect( await db( "users" ) ).toHaveLength( 1 ); 
    } );

    it( "add 3 user", async () =>
    {
      await hf.add( { username: "Tico1", password: "password" } );
      await hf.add( { username: "Tico2", password: "password" } );
      await hf.add( { username: "Tico3", password: "password" } );
      expect( await db( "users" ) ).toHaveLength( 3 ); 
    } );
  } );
} );