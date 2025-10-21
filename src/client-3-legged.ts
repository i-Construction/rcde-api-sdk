import axios from "axios";
import { Api as Api3Legged } from "./api-3-legged";
import { ReadStream } from "fs";
import { Buffer } from "buffer";
import { ClientProps } from "./common";
import { Chunkable, chunkedUpload, getTotalSize } from "./chunk-uploader";

type Api = Api3Legged<unknown>;

type ClientProps3Legged = {
  /** 初回の認可コード（後から authenticate() でも可） */
  authCode: string;
} & ClientProps;

type Token = {
  accessToken: string;
  refreshToken: string;
  /** 有効期限（秒 since epoch） */
  expiresAt: number;
};

/**
 * RCDE API Client (3-legged)
 * - リフレッシュ: A方式（POST /ext/v2/oauth/token + grant_type=refresh_token）
 * - 自動リフレッシュ内蔵（期限の60秒前で更新）
 * - トークン永続化は利用側（setToken/getToken で入出力）
 */
class RCDEClient3Legged {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private api: Api;
  private headers: {
    Origin: string;
    "Content-Type": "application/json";
  };
  private token?: Token;

  constructor(props: ClientProps3Legged) {
    const { baseUrl, clientId, clientSecret, domain } = props;
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.api = new Api3Legged({ withCredentials: true });
    this.headers = {
      Origin: domain ?? "",
      "Content-Type": "application/json",
    };
  }

  /**
   * トークンの外部セット/取得（永続化は利用側）
   */
  public setToken(token: Token) {
    this.token = token;
  }

  public getToken(): Token {
    this.isTokenAvailable();
    // 破壊的変更を避けるためコピーを返す
    return { ...(this.token as Token) };
  }

  /**
   * 初回の認可コードからアクセストークンを取得
   */
  public async authenticate(authCode: string): Promise<void> {
    const body = {
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      grantType: "authorization_code",
      authCode,
    };
    const res = await axios.post(`${this.baseUrl}/ext/v2/oauth/token`, body, {
      headers: this.headers,
    });

    const { accessToken, refreshToken, expiresAt } = res.data ?? {};
    if (!accessToken || !refreshToken || !expiresAt) {
      throw new Error("Invalid token response for authorization_code");
    }
    this.token = { accessToken, refreshToken, expiresAt };
  }

  /**
   * ===== リフレッシュ & 自動化の内部ロジック =====
   */
  private needsRefresh(skewSec = 60): boolean {
    if (!this.token?.expiresAt) return false;
    const now = Math.floor(Date.now() / 1000);
    return this.token.expiresAt - now <= skewSec;
  }

  public async refreshToken(): Promise<void> {
    this.isTokenAvailable();
    if (!this.token?.refreshToken) throw new Error("No refresh token");
  
    const refreshRes = await this.api.ext["postExt3LeggedV2OauthToken"](
      {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        grantType: "refresh_token",
        refreshToken: this.token.refreshToken,
      },
      {
        baseURL: this.baseUrl,
        headers: {
          ...this.headers,
          Origin: this.headers.Origin,
        },
      }
    );
  
    const { accessToken, refreshToken, expiresAt } = refreshRes.data ?? {};
    if (!accessToken || !refreshToken || !expiresAt) {
      throw new Error("Invalid token response for refresh_token");
    }
  
    this.token = { accessToken, refreshToken, expiresAt };
  }

  private async ensureValidAccessToken(): Promise<string> {
    if (this.needsRefresh()) {
      await this.refreshToken();
    }
    if (!this.token?.accessToken) {
      throw new Error("No access token");
    }
    return this.token.accessToken;
  }

  /** Authorization を付与したヘッダを返す（自動リフレ適用済み） */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const at = await this.ensureValidAccessToken();
    return { ...this.headers, Authorization: `Bearer ${at}` };
  }

  /**
   * トークン有無のチェック（公開API冒頭で使用）
   */
  private isTokenAvailable() {
    if (!this.token) {
      throw new Error("Token is not available");
    }
  }

  /**
   * ===== 既存の公開API（例） =====
   * 既存の axios 呼び出しは Authorization 付与を
   *   headers: await this.getAuthHeaders()
   * に差し替えるだけで自動リフレッシュ対応になります。
   */


  public async getContractFileProcessingStatus(contractFileId: number) {
    this.isTokenAvailable();
    const headers = await this.getAuthHeaders();
    const res = await this.api.ext[
      "getExt3LeggedV2AuthenticatedContractFileProcessingStatus"
    ](contractFileId, {
      baseURL: this.baseUrl,
      headers,
    });
    return res.data;
  }

  public async uploadContractFileMultipart(params: {
    contractId: number;
    file: Chunkable | File | ReadStream | Buffer;
    filename: string;
    chunkSize?: number; // bytes
    onProgress?: (uploaded: number, total: number) => void;
  }) {
    this.isTokenAvailable();
    const headers = await this.getAuthHeaders();

    // 1) 初期化
    const init = await this.api.ext[
      "postExt3LeggedV2AuthenticatedContractFileMultipartInit"
    ](
      {
        contractId: params.contractId,
        filename: params.filename,
        size: getTotalSize(params.file as any),
      },
      { baseURL: this.baseUrl, headers }
    );

    const { uploadId, partSize, presignedUrls } = init.data as any;

    // 2) 分割アップロード
    await chunkedUpload({
      file: params.file as any,
      chunkSize: params.chunkSize ?? partSize ?? 5 * 1024 * 1024,
      presignedUrls,
      onProgress: params.onProgress,
    });

    // 3) 完了通知
    const done = await this.api.ext[
      "postExt3LeggedV2AuthenticatedContractFileMultipartComplete"
    ]({ uploadId }, { baseURL: this.baseUrl, headers });

    return done.data;
  }
}

export { RCDEClient3Legged, type ClientProps3Legged, type Token };
