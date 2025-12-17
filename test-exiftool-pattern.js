const { ExifTool } = require('exiftool-vendored');

class TestMetadataProvider {
    constructor() {
        this.exifTool = null;
        this.useNativeExifTool = false;
        this.initializationPromise = this.initializeExifTool();
        this.initializationError = null;
    }

    async initializeExifTool() {
        console.log('Starting initialization...');

        try {
            console.log('Trying vendored ExifTool...');
            this.exifTool = new ExifTool();
            this.initializationError = null;
            console.log('Vendored ExifTool initialized successfully');
            return;
        } catch (error) {
            console.error('Vendored failed:', error.message);
            this.initializationError = `Vendored ExifTool failed: ${error.message}`;
        }
    }

    async testMetadata() {
        console.log('Testing metadata reading...');

        // Wait for initialization to complete (same pattern as extension)
        if (this.initializationPromise) {
            await this.initializationPromise;
        }

        if (this.initializationError) {
            console.error('Initialization error:', this.initializationError);
            return this.initializationError;
        }

        try {
            if (this.exifTool && !this.useNativeExifTool) {
                console.log('Using vendored ExifTool...');
                const metadata = await this.exifTool.read('/home/tuxor/image-metadata-display/images/explorer_example.jpg');
                console.log('Success! Metadata fields:', Object.keys(metadata).length);
                return `Success: ${Object.keys(metadata).length} fields found`;
            }
        } catch (err) {
            console.error('Metadata read failed:', err.message);
            return `Error: ${err.message}`;
        }
    }

    async dispose() {
        if (this.exifTool) {
            await this.exifTool.end();
        }
    }
}

async function runTest() {
    console.log('=== Testing Extension Pattern ===');

    const provider = new TestMetadataProvider();

    // Simulate immediate call (like VS Code would do)
    const result = await provider.testMetadata();
    console.log('Result:', result);

    await provider.dispose();
}

runTest().catch(console.error);