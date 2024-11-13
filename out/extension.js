"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const exiftool_vendored_1 = require("exiftool-vendored");
function activate(context) {
    vscode.window.showInformationMessage('Image Metadata Extension is now active!');
    const metadataProvider = new MetadataProvider();
    const scheme = 'image-metadata'; // Generalized scheme name
    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(scheme, metadataProvider));
    let disposable = vscode.commands.registerCommand('extension.inspectImageMetadata', async (uri) => {
        if (uri) {
            // Open the image using vscode.open
            await vscode.commands.executeCommand('vscode.open', uri, { preview: false, viewColumn: vscode.ViewColumn.One });
            // Show metadata in the second column
            await showMetadata(uri, vscode.ViewColumn.Two);
        }
        else {
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
            }
            else {
                vscode.window.showInformationMessage('No image file was selected.');
            }
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
async function showMetadata(fileUri, viewColumn) {
    vscode.window.showInformationMessage('Showing image metadata...');
    const scheme = 'image-metadata'; // Generalized scheme name
    if (fileUri.fsPath.toLowerCase().endsWith('.png') || fileUri.fsPath.toLowerCase().endsWith('.webp') || fileUri.fsPath.toLowerCase().endsWith('.jpg')) { // Check for JPEG, PNG, and WebP
        const metadataUri = vscode.Uri.parse(`${scheme}:${fileUri.fsPath}.metadata`);
        try {
            const doc = await vscode.workspace.openTextDocument(metadataUri);
            await vscode.window.showTextDocument(doc, { viewColumn: viewColumn, preserveFocus: true });
        }
        catch (e) {
            vscode.window.showErrorMessage("Failed to show image metadata.");
        }
    }
}
class MetadataProvider {
    exifTool = new exiftool_vendored_1.ExifTool();
    async provideTextDocumentContent(uri) {
        const fileUri = vscode.Uri.file(uri.path.replace('.metadata', ''));
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
        }
        catch (err) {
            return `Failed to read the image metadata: ${err.message}`;
        }
    }
    isJsonString(str) {
        try {
            JSON.parse(str);
            return true;
        }
        catch (e) {
            return false;
        }
    }
}
function deactivate() {
    vscode.window.showInformationMessage('Image Metadata Extension is now deactivated.');
    new exiftool_vendored_1.ExifTool().end();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map