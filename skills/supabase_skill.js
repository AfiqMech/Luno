const { createClient } = require('@supabase/supabase-js');

// --- Supabase Skill ---
// Upgrade 12: Database & Multiplayer Backend
//
// Usage:
//   node supabase_skill.js query <table> [filter_json]
//   node supabase_skill.js insert <table> <data_json>
//   node supabase_skill.js upsert <table> <data_json>
//   node supabase_skill.js delete <table> <column> <value>
//   node supabase_skill.js rpc <function_name> [params_json]

function getClient() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
        console.error('❌ SUPABASE_URL or SUPABASE_ANON_KEY is missing.');
        console.error('   Run:');
        console.error('   antigravity memory set SUPABASE_URL "https://xyz.supabase.co"');
        console.error('   antigravity memory set SUPABASE_ANON_KEY "your_anon_key"');
        process.exit(1);
    }
    return createClient(url, key);
}

// --- Query rows from a table ---
async function queryTable(table, filterJson) {
    const supabase = getClient();
    console.log(`📖 Querying table: ${table}...`);
    let query = supabase.from(table).select('*');
    if (filterJson) {
        const filters = JSON.parse(filterJson);
        for (const [col, val] of Object.entries(filters)) {
            query = query.eq(col, val);
        }
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    console.log(`✅ Found ${data.length} rows:`);
    console.log(JSON.stringify(data, null, 2));
    return data;
}

// --- Insert rows into a table ---
async function insertRow(table, dataJson) {
    const supabase = getClient();
    const rowData = JSON.parse(dataJson);
    console.log(`➕ Inserting into ${table}:`, rowData);
    const { data, error } = await supabase.from(table).insert(rowData).select();
    if (error) throw new Error(error.message);
    console.log(`✅ Inserted successfully:`, data);
    return data;
}

// --- Upsert (insert or update) rows ---
async function upsertRow(table, dataJson) {
    const supabase = getClient();
    const rowData = JSON.parse(dataJson);
    console.log(`🔄 Upserting into ${table}:`, rowData);
    const { data, error } = await supabase.from(table).upsert(rowData).select();
    if (error) throw new Error(error.message);
    console.log(`✅ Upserted successfully:`, data);
    return data;
}

// --- Delete rows ---
async function deleteRow(table, column, value) {
    const supabase = getClient();
    console.log(`🗑️ Deleting from ${table} where ${column} = ${value}...`);
    const { error } = await supabase.from(table).delete().eq(column, value);
    if (error) throw new Error(error.message);
    console.log(`✅ Deleted successfully.`);
}

// --- Call a Supabase RPC function (e.g. for leaderboards) ---
async function callRpc(functionName, paramsJson) {
    const supabase = getClient();
    const params = paramsJson ? JSON.parse(paramsJson) : {};
    console.log(`⚡ Calling RPC: ${functionName}(${JSON.stringify(params)})`);
    const { data, error } = await supabase.rpc(functionName, params);
    if (error) throw new Error(error.message);
    console.log(`✅ RPC result:`, JSON.stringify(data, null, 2));
    return data;
}

// --- Main ---
async function main() {
    const command = process.argv[2];
    const arg1 = process.argv[3];
    const arg2 = process.argv[4];
    const arg3 = process.argv[5];

    try {
        if (command === 'query') {
            await queryTable(arg1, arg2);
        } else if (command === 'insert') {
            await insertRow(arg1, arg2);
        } else if (command === 'upsert') {
            await upsertRow(arg1, arg2);
        } else if (command === 'delete') {
            await deleteRow(arg1, arg2, arg3);
        } else if (command === 'rpc') {
            await callRpc(arg1, arg2);
        } else {
            console.log('🗄️  Antigravity Database Skill (Supabase)');
            console.log('Usage:');
            console.log('  antigravity database query <table> [filter_json]');
            console.log('  antigravity database insert <table> <data_json>');
            console.log('  antigravity database upsert <table> <data_json>');
            console.log('  antigravity database delete <table> <column> <value>');
            console.log('  antigravity database rpc <function_name> [params_json]');
            console.log('');
            console.log('Example (game leaderboard):');
            console.log('  antigravity database insert scores \'{"player":"Afiq","score":9999}\'');
            console.log('  antigravity database query scores');
        }
    } catch (err) {
        console.error('❌ Supabase skill error:', err.message || err);
        process.exit(1);
    }
}

main();
