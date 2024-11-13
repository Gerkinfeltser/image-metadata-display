import * as vscode from 'vscode';
import { ExifTool } from 'exiftool-vendored';

const outputChannel = vscode.window.createOutputChannel('Image Metadata Extension');

export function activate(context: vscode.ExtensionContext) {
    console.log("Debug: Image Metadata Extension is now active.");
    outputChannel.appendLine('Image Metadata Extension is now active!');

    const metadataProvider = new MetadataProvider();
    const scheme = 'image-metadata';
    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(scheme, metadataProvider));

    let disposable = vscode.commands.registerCommand('extension.inspectImageMetadata', async (uri: vscode.Uri | undefined) => {
        console.log("Debug: Inspect Image Metadata command executed.");
        outputChannel.appendLine("Inspect Image Metadata command executed.");

        if (uri) {
            // Open the image using vscode.open
            await vscode.commands.executeCommand('vscode.open', uri, { preview: false, viewColumn: vscode.ViewColumn.One });
            // Show metadata in the second column
            await showMetadata(uri, vscode.ViewColumn.Two);
        } else {
            const fileUris = await vscode.window.showOpenDialog({
                canSelectMany: false,
                openLabel: 'Open',
                filters: { 'Images': ['png', 'webp', 'jpg'] }
            });

            if (fileUris && fileUris.length > 0) {
                await vscode.commands.executeCommand('vscode.open', fileUris[0], { preview: false, viewColumn: vscode.ViewColumn.One });
                await showMetadata(fileUris[0], vscode.ViewColumn.Two);
            } else {
                console.log("Debug: No image file was selected.");
                outputChannel.appendLine('No image file was selected.');
            }
        }
    });

    context.subscriptions.push(disposable);
}

async function showMetadata(fileUri: vscode.Uri, viewColumn: vscode.ViewColumn) {
    const fileName = fileUri.fsPath.split('\\').pop() || fileUri.fsPath.split('/').pop() || 'Unknown';
    console.log(`Debug: Showing image metadata for ${fileName}`);
    outputChannel.appendLine(`Showing image metadata for ${fileName}...`);

    const scheme = 'image-metadata';
    if (fileUri.fsPath.toLowerCase().endsWith('.png') || fileUri.fsPath.toLowerCase().endsWith('.webp') || fileUri.fsPath.toLowerCase().endsWith('.jpg')) {
        const metadataUri = vscode.Uri.parse(`${scheme}:${fileUri.fsPath}.metadata`);
        try {
            const doc = await vscode.workspace.openTextDocument(metadataUri);
            await vscode.window.showTextDocument(doc, { viewColumn: viewColumn, preserveFocus: true });
        } catch (e) {
            console.log(`Debug: Failed to show image metadata for ${fileName}`);
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
            console.log(`Debug: Failed to read the image metadata for ${fileName}`);
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
    console.log("Debug: Image Metadata Extension is now deactivated.");
    outputChannel.appendLine('Image Metadata Extension is now deactivated.');
    new ExifTool().end();
}
