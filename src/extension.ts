import * as vscode from 'vscode';
import { ExifTool } from 'exiftool-vendored';

const outputChannel = vscode.window.createOutputChannel('Image Metadata Extension');

export function activate(context: vscode.ExtensionContext) {
    outputChannel.appendLine('Image Metadata Extension is now active!');
    const metadataProvider = new MetadataProvider();
    const scheme = 'image-metadata'; // Generalized scheme name
    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(scheme, metadataProvider));

    let disposable = vscode.commands.registerCommand('extension.inspectImageMetadata', async (uri: vscode.Uri | undefined) => {
        if (uri) {
            // Open the image using vscode.open
            await vscode.commands.executeCommand('vscode.open', uri, { preview: false, viewColumn: vscode.ViewColumn.One });
            // Show metadata in the second column
            await showMetadata(uri, vscode.ViewColumn.Two);
        } else {
            // Command Palette execution: Ask the user to select an image file
            const fileUris = await vscode.window.showOpenDialog({
                canSelectMany: false,
                openLabel: 'Open',
                filters: { 'Images': ['png', 'webp', 'jpg'] } // Allow JPEG, PNG, and WebP files
            });

            if (fileUris && fileUris.length > 0) {
                // Open the image using vscode.open
                await vscode.commands.executeCommand('vscode.open', fileUris[0], { preview: false, viewColumn: vscode.ViewColumn.One });
                // Show metadata in the second column
                await showMetadata(fileUris[0], vscode.ViewColumn.Two);
            } else {
                outputChannel.appendLine('No image file was selected.');
            }
        }
    });

    context.subscriptions.push(disposable);
}

async function showMetadata(fileUri: vscode.Uri, viewColumn: vscode.ViewColumn) {
    const fileName = fileUri.fsPath.split('\\').pop() || fileUri.fsPath.split('/').pop() || 'Unknown';
    outputChannel.appendLine(`Showing image metadata for ${fileName}...`);
    const scheme = 'image-metadata'; // Generalized scheme name
    if (fileUri.fsPath.toLowerCase().endsWith('.png') || fileUri.fsPath.toLowerCase().endsWith('.webp') || fileUri.fsPath.toLowerCase().endsWith('.jpg')) { // Check for JPEG, PNG, and WebP
        const metadataUri = vscode.Uri.parse(`${scheme}:${fileUri.fsPath}.metadata`);
        try {
            const doc = await vscode.workspace.openTextDocument(metadataUri);
            await vscode.window.showTextDocument(doc, { viewColumn: viewColumn, preserveFocus: true });
        } catch (e) {
            outputChannel.appendLine(`Failed to show image metadata for ${fileName}.`);
        }
    }
}

class MetadataProvider implements vscode.TextDocumentContentProvider {
    private readonly exifTool = new ExifTool();

    async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
        const fileUri = vscode.Uri.file(uri.path.replace('.metadata', ''));
        const fileName = fileUri.fsPath.split('\\').pop() || fileUri.fsPath.split('/').pop() || 'Unknown';

        try {
            const metadata = await this.exifTool.read(fileUri.fsPath);
            const metadataEntries = Object.entries(metadata).map(([key, value]) => {
                let formattedValue = value;
                if (typeof value === 'string' && this.isJsonString(value)) {
                    formattedValue = `\n${JSON.stringify(JSON.parse(value), null, 2)}`;
                }
                return `${key}: ${formattedValue}`;
            });
            return metadataEntries.join('\n');
        } catch (err) {
            outputChannel.appendLine(`Failed to read the image metadata for ${fileName}: ${(err as Error).message}`);
            return `Failed to read the image metadata for ${fileName}: ${(err as Error).message}`;
        }
    }

    private isJsonString(str: string): boolean {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }
}

export function deactivate() {
    outputChannel.appendLine('Image Metadata Extension is now deactivated.');
    new ExifTool().end();
}
