import axios from "axios";
import { Api } from "./api-2-legged";
import { ReadStream } from "fs";
import { Buffer } from "buffer";
import { ClientProps } from "./common";

/**
 * RCDE API Client for 2-legged authentication
 */
class RCDEClient2Legged {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private api: Api<unknown>;
  private headers?: {
    Origin: string;
    "Content-Type": string;
  };
  private token?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  };

  /**
   * Initialize RCDE API Client
   */
  constructor(props: ClientProps) {
    const { domain, baseUrl, clientId, clientSecret } = props;
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.api = new Api({
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
    const tokenRes = await this.api.ext.postExtV2AuthToken(
      {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
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

    const refreshRes = await this.api.ext.postExtV2AuthenticatedRefresh(
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
   * Create Equipment Token
   * @param data equipment token data
   * @returns created equipment token data
   */
  public async createEquipmentToken(
    data: Parameters<
      Api<unknown>["ext"]["postExtV2AuthenticatedEquipmentToken"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.postExtV2AuthenticatedEquipmentToken(data, {
      baseURL: this.baseUrl,
      headers: {
        ...this.headers,
        Authorization: `Bearer ${this.token.accessToken}`,
      },
    });
    return res.data;
  }

  /**
   * Get construction list
   * @returns construction list
   */
  public async getConstructionList() {
    this.isTokenAvailable();

    const res = await this.api.ext.getExtV2AuthenticatedConstructionList({
      baseURL: this.baseUrl,
      headers: {
        ...this.headers,
        Authorization: `Bearer ${this.token.accessToken}`,
      },
    });
    return res.data;
  }

  /**
   * Create construction
   * @param data construction data
   * @returns created construction data
   */
  public async createConstruction(
    data: Omit<
      Parameters<Api<unknown>["ext"]["postExtV2AuthenticatedConstruction"]>[0],
      "period" | "contractedAt"
    > & {
      period: Date;
      contractedAt: Date;
    }
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.postExtV2AuthenticatedConstruction(
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
    constructionId:
      | Parameters<Api<unknown>["ext"]["getExtV2AuthenticatedConstruction"]>[0]
      | number
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.getExtV2AuthenticatedConstruction(
      constructionId,
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
      Api<unknown>["ext"]["putExtV2AuthenticatedConstruction"]
    >[0],
    data: Parameters<
      Api<unknown>["ext"]["putExtV2AuthenticatedConstruction"]
    >[1]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.putExtV2AuthenticatedConstruction(
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
      Api<unknown>["ext"]["deleteExtV2AuthenticatedConstruction"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.deleteExtV2AuthenticatedConstruction(
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
    query: Parameters<
      Api<unknown>["ext"]["getExtV2AuthenticatedContractList"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.getExtV2AuthenticatedContractList(query, {
      baseURL: this.baseUrl,
      headers: {
        ...this.headers,
        Authorization: `Bearer ${this.token.accessToken}`,
      },
    });
    return res.data;
  }

  /**
   * Create contract
   * @param data contract data
   * @returns created contract data
   */
  public async createContract(
    data: Omit<
      Parameters<Api<unknown>["ext"]["postExtV2AuthenticatedContract"]>[0],
      "contractedAt"
    > & {
      contractedAt: Date;
    }
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.postExtV2AuthenticatedContract(
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
    contractId: Parameters<
      Api<unknown>["ext"]["getExtV2AuthenticatedContract"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.getExtV2AuthenticatedContract(contractId, {
      baseURL: this.baseUrl,
      headers: {
        ...this.headers,
        Authorization: `Bearer ${this.token.accessToken}`,
      },
    });
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
      Api<unknown>["ext"]["putExtV2AuthenticatedContract"]
    >[0],
    data: Parameters<Api<unknown>["ext"]["putExtV2AuthenticatedContract"]>[1]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.putExtV2AuthenticatedContract(
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
      Api<unknown>["ext"]["deleteExtV2AuthenticatedContract"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.deleteExtV2AuthenticatedContract(
      contractId,
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
   * Get contract file list
   * @param query
   * @returns contract file list
   */
  public async getContractFileList(
    query: Parameters<
      Api<unknown>["ext"]["getExtV2AuthenticatedContractFileList"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.getExtV2AuthenticatedContractFileList(
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
   * Get metadata for contract file
   * @param query
   * @returns metadata for contract file
   */
  public async getContractFileMetadata(
    query: Parameters<Api<unknown>["ext"]["getExtV2AuthenticatedPclodMeta"]>[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.getExtV2AuthenticatedPclodMeta(query, {
      baseURL: this.baseUrl,
      headers: {
        ...this.headers,
        Authorization: `Bearer ${this.token.accessToken}`,
      },
    });
    return res.data;
  }

  /**
   * Get image position for contract file
   * @param query
   * @returns image position for contract file
   */
  public async getContractFileImagePosition(
    query: Parameters<
      Api<unknown>["ext"]["getExtV2AuthenticatedPclodImagePosition"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.getExtV2AuthenticatedPclodImagePosition(
      query,
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.token.accessToken}`,
        },
        format: "arraybuffer",
      }
    );
    return res.data;
  }

  /**
   * Get image color for contract file
   * @param query
   * @returns image color for contract file
   */
  public async getContractFileImageColor(
    query: Parameters<
      Api<unknown>["ext"]["getExtV2AuthenticatedPclodImageColor"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.getExtV2AuthenticatedPclodImageColor(query, {
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
   * Get signed URL for uploading point cloud file
   * @param data contract file data
   * @returns signed URL for uploading point cloud file
   */
  private async createContractFileUploadUrl(
    data: Parameters<
      Api<unknown>["ext"]["postExtV2AuthenticatedContractFilePointCloud"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.postExtV2AuthenticatedContractFilePointCloud(
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
   * Complete contract file upload
   * @param contractFileId contract file ID
   * @param data contract file data
   * @returns completed contract file data
   */
  private async completeContractFileUpload(
    contractFileId: Parameters<
      Api<unknown>["ext"]["putExtV2AuthenticatedContractFileUploaded"]
    >[0],
    data: Parameters<
      Api<unknown>["ext"]["putExtV2AuthenticatedContractFileUploaded"]
    >[1]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.putExtV2AuthenticatedContractFileUploaded(
      contractFileId,
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
   * @param data point cloud file data
   * @returns uploaded point cloud file data
   */
  public async uploadContractFile(
    data: Omit<
      Parameters<
        Api<unknown>["ext"]["postExtV2AuthenticatedContractFilePointCloud"]
      >[0],
      "size"
    > & {
      buffer: Buffer | ReadStream;
      size?: number;
    }
  ) {
    const { buffer, size: _size, ...rest } = data;

    let size = _size ?? 0;
    if (buffer instanceof Buffer || buffer instanceof ArrayBuffer) {
      size = buffer.byteLength;
    }

    if (size === 0) {
      throw new Error("size field is required if input buffer is ReadStream");
    }

    const { contractFileId, presignedURL } =
      await this.createContractFileUploadUrl({
        ...rest,
        size,
      });

    // upload buffer via axios
    await axios.put(presignedURL, buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": size.toString(),
      },
    });

    return await this.completeContractFileUpload(contractFileId, {
      contractId: rest.contractId,
    });
  }

  /**
   * Get download URL for contract file
   * @param contractId contract ID
   * @param contractFileId contract file ID
   * @returns download URL for contract file
   */
  public async getContractFileDownloadUrl(
    contractId: Parameters<
      Api<unknown>["ext"]["getExtV2AuthenticatedContractFileDownloadUrl"]
    >[1]["contractId"],
    contractFileId: Parameters<
      Api<unknown>["ext"]["getExtV2AuthenticatedContractFileDownloadUrl"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.getExtV2AuthenticatedContractFileDownloadUrl(
      contractFileId,
      {
        contractId,
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
    contractId: Parameters<
      Api<unknown>["ext"]["getExtV2AuthenticatedContractFileProcessingStatus"]
    >[1]["contractId"],
    contractFileId: Parameters<
      Api<unknown>["ext"]["getExtV2AuthenticatedContractFileProcessingStatus"]
    >[0]
  ) {
    this.isTokenAvailable();

    const res =
      await this.api.ext.getExtV2AuthenticatedContractFileProcessingStatus(
        contractFileId,
        {
          contractId,
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
}

export { RCDEClient2Legged };
