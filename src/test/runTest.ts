import * as path from 'path';

import { runTests } from '@vscode/test-electron';

async function main(): Promise<void> {
	const extensionDevelopmentPath = path.resolve(__dirname, '../..');
	const extensionTestsPath = path.resolve(__dirname, './extension.test');

	await runTests({
		extensionDevelopmentPath,
		extensionTestsPath,
	});
}

main().catch((error: unknown) => {
	console.error('Failed to run extension tests:', error);
	process.exit(1);
});
