import { ApiResponse } from 'src/types/response';
import { FileType } from '../../../../../libs/file/src/lib/domain/file';

// ========================== Upload File ====================================
export type UploadFilePayload = File;
export type UploadFileResponse = { file: FileType };

// ========================== Upload Files ====================================
export type UploadFilesPayload = File[];
export type UploadFilesResponse = ApiResponse<FileType[]>;
