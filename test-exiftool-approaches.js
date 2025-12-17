// Test CommonJS require approach vs dynamic import
console.log('Testing ExifTool loading approaches...');

const os = require('os');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

console.log('\n=== Environment Info ===');
console.log('Platform:', os.platform(), os.arch());
console.log('Node.js:', process.version);

async function testApproach(approachName, testFn) {
    console.log(`\n--- Testing ${approachName} ---`);
    try {
        const result = await testFn();
        console.log(`✓ SUCCESS: ${approachName}`);
        return { success: true, result };
    } catch (error) {
        console.error(`✗ FAILED: ${approachName}`);
        console.error('Error:', error.message);
        return { success: false, error: error.message };
    }
}

async function testVendoredRequire() {
    console.log('1. Testing CommonJS require approach...');
    try {
        const ExifTool = require('exiftool-vendored').ExifTool;
        console.log('2. ExifTool class loaded via require');

        const exifTool = new ExifTool();
        console.log('3. ExifTool instance created');

        const result = await exifTool.read('/home/tuxor/image-metadata-display/images/explorer_example.jpg');
        console.log('4. Read metadata successfully');

        await exifTool.end();
        console.log('5. ExifTool ended cleanly');

        return { success: true, fields: Object.keys(result).length };
    } catch (error) {
        throw error;
    }
}

async function testVendoredImport() {
    console.log('1. Testing Dynamic ES Module import approach...');
    try {
        const module = await import('exiftool-vendored');
        const ExifTool = module.ExifTool;
        console.log('2. ExifTool class loaded via import');

        const exifTool = new ExifTool();
        console.log('3. ExifTool instance created');

        const result = await exifTool.read('/home/tuxor/image-metadata-display/images/explorer_example.jpg');
        console.log('4. Read metadata successfully');

        await exifTool.end();
        console.log('5. ExifTool ended cleanly');

        return { success: true, fields: Object.keys(result).length };
    } catch (error) {
        throw error;
    }
}

async function testNativeFallback() {
    console.log('1. Testing native ExifTool fallback...');
    try {
        await execAsync('exiftool -ver');
        console.log('2. Native ExifTool available');
        return { success: true };
    } catch (error) {
        console.error('Native ExifTool not available:', error.message);
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log('\n=== Starting ExifTool Loading Tests ===\n');

    const results = {};

    // Test 1: CommonJS require approach
    results.require = await testApproach('CommonJS require()', testVendoredRequire);

    // Test 2: Dynamic ES Module import approach
    results.import = await testApproach('Dynamic ES Module import()', testVendoredImport);

    // Test 3: Native fallback
    results.native = await testApproach('Native ExifTool fallback', testNativeFallback);

    console.log('\n=== Test Results ===');
    console.log('CommonJS require():', results.require.success ? 'SUCCESS' : 'FAILED',
               results.require.success ? `(${results.require.fields} fields)` : `(${results.require.error})`);
    console.log('Dynamic import():', results.import.success ? 'SUCCESS' : 'FAILED',
               results.import.success ? `(${results.import.fields} fields)` : `(${results.import.error})`);
    console.log('Native fallback:', results.native.success ? 'AVAILABLE' : 'NOT AVAILABLE');

    return results;
}

runTests().then(results => {
    console.log('\n=== Summary ===');
    const workingMethods = [];
    if (results.require.success) workingMethods.push('CommonJS require()');
    if (results.import.success) workingMethods.push('Dynamic import()');
    if (results.native.success) workingMethods.push('Native fallback');

    console.log('Working ExifTool methods:', workingMethods.join(', '));

    if (workingMethods.length === 0) {
        console.log('\n❌ ALL METHODS FAILED - Extension will not work');
    } else {
        console.log('\n✅ At least one method works - Extension can be fixed');
    }
}).catch(error => {
    console.error('Test suite failed:', error);
});