import Axios from 'axios';
import { makeLambdaRequest } from './query-services/lambda.query-service';

const DEFAULT_BUCKET_NAME = 'email-parser-processing';
const VALID_FILENAME_REGEX = /[\w.\-/!:#?=&%,@()]+/g;

export default class S3Bucket {
  files;
  bucketName;
  queryClient;
  user;
  tenant;

  constructor(bucketName, { queryClient, user, tenant }) {
    this.files = [];
    this.bucketName = bucketName || DEFAULT_BUCKET_NAME;
    this.queryClient = queryClient;
    this.user = user;
    this.tenant = tenant;
  }

  async uploadFile(file, { fileKey, fileName } = {}) {
    if (!file) {
      throw new Error('File is required');
    }

    if (!fileKey) {
      fileKey = this.getFileKey(file);
    }

    if (!fileName) {
      fileName = file.name;
    }

    this.files.push({ file, fileKey, fileName });

    const presignedUrl = await this.makePresignedUrlRequest(fileKey, file);
    await this.makeFileUploadRequest(file, fileKey, presignedUrl);

    return fileKey;
  }

  resetState() {
    this.files = [];
  }

  async queueDocumentParsing() {
    if (!this.files.length) {
      throw new Error('Files have to be uploaded first');
    }

    const res = await this.makeDocumentParserRequest(this.files, this.user, this.tenant);
    this.resetState();
    return res;
  }

  /**
   * Generates a sanitized S3 file key for the given file, cleaning the filename using the VALID_FILENAME_REGEX
   * @param {File} file - The file object to generate the key for
   * @returns {string} The sanitized S3 file key
   */
  getFileKey(file) {
    const originalName = file.name;
    const matches = originalName.match(VALID_FILENAME_REGEX);
    const cleanedName = matches ? matches.join('') : 'file';
    return `${this.tenant?.id}/${Date.now()}_${cleanedName}`;
  }

  // --- http calls ---

  async makeFileUploadRequest(file, fileKey, url) {
    const makeRequest = async () => {
      return Axios({
        method: 'PUT',
        url,
        data: file,
        headers: { 'Content-Type': file.type }
      }).then((res) => res.data);
    };

    const res = await makeRequest();
    this.queryClient.setQueryData(['s3', fileKey, 'upload'], { file, url });

    return res;
  }

  async makePresignedUrlRequest(fileKey, file) {
    const method = 'POST';
    const endpoint = 'general/s3-presigned-url';
    const data = {
      command: 'put',
      bucket: this.bucketName,
      file_name: fileKey,
      file_type: file.type
    };

    const res = await makeLambdaRequest({
      method,
      endpoint,
      data
    });
    this.queryClient.setQueryData(['s3', fileKey, 'presigned-url'], res.url);

    return res.url;
  }

  async makeDocumentParserRequest(files, user, tenant) {
    const eventToSend = {
      files: files.map((file) => ({ path: file.fileKey, fileName: file.fileName })),
      person: {
        name: user.name,
        email: user.email
      },
      tenant,
      generate_card: true,
      upload_type: 'document'
    };

    const method = 'POST';
    const endpoint = 'document-parser';
    const data = eventToSend;

    const res = await makeLambdaRequest({
      method,
      endpoint,
      data
    });

    for (const file of files) {
      this.queryClient.setQueryData(['s3', file.fileKey, 'document-parser'], res);
    }

    return res;
  }
}
