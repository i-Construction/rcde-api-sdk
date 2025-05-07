import axios from "axios";
import { Api as Api3Legged } from "./api-3-legged";
import { ReadStream } from "fs";
import { Buffer } from "buffer";
import { ClientProps } from "./common";
import { Chunkable, chunkedUpload, getTotalSize } from "./chunk-uploader";

type Api = Api3Legged<unknown>;

type ClientProps3Legged = {
  authCode: string;
} & ClientProps;

/**
 * RCDE API Client
 */
class RCDEClient3Legged {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private api: Api;
  private headers?: {
    Origin: string;
    "Content-Type": string;
  };
  private token?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  };

  private authCode: string;

  /**
   * Initialize RCDE API Client
   */
  constructor(props: ClientProps3Legged) {
    const { domain, baseUrl, clientId, clientSecret, authCode } = props;
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.authCode = authCode;

    this.api = new Api3Legged({
      withCredentials: true,
    });

    if (domain !== undefined) {
      this.headers = {
        Origin: domain,
        "Content-Type": "application/json",
      };
    }
  }

  /**
   * Authenticate with RCDE API
   * This method should be called before calling other methods
   */
  public async authenticate() {
    const tokenRes = await this.api.ext.postExt3LeggedV2AuthToken(
      {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        authCode: this.authCode,
      },
      {
        baseURL: this.baseUrl,
        headers: this.headers,
      }
    );
    this.token = tokenRes.data;
  }

  /**
   * Check if token is available
   */
  private isTokenAvailable() {
    if (!this.token) {
      throw new Error("Token is not available");
    }
  }

  /**
   * Refresh token if it's expired
   */
  public async refreshToken() {
    this.isTokenAvailable();

    const refreshRes = await this.api.ext[
      "postExt3LeggedV2AuthenticatedRefresh"
    ](
      {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      },
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.token.refreshToken}`,
        },
      }
    );
    this.token = refreshRes.data;
  }

  /**
   * Get construction list
   * @returns construction list
   */
  public async getConstructionList(
    query?: Parameters<
      Api["ext"]["getExt3LeggedV2AuthenticatedConstructionList"]
    >[0]
  ) {
    this.isTokenAvailable();

    const params = {
      baseURL: this.baseUrl,
      headers: {
        ...this.headers,
        Authorization: `Bearer ${this.token.accessToken}`,
      },
    };

    const res = await this.api.ext[
      "getExt3LeggedV2AuthenticatedConstructionList"
    ](query, params);
    return res.data;
  }

  /**
   * Create construction
   * @param data construction data
   * @returns created construction data
   */
  public async createConstruction(
    data: Omit<
      Parameters<Api["ext"]["postExt3LeggedV2AuthenticatedConstruction"]>[0],
      "period" | "contractedAt"
    > & {
      period: Date;
      contractedAt: Date;
    }
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext["postExt3LeggedV2AuthenticatedConstruction"](
      {
        ...data,
        period: data.period.toISOString(),
        contractedAt: data.contractedAt.toISOString(),
      },
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      }
    );
    return res.data;
  }

  /**
   * Get construction
   * @param constructionId construction ID
   * @returns construction data
   */
  public async getConstruction(
    constructionId: Parameters<
      Api["ext"]["getExt3LeggedV2AuthenticatedConstruction"]
    >[0],
    query?: Parameters<
      Api["ext"]["getExt3LeggedV2AuthenticatedConstruction"]
    >[1]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext["getExt3LeggedV2AuthenticatedConstruction"](
      constructionId,
      query,
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      }
    );
    return res.data;
  }

  /**
   * Update construction
   * @param constructionId construction ID
   * @param data construction data
   * @returns updated construction data
   */
  public async updateConstruction(
    constructionId: Parameters<
      Api["ext"]["putExt3LeggedV2AuthenticatedConstruction"]
    >[0],
    data: Parameters<Api["ext"]["putExt3LeggedV2AuthenticatedConstruction"]>[1]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext["putExt3LeggedV2AuthenticatedConstruction"](
      constructionId,
      data,
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      }
    );
    return res.data;
  }

  /**
   * Delete construction
   * @param constructionId construction ID
   * @returns deleted construction data
   */
  public async deleteConstruction(
    constructionId: Parameters<
      Api["ext"]["deleteExt3LeggedV2AuthenticatedConstruction"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext[
      "deleteExt3LeggedV2AuthenticatedConstruction"
    ](
      constructionId,
      {},
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      }
    );
    return res.data;
  }

  /**
   * Get contract list
   * @param query query parameters
   * @returns contract list
   */
  public async getContractList(
    query: Parameters<Api["ext"]["getExt3LeggedV2AuthenticatedContractList"]>[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext["getExt3LeggedV2AuthenticatedContractList"](
      query,
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      }
    );
    return res.data;
  }

  /**
   * Create contract
   * @param data contract data
   * @returns created contract data
   */
  public async createContract(
    data: Omit<
      Parameters<Api["ext"]["postExt3LeggedV2AuthenticatedContract"]>[0],
      "contractedAt"
    > & {
      contractedAt: Date;
    }
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext["postExt3LeggedV2AuthenticatedContract"](
      {
        ...data,
        contractedAt: data.contractedAt.toISOString(),
      },
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      }
    );
    return res.data;
  }

  /**
   * Get contract
   * @param contractId contract ID
   * @returns contract data
   */
  public async getContract(
    query?: Parameters<Api["ext"]["getExt3LeggedV2AuthenticatedContract"]>[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext["getExt3LeggedV2AuthenticatedContract"](
      query,
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      }
    );
    return res.data;
  }

  /**
   * Update contract
   * @param contractId contract ID
   * @param data contract data
   * @returns updated contract data
   */
  public async updateContract(
    contractId: Parameters<
      Api["ext"]["putExt3LeggedV2AuthenticatedContract"]
    >[0],
    data: Parameters<Api["ext"]["putExt3LeggedV2AuthenticatedContract"]>[1]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext["putExt3LeggedV2AuthenticatedContract"](
      contractId,
      data,
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      }
    );
    return res.data;
  }

  /**
   * Delete contract
   * @param contractId contract ID
   * @returns deleted contract data
   */
  public async deleteContract(
    contractId: Parameters<
      Api["ext"]["deleteExt3LeggedV2AuthenticatedContract"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext["deleteExt3LeggedV2AuthenticatedContract"](
      contractId,
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      }
    );
    return res.data;
  }

  /**
   * Approve contract
   * @param contractId contract ID
   * @returns approved contract data
   */
  public async approveContract(
    contractId: Parameters<Api["ext"]["putExt3LeggedV2AuthenticatedContractApproved"]>[0]
  ) {
    this.isTokenAvailable();
    
    const res = await this.api.ext["postExt3LeggedV2AuthenticatedContractApprove"](
      contractId,
      {},
      {
        baseURL: this.baseUrl,
      }
    );
    return res.data;
  }

  /**
   * Get contract file list
   * @param query
   * @returns contract file list
   */
  public async getContractFileList(
    query: Parameters<
      Api["ext"]["getExt3LeggedV2AuthenticatedContractFileList"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext[
      "getExt3LeggedV2AuthenticatedContractFileList"
    ](query, {
      baseURL: this.baseUrl,
      headers: {
        ...this.headers,
        Authorization: `Bearer ${this.token.accessToken}`,
      },
    });
    return res.data;
  }

  /**
   * Get metadata for contract file
   * @param query
   * @returns metadata for contract file
   */
  public async getContractFileMetadata(
    query: Parameters<Api["ext"]["getExt3LeggedV2AuthenticatedPclodMeta"]>[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext["getExt3LeggedV2AuthenticatedPclodMeta"](
      query,
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      }
    );
    return res.data;
  }

  /**
   * Get image position for contract file
   * @param query
   * @returns image position for contract file
   */
  public async getContractFileImagePosition(
    query: Parameters<
      Api["ext"]["getExt3LeggedV2AuthenticatedPclodImagePosition"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext[
      "getExt3LeggedV2AuthenticatedPclodImagePosition"
    ](query, {
      baseURL: this.baseUrl,
      headers: {
        ...this.headers,
        Authorization: `Bearer ${this.token.accessToken}`,
      },
      format: "arraybuffer",
    });
    return res.data;
  }

  /**
   * Get image color for contract file
   * @param query
   * @returns image color for contract file
   */
  public async getContractFileImageColor(
    query: Parameters<
      Api["ext"]["getExt3LeggedV2AuthenticatedPclodImageColor"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext[
      "getExt3LeggedV2AuthenticatedPclodImageColor"
    ](query, {
      baseURL: this.baseUrl,
      headers: {
        ...this.headers,
        Authorization: `Bearer ${this.token.accessToken}`,
      },
      format: "arraybuffer",
    });
    return res.data;
  }

  /**
   * Complete contract file upload
   * @param contractId contract file ID
   * @param data contract file data
   * @returns completed contract file data
   */
  private async completeContractFileUpload(
    contractId: Parameters<
      Api["ext"]["putExt3LeggedV2AuthenticatedContract"]
    >[0],
    data: Parameters<Api["ext"]["putExt3LeggedV2AuthenticatedContract"]>[1]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext["putExt3LeggedV2AuthenticatedContract"](
      contractId,
      data,
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      }
    );
    return res.data;
  }

    /**
   * Upload point cloud file
   * 受注者しかアップロードができない仕様 (受注者としてログインしたときに返却されるauth codeを認証時に指定する)
   * @param data point cloud file data
   * @returns uploaded point cloud file data
   */
    public async uploadContractFile(
      data: Omit<
        Parameters<
          Api["ext"]["postExt3LeggedV2AuthenticatedContractFilePointCloudMultipartUpload"]
        >[0],
        "size" | "partTotal"
      > & {
        buffer: Chunkable;
        chunkSize?: number; // default 5MB
      }
    ) {
      const { buffer, chunkSize = 5 * 1024 * 1024, ...rest } = data;

      // クライアント側のアップロード可能なファイル容量制限を元に、ファイルを分割し、
      // その分割数をpartTotalとしてpostExt3LeggedV2AuthenticatedContractFilePointCloudMultipartUploadにPOST
      // 返ってきたpresignedUploadParts分、presignedUploadParts内のpresignedURLにアップロード
      // 返ってきたblockChainUploadURLs分、blockChainUploadURLs内のURLにアップロード
      const totalSize = await getTotalSize(buffer);
      const partTotal = Math.ceil(totalSize / chunkSize);

      const {
        data: {
          s3UploadId,
          presignedUploadParts,
          blockChainUploadId,
          blockChainUploadURLs,
          contractFileId
        }
      } = await this.api.ext["postExt3LeggedV2AuthenticatedContractFilePointCloudMultipartUpload"](
        {
          ...rest,
          size: totalSize,
          partTotal,
        },
        {
          baseURL: this.baseUrl,
          headers: {
            ...this.headers,
            Authorization: `Bearer ${this.token.accessToken}`,
          },
        }
      );

      if (presignedUploadParts.length !== blockChainUploadURLs.length) {
        throw new Error("presignedUploadParts and blockChainUploadURLs length mismatch");
      }

      console.log(partTotal, presignedUploadParts.length, blockChainUploadURLs.length);
  
      throw new Error("not implemented");

      /*
      // upload buffer via axios
      await axios.put(presignedURL, buffer, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Length": size.toString(),
        },
      });
      */

     }

  /**
   * Get download URL for contract file
   * @param contractId contract ID
   * @param contractFileId contract file ID
   * @returns download URL for contract file
   */
  public async getContractFileDownloadUrl(
    contractFileId: Parameters<
      Api["ext"]["getExt3LeggedV2AuthenticatedContractFileDownloadUrl"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext[
      "getExt3LeggedV2AuthenticatedContractFileDownloadUrl"
    ](contractFileId, 
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      }
    );
    return res.data;
  }

  /**
   * Get contract file processing status
   * @param contractId contract ID
   * @param contractFileId contract file ID
   * @returns contract file processing status
   * status:
   * - WIP: 1
   * - Shared: 2
   * - 技術検査済み: 3
   * - 給付検査済み: 4
   */
  public async getContractFileProcessingStatus(
    contractFileId: Parameters<
      Api["ext"]["getExt3LeggedV2AuthenticatedContractFileProcessingStatus"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext[
      "getExt3LeggedV2AuthenticatedContractFileProcessingStatus"
    ](contractFileId, {
      baseURL: this.baseUrl,
      headers: {
        ...this.headers,
        Authorization: `Bearer ${this.token.accessToken}`,
      },
    });
    return res.data;
  }
}

export { RCDEClient3Legged };
