import { ExifToolTask } from "./ExifToolTask";
export declare class VersionTask extends ExifToolTask<string> {
    private static readonly versionRegex;
    constructor();
    protected parse(input: string): string;
}
