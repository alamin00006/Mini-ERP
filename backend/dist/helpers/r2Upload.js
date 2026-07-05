"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromR2 = exports.uploadToR2 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = __importDefault(require("../config"));
const r2Client = new client_s3_1.S3Client({
    region: 'auto',
    endpoint: config_1.default.cloudflare_r2.endpoint,
    credentials: {
        accessKeyId: config_1.default.cloudflare_r2.access_key_id,
        secretAccessKey: config_1.default.cloudflare_r2.secret_access_key,
    },
});
const uploadToR2 = (file_1, ...args_1) => __awaiter(void 0, [file_1, ...args_1], void 0, function* (file, folder = 'products') {
    try {
        const fileName = `${folder}/${Date.now()}-${file.originalname}`;
        const bucketName = config_1.default.cloudflare_r2.bucket_name;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        yield r2Client.send(command);
        const publicUrl = config_1.default.cloudflare_r2.public_url;
        return `${publicUrl}/${fileName}`;
    }
    catch (error) {
        throw new Error(`Failed to upload file to R2: ${error}`);
    }
});
exports.uploadToR2 = uploadToR2;
const deleteFromR2 = (fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicUrl = config_1.default.cloudflare_r2.public_url;
        const fileName = fileUrl.replace(`${publicUrl}/`, '');
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: config_1.default.cloudflare_r2.bucket_name,
            Key: fileName,
        });
        yield r2Client.send(command);
    }
    catch (error) {
        throw new Error(`Failed to delete file from R2: ${error}`);
    }
});
exports.deleteFromR2 = deleteFromR2;
