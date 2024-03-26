import { ExifToolTask } from "./ExifToolTask";
export declare class RewriteAllTagsTask extends ExifToolTask<void> {
    private constructor();
    static for(imgSrc: string, imgDest: string, allowMakerNoteRepair: boolean): RewriteAllTagsTask;
    parse(data: string, error?: Error): void;
}
