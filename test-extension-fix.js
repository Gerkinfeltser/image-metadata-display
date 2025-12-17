// Test the fixed extension initialization logic outside VS Code
console.log('Testing fixed extension initialization logic...\n');

// Mock vscode output channel
const outputChannel = {
    appendLine: (message) => console.log('[OUTPUT]', message)
};

// Import the fixed loadExifToolClass function
const { exec } = require('child_process');
const { promisify } = require('util');
const os = require('os');

const execAsync = promisify(exec);

// Copy the exact function from updated extension.ts
let ExifToolClass = null;
async function loadExifToolClass() {
    if (!ExifToolClass) {
        outputChannel.appendLine('Attempting to load ExifTool class...');
        try {
            // Try CommonJS require first (more compatible with VS Code sandbox)
            outputChannel.appendLine('Trying CommonJS require approach...');
            const exiftoolVendored = require('exiftool-vendored');
            ExifToolClass = exiftoolVendored.ExifTool;
            outputChannel.appendLine('✓ Successfully loaded ExifTool class via CommonJS require');
        } catch (requireError) {
            outputChannel.appendLine(`✗ CommonJS require failed: ${requireError instanceof Error ? requireError.message : String(requireError)}`);

            // Fall back to dynamic ES Module import
            outputChannel.appendLine('Falling back to dynamic ES Module import...');
            try {
                const module = await import('exiftool-vendored');
                ExifToolClass = module.ExifTool;
                outputChannel.appendLine('✓ Successfully loaded ExifTool class via dynamic import');
            } catch (importError) {
                outputChannel.appendLine(`✗ Dynamic import also failed: ${importError instanceof Error ? importError.message : String(importError)}`);
                throw importError;
            }
        }
    }
    return ExifToolClass;
}

// Test the complete initialization flow
async function testExtensionLogic() {
    console.log('\n=== Testing Extension Initialization Logic ===');

    try {
        // Step 1: Load ExifTool class
        const ExifTool = await loadExifToolClass();

        if (!ExifTool) {
            throw new Error('Failed to load ExifTool class');
        }

        // Step 2: Create instance
        outputChannel.appendLine('Creating ExifTool instance...');
        const exifTool = new ExifTool();

        // Step 3: Test metadata reading
        outputChannel.appendLine('Testing metadata reading...');
        const testImagePath = '/home/tuxor/image-metadata-display/images/explorer_example.jpg';
        const result = await exifTool.read(testImagePath);

        outputChannel.appendLine(`✓ Successfully read ${Object.keys(result).length} metadata fields`);

        // Step 4: Clean shutdown
        await exifTool.end();
        outputChannel.appendLine('✓ ExifTool ended cleanly');

        return { success: true, method: 'CommonJS' };

    } catch (error) {
        outputChannel.appendLine(`✗ Extension logic failed: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// Run the test
testExtensionLogic().then(result => {
    console.log('\n=== FINAL RESULT ===');
    console.log('Success:', result.success);
    if (result.success) {
        console.log('Method used:', result.method);
        console.log('✅ Extension initialization logic WORKS - Fix should resolve VS Code issue!');
    } else {
        console.log('❌ Extension initialization still fails:', result.error);
    }
}).catch(error => {
    console.error('Test failed:', error);
});