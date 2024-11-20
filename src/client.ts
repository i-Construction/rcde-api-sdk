import axios from "axios";
import { Api } from "./api";

class RCDEClient {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private api: Api<unknown>;
  private headers: {
    Origin: string;
    "Content-Type": string;
  };
  private token?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  };

  constructor(props: {
    domain: string;
    baseUrl: string;
    clientId: string;
    clientSecret: string;
  }) {
    const { domain, baseUrl, clientId, clientSecret } = props;
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.api = new Api();
    this.headers = {
      Origin: domain,
      "Content-Type": "application/json",
    };
  }

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

  private isTokenAvailable() {
    if (!this.token) {
      throw new Error("Token is not available");
    }
  }

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

  public async getConstruction(
    constructionId:
      | Parameters<Api<unknown>["ext"]["getExtV2AuthenticatedConstruction"]>[0]
      | number
  ) {
    this.isTokenAvailable();

    const res = await this.api.ext.getExtV2AuthenticatedConstruction(
      constructionId.toString(),
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

  private async createPointCloudUploadUrl(
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

  private async completePointCloudUpload(
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

  public async uploadPointCloud(
    data: Omit<
      Parameters<
        Api<unknown>["ext"]["postExtV2AuthenticatedContractFilePointCloud"]
      >[0],
      "size"
    > & {
      buffer: Buffer;
    }
  ) {
    const { buffer, ...rest } = data;
    const size = buffer.byteLength;
    const { contractFileId, presignedURL } =
      await this.createPointCloudUploadUrl({
        ...rest,
        size,
      });

    // upload buffer via axios
    await axios.put(presignedURL, buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    return await this.completePointCloudUpload(contractFileId, {
      contractId: rest.contractId,
    });
  }
}

export { RCDEClient };
