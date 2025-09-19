import * as vscode from 'vscode';
import { ExifTool } from 'exiftool-vendored';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const outputChannel = vscode.window.createOutputChannel('Image Metadata Extension');

export function activate(context: vscode.ExtensionContext) {
    console.log("Debug: Image Metadata Extension is now active.");
    outputChannel.appendLine('Image Metadata Extension is now active!');
    outputChannel.appendLine(`Platform: ${os.platform()} ${os.arch()}`);
    outputChannel.appendLine(`Node.js version: ${process.version}`);
    outputChannel.appendLine(`VS Code version: ${vscode.version}`);

    const metadataProvider = new MetadataProvider();
    const scheme = 'image-metadata';
    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(scheme, metadataProvider));

    let disposable = vscode.commands.registerCommand('extension.inspectImageMetadata', async (uri: vscode.Uri | undefined) => {
        console.log("Debug: Inspect Image Metadata command executed.");
        outputChannel.appendLine("Inspect Image Metadata command executed.");

        try {
            if (uri) {
                // Open the image using vscode.open
                await vscode.commands.executeCommand('vscode.open', uri, { preview: false, viewColumn: vscode.ViewColumn.One });
                // Show metadata in the second column
                await showMetadata(uri, vscode.ViewColumn.Two);
            } else {
                const fileUris = await vscode.window.showOpenDialog({
                    canSelectMany: false,
                    openLabel: 'Open',
                    filters: { 'Images': ['png', 'webp', 'jpg', 'jpeg'] }
                });

                if (fileUris && fileUris.length > 0) {
                    await vscode.commands.executeCommand('vscode.open', fileUris[0], { preview: false, viewColumn: vscode.ViewColumn.One });
                    await showMetadata(fileUris[0], vscode.ViewColumn.Two);
                } else {
                    console.log("Debug: No image file was selected.");
                    outputChannel.appendLine('No image file was selected.');
                }
            }
        } catch (error) {
            const errorMessage = `Error executing command: ${error instanceof Error ? error.message : String(error)}`;
            console.error("Debug: " + errorMessage);
            outputChannel.appendLine(errorMessage);
            vscode.window.showErrorMessage(`Image Metadata Inspector: ${errorMessage}`);
        }
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(metadataProvider);
}

async function showMetadata(fileUri: vscode.Uri, viewColumn: vscode.ViewColumn) {
    const fileName = fileUri.fsPath.split('\\').pop() || fileUri.fsPath.split('/').pop() || 'Unknown';
    console.log(`Debug: Showing image metadata for ${fileName}`);
    outputChannel.appendLine(`Showing image metadata for ${fileName}...`);

    const scheme = 'image-metadata';
    const supportedExtensions = ['.png', '.webp', '.jpg', '.jpeg'];
    const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    
    if (supportedExtensions.includes(fileExtension)) {
        const metadataUri = vscode.Uri.parse(`${scheme}:${fileUri.fsPath}.metadata`);
        try {
            const doc = await vscode.workspace.openTextDocument(metadataUri);
            await vscode.window.showTextDocument(doc, { viewColumn: viewColumn, preserveFocus: true });
        } catch (e) {
            const errorMessage = `Failed to show image metadata for ${fileName}: ${e instanceof Error ? e.message : String(e)}`;
            console.log(`Debug: ${errorMessage}`);
            outputChannel.appendLine(errorMessage);
            vscode.window.showErrorMessage(`Image Metadata Inspector: ${errorMessage}`);
        }
    } else {
        const errorMessage = `Unsupported file type: ${fileExtension}`;
        outputChannel.appendLine(errorMessage);
        vscode.window.showWarningMessage(`Image Metadata Inspector: ${errorMessage}`);
    }
}

class MetadataProvider implements vscode.TextDocumentContentProvider {
    private exifTool: ExifTool | null = null;
    private useNativeExifTool: boolean = false;
    private initializationAttempted: boolean = false;
    private initializationError: string | null = null;

    constructor() {
        this.initializeExifTool();
    }

    private async initializeExifTool() {
        if (this.initializationAttempted) {
            return;
        }
        this.initializationAttempted = true;

        outputChannel.appendLine('Attempting to initialize ExifTool...');
        
        try {
            // Try to initialize with exiftool-vendored first
            this.exifTool = new ExifTool();
            outputChannel.appendLine('ExifTool (vendored) initialized successfully');
            return;
        } catch (error) {
            const vendoredError = `Failed to initialize vendored ExifTool: ${error instanceof Error ? error.message : String(error)}`;
            outputChannel.appendLine(vendoredError);
            console.warn("Debug: " + vendoredError);
            
            // Fall back to native exiftool
            try {
                await execAsync('exiftool -ver');
                this.useNativeExifTool = true;
                outputChannel.appendLine('Native ExifTool found and will be used as fallback');
                return;
            } catch (nativeError) {
                const fallbackError = 'No native ExifTool found either. Extension may not work properly on this platform.';
                outputChannel.appendLine(fallbackError);
                this.initializationError = `Platform compatibility issue: ${vendoredError}. Native ExifTool not available.`;
                
                // Show a one-time platform notification
                this.showPlatformNotification();
            }
        }
    }

    private showPlatformNotification() {
        const platform = os.platform();
        let message = `Image Metadata Inspector may not work on ${platform}. `;
        
        if (platform === 'darwin') {
            message += 'macOS support is being worked on. You can install ExifTool via: brew install exiftool';
        } else if (platform === 'linux') {
            message += 'Linux support is being worked on. You can install ExifTool via your package manager.';
        }

        vscode.window.showWarningMessage(message, 'View Output', 'Dismiss').then(selection => {
            if (selection === 'View Output') {
                outputChannel.show();
            }
        });
    }

    async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
        const fileUri = vscode.Uri.file(uri.path.replace('.metadata', ''));
        const fileName = fileUri.fsPath.split('\\').pop() || fileUri.fsPath.split('/').pop() || 'Unknown';

        // Wait for initialization to complete if it's still ongoing
        if (!this.initializationAttempted) {
            await this.initializeExifTool();
        }

        const platformInfo = `Platform: ${os.platform()} ${os.arch()}\nNode.js: ${process.version}\nVS Code: ${vscode.version}`;

        if (this.initializationError) {
            return `Image Metadata Inspector - Initialization Error\n${'='.repeat(50)}\n\n${this.initializationError}\n\n${platformInfo}\n\nPlease check the Output panel (View > Output > Image Metadata Extension) for detailed error information.\n\nFor support, please visit: https://github.com/Gerkinfeltser/image-metadata-display/issues`;
        }

        try {
            if (this.exifTool && !this.useNativeExifTool) {
                // Use vendored ExifTool
                return await this.getMetadataWithVendored(fileUri, fileName);
            } else if (this.useNativeExifTool) {
                // Use native ExifTool
                return await this.getMetadataWithNative(fileUri, fileName);
            } else {
                throw new Error('No ExifTool available');
            }
        } catch (err) {
            const errorMessage = `Failed to read image metadata for ${fileName}: ${err instanceof Error ? err.message : String(err)}`;
            console.log(`Debug: ${errorMessage}`);
            outputChannel.appendLine(errorMessage);
            return `Error Reading Metadata\n${'='.repeat(50)}\n\n${errorMessage}\n\nFile: ${fileUri.fsPath}\n${platformInfo}\n\nPlease check the Output panel for more details.`;
        }
    }

    private async getMetadataWithVendored(fileUri: vscode.Uri, fileName: string): Promise<string> {
        if (!this.exifTool) throw new Error('Vendored ExifTool not available');
        
        outputChannel.appendLine(`Reading metadata with vendored ExifTool: ${fileUri.fsPath}`);
        const metadata = await this.exifTool.read(fileUri.fsPath);
        outputChannel.appendLine(`Successfully read ${Object.keys(metadata).length} metadata fields using vendored ExifTool`);
        return this.formatMetadata(metadata, fileName, 'Vendored ExifTool');
    }

    private async getMetadataWithNative(fileUri: vscode.Uri, fileName: string): Promise<string> {
        outputChannel.appendLine(`Reading metadata with native ExifTool: ${fileUri.fsPath}`);
        const { stdout } = await execAsync(`exiftool -json "${fileUri.fsPath}"`);
        const metadataArray = JSON.parse(stdout);
        const metadata = metadataArray[0] || {};
        outputChannel.appendLine(`Successfully read ${Object.keys(metadata).length} metadata fields using native ExifTool`);
        return this.formatMetadata(metadata, fileName, 'Native ExifTool');
    }

    private formatMetadata(metadata: any, fileName: string, toolType: string): string {
        const metadataEntries = Object.entries(metadata).map(([key, value]) => {
            let formattedValue = value;
            if (typeof value === 'string' && this.isJsonString(value)) {
                try {
                    formattedValue = `\n${JSON.stringify(JSON.parse(value), null, 2)}`;
                } catch (jsonError) {
                    formattedValue = value;
                }
            }
            return `${key}: ${formattedValue}`;
        });
        
        const header = `Image Metadata for: ${fileName}\nUsing: ${toolType}\nPlatform: ${os.platform()} ${os.arch()}\n${'='.repeat(50)}\n\n`;
        return header + metadataEntries.join('\n');
    }

    private isJsonString(str: string): boolean {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }

    dispose() {
        if (this.exifTool) {
            this.exifTool.end().catch(error => {
                console.error('Error disposing ExifTool:', error);
            });
        }
    }
}

export function deactivate() {
    console.log("Debug: Image Metadata Extension is now deactivated.");
    outputChannel.appendLine('Image Metadata Extension is now deactivated.');
}