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
      {
        constructionId,
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
}

export { RCDEClient };
