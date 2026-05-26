import { connectToDatabase, disconnectFromDatabase, getDbClient, isConnectedToDatabase } from './db/connection.ts';

/**
 * Test the database connection and basic query execution
 */
async function testDatabaseConnection() {
  console.log('🔍 Starting database connection tests...\n');

  try {
    // Test 1: Connect to database
    console.log('Test 1: Connecting to database...');
    await connectToDatabase();
    console.log('✓ Connection successful\n');

    // Test 2: Check connection status
    console.log('Test 2: Checking connection status...');
    const connected = isConnectedToDatabase();
    console.log(`✓ Connection status: ${connected ? 'Connected' : 'Disconnected'}\n`);

    // Test 3: Execute a simple query
    console.log('Test 3: Executing a test query...');
    const client = getDbClient();
    const result = await client.query('SELECT NOW() as current_time');
    console.log(`✓ Query executed successfully`);
    console.log(`  Current database time: ${result.rows[0].current_time}\n`);

    // Test 4: Execute a more complex query to verify database structure
    console.log('Test 4: Checking database tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log(`✓ Found ${tablesResult.rows.length} table(s)`);
    if (tablesResult.rows.length > 0) {
      console.log('  Tables:');
      tablesResult.rows.forEach(row => {
        console.log(`    - ${row.table_name}`);
      });
    }
    console.log();

    // Test 5: Select from products table
    console.log('Test 5: Querying the products table...');
    const productsResult = await client.query('SELECT * FROM products LIMIT 5;');
    console.log(`✓ Retrieved ${productsResult.rows.length} product(s)`);
    if (productsResult.rows.length > 0) {
      console.log('  Sample products:');
      productsResult.rows.forEach((product, index) => {
        console.log(`    ${index + 1}. ${JSON.stringify(product)}`);
      });
    } else {
      console.log('  The products table is currently empty.');
    }
    console.log();

    // Test 6: Disconnect from database
    console.log('Test 6: Disconnecting from database...');
    await disconnectFromDatabase();
    console.log('✓ Disconnection successful\n');

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed with error:');
    console.error(error);
    process.exit(1);
  }
}

testDatabaseConnection();