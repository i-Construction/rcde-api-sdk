/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PointCloudAttribute {
  no?: string;
  time?: string;
  method?: string;
  equipment?: string;
  person?: string;
  crs?: string;
}

/**
 * error
 * 正常終了以外の返却値
 */
export interface Errors {
  /**
   * `code={HTTPステータスコード}, message={R-CDEエラーコード}: {エラー内容}`
   *
   * R-CDEエラーコード | 内容
   * ---------|----------
   *  ERR0100001 | 認可情報取得エラー
   *  ERR0100002 | 認可エラー
   *  ERR0201001 | 入力パラメータエラー
   *  ERR0201002 | 企業アプリケーション情報不正
   *  ERR0301001 | 企業アプリケーション情報取得エラー
   *  ERR0301002 | トークン作成者不正
   *  ERR0301003 | アクセストークン生成エラー
   *  ERR0301004 | リフレッシュトークン生成エラー
   *  ERR0202001 | 入力パラメータエラー
   *  ERR0202002 | 企業アプリケーション情報不正
   *  ERR0302001 | 無効なServiceHUBトークンエラー
   *  ERR0103001 | 企業アプリケーション情報不正
   *  ERR0103002 | オリジン不正
   *  ERR0103003 | tokenの種類不正
   *  ERR0103004 | 発行者不正
   *  ERR0103005 | 企業アプリケーションID不正
   *  ERR0103006 | 企業アプリケーション情報取得エラー
   *  ERR0103007 | トークン作成者不正
   *  ERR0103008 | CORSポリシー適用エラー
   *  ERR0103009 | token有効期限切れ
   *  ERR0103010 | token検証エラー（有効期限切れ以外）
   *  ERR0203001 | 入力パラメータエラー
   *  ERR0203002 | 企業アプリケーション情報不正
   *  ERR0303001 | 無効なServiceHUBトークンエラー
   *  ERR0303002 | 無効なSkydioトークンエラー
   *  ERR0303003 | 該当するフライトデータが無い
   *  ERR0303004 | 該当する画像データが無い
   *  ERR0204001 | 入力パラメータエラー
   *  ERR0204002 | 企業アプリケーション情報不正
   *  ERR0304001 | 無効なServiceHUBトークンエラー
   *  ERR0205001 | 入力パラメータエラー
   *  ERR0205002 | 企業アプリケーション情報不正
   *  ERR0206001 | 入力パラメータエラー
   *  ERR0206002 | 企業アプリケーション情報不正
   *  ERR0305001 | 発注者と受注者が同一エラー
   *  ERR0305002 | 現場の発注者が契約項目の受注者として指定された時のエラー
   *  ERR0103011 | 入力パラメータ不正
   *  ERR0207001 | 入力パラメータエラー
   *  ERR0207002 | 企業アプリケーション情報不正
   *  ERR0207003 | カテゴリー不正
   *  ERR0207004 | S3操作不正
   */
  errors?: string[];
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "https://api.rcde.jp" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title rcde for external
 * @version 2.0.0
 * @baseUrl https://api.rcde.jp
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  ext = {
    /**
     * @description アクセストークン、リフレッシュトークン生成
     *
     * @name PostExtV2AuthToken
     * @summary Create Token
     * @request POST:/ext/v2/auth/token
     */
    postExtV2AuthToken: (
      data: {
        /** 企業管理画面にて払い出された値 */
        clientId: string;
        /** 企業管理画面にて払い出された値 */
        clientSecret: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          accessToken?: string;
          refreshToken?: string;
          expiresAt?: number;
        },
        Errors
      >({
        path: `/ext/v2/auth/token`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description アクセストークン、リフレッシュトークンの再生成
     *
     * @name PostExtV2AuthenticatedRefresh
     * @summary Refresh Token
     * @request POST:/ext/v2/authenticated/refresh
     */
    postExtV2AuthenticatedRefresh: (
      data: {
        /** 企業管理画面にて払い出された値 */
        clientId: string;
        /** 企業管理画面にて払い出された値 */
        clientSecret: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          accessToken?: string;
          refreshToken?: string;
          expiresAt?: number;
        },
        Errors
      >({
        path: `/ext/v2/authenticated/refresh`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description pub用のトークンを作成
     *
     * @name PostExtV2AuthenticatedEquipmentToken
     * @summary Create Equipment Token
     * @request POST:/ext/v2/authenticated/equipmentToken
     */
    postExtV2AuthenticatedEquipmentToken: (
      data: {
        /** 契約項目ID */
        contractId: number;
        /**
         * 有効期限種別
         *
         * 有効期限 | 設定値
         * ---------|----------
         *  1時間 | 1
         *  12時間 | 2
         *  1日 | 3
         *  3日 | 4
         *  1週間 | 5
         *  1ヶ月 | 6
         *  3ヶ月 | 7
         *  半年 | 8
         *  1年 | 9
         *  永久 | 99
         */
        expirationType: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** トークンID */
          id?: number;
          /** トークン */
          token?: string;
          /**
           * 有効期限
           * @format date-time
           */
          expiresAt?: string;
          /** ステータス */
          isExpired?: boolean;
        },
        Errors
      >({
        path: `/ext/v2/authenticated/equipmentToken`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 現場一覧取得
     *
     * @name GetExtV2AuthenticatedConstructionList
     * @summary Get Construction List
     * @request GET:/ext/v2/authenticated/construction
     */
    getExtV2AuthenticatedConstructionList: (params: RequestParams = {}) =>
      this.request<
        {
          /** 現場総数 */
          total?: number;
          /** 現場一覧 */
          constructions?: {
            /** 現場ID */
            id?: number;
            /** 工事名称 */
            name?: string;
            /** 住所 */
            address?: string;
            /**
             * 契約日
             * @format date-time
             */
            contractedAt?: string;
            /**
             * 完成期日
             * @format date-time
             */
            period?: string;
            /** 前払い金額率 */
            advancePaymentRate?: number;
            /** 請負金額 */
            contractAmount?: number;
          }[];
        },
        Errors
      >({
        path: `/ext/v2/authenticated/construction`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 現場作成
     *
     * @name PostExtV2AuthenticatedConstruction
     * @summary Create Construction
     * @request POST:/ext/v2/authenticated/construction
     */
    postExtV2AuthenticatedConstruction: (
      data: {
        /** 工事名称 */
        name: string;
        /** 住所 */
        address: string;
        /**
         * 契約日
         * @format date-time
         */
        contractedAt: string;
        /**
         * 完成期日
         * @format date-time
         */
        period: string;
        /** 前払い金額率 */
        advancePaymentRate: number;
        /** 請負金額 */
        contractAmount: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** 現場ID */
          id?: number;
          /** 工事名称 */
          name?: string;
          /** 住所 */
          address?: string;
          /**
           * 契約日
           * @format date-time
           */
          contractedAt?: string;
          /**
           * 完成期日
           * @format date-time
           */
          period?: string;
          /** 前払い金額率 */
          advancePaymentRate?: number;
          /** 請負金額 */
          contractAmount?: number;
        },
        Errors
      >({
        path: `/ext/v2/authenticated/construction`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 現場詳細取得
     *
     * @name GetExtV2AuthenticatedConstruction
     * @summary Get Construction
     * @request GET:/ext/v2/authenticated/construction/{constructionId}
     */
    getExtV2AuthenticatedConstruction: (constructionId: number, params: RequestParams = {}) =>
      this.request<
        {
          /** 現場ID */
          id?: number;
          /** 工事名称 */
          name?: string;
          /** 住所 */
          address?: string;
          /**
           * 契約日
           * @format date-time
           */
          contractedAt?: string;
          /**
           * 完成期日
           * @format date-time
           */
          period?: string;
          /** 前払い金額率 */
          advancePaymentRate?: number;
          /** 請負金額 */
          contractAmount?: number;
        },
        Errors
      >({
        path: `/ext/v2/authenticated/construction/${constructionId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 現場編集
     *
     * @name PutExtV2AuthenticatedConstruction
     * @summary Update Construction
     * @request PUT:/ext/v2/authenticated/construction/{constructionId}
     */
    putExtV2AuthenticatedConstruction: (
      constructionId: number,
      data: {
        /** 工事名称 */
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** 現場ID */
          id?: number;
          /** 工事名称 */
          name?: string;
          /** 住所 */
          address?: string;
          /**
           * 契約日
           * @format date-time
           */
          contractedAt?: string;
          /**
           * 完成期日
           * @format date-time
           */
          period?: string;
          /** 前払い金額率 */
          advancePaymentRate?: number;
          /** 請負金額 */
          contractAmount?: number;
        },
        Errors
      >({
        path: `/ext/v2/authenticated/construction/${constructionId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 現場削除
     *
     * @name DeleteExtV2AuthenticatedConstruction
     * @summary Delete Construction
     * @request DELETE:/ext/v2/authenticated/construction/{constructionId}
     */
    deleteExtV2AuthenticatedConstruction: (constructionId: number, data: any, params: RequestParams = {}) =>
      this.request<void, Errors>({
        path: `/ext/v2/authenticated/construction/${constructionId}`,
        method: "DELETE",
        body: data,
        ...params,
      }),

    /**
     * @description 契約項目一覧取得
     *
     * @name GetExtV2AuthenticatedContractList
     * @summary Get Contract List
     * @request GET:/ext/v2/authenticated/contract
     */
    getExtV2AuthenticatedContractList: (
      query?: {
        /** 現場ID */
        constructionId?: number;
        /** 「createdAt」は作成日、「accessedAt」はアクセス日時の降順。「name」は契約項目名の昇順 */
        sort?: string;
        /** 現在のページ番号。perPageも設定すること */
        currentPage?: number;
        /** 1ページの表示数。currentPareも設定すること */
        perPage?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** 契約項目総数 */
          total?: number;
          /** 契約項目一覧 */
          contracts?: {
            /** 契約項目ID */
            id?: number;
            /** 契約項目名 */
            name?: string;
            /** 契約単価 */
            unitPrice?: number;
            /** 契約数量 */
            unitVolume?: number;
            /**
             * 契約日
             * @format date-time
             */
            contractedAt?: string;
            /**
             * 作成日
             * @format date-time
             */
            createdAt?: string;
            /**
             * 契約項目ステータス
             * 「２：作成済み」が返却される
             */
            status?: number;
          }[];
        },
        Errors
      >({
        path: `/ext/v2/authenticated/contract`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description 契約項目作成
     *
     * @name PostExtV2AuthenticatedContract
     * @summary Create Contract
     * @request POST:/ext/v2/authenticated/contract
     */
    postExtV2AuthenticatedContract: (
      data: {
        /** 契約項目名 */
        name: string;
        /**
         * 契約日
         * @format date-time
         */
        contractedAt: string;
        /** 契約単価 */
        unitPrice: number;
        /** 契約数量 */
        unitVolume: number;
        /** 現場ID */
        constructionId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** 契約項目ID */
          id?: number;
          /** 契約項目名 */
          name?: string;
          /** 契約単価 */
          unitPrice?: number;
          /** 契約数量 */
          unitVolume?: number;
          /**
           * 契約日
           * @format date-time
           */
          contractedAt?: string;
          /**
           * 契約項目ステータス
           * 「２：作成済み」が返却される
           */
          status?: number;
        },
        Errors
      >({
        path: `/ext/v2/authenticated/contract`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 契約項目詳細取得
     *
     * @name GetExtV2AuthenticatedContract
     * @summary Get Contract
     * @request GET:/ext/v2/authenticated/contract/{contractId}
     */
    getExtV2AuthenticatedContract: (contractId: number, params: RequestParams = {}) =>
      this.request<
        {
          /** 契約項目ID */
          id?: number;
          /** 契約項目名 */
          name?: string;
          /** 契約単価 */
          unitPrice?: number;
          /** 契約数量 */
          unitVolume?: number;
          /**
           * 契約日
           * @format date-time
           */
          contractedAt?: string;
          /**
           * 作成日
           * @format date-time
           */
          createdAt?: string;
          /**
           * 契約項目ステータス
           * 「２：作成済み」が返却される
           */
          status?: number;
        },
        Errors
      >({
        path: `/ext/v2/authenticated/contract/${contractId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 契約項目編集
     *
     * @name PutExtV2AuthenticatedContract
     * @summary Update Contract
     * @request PUT:/ext/v2/authenticated/contract/{contractId}
     */
    putExtV2AuthenticatedContract: (
      contractId: number,
      data: {
        /** 契約項目名 */
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** 契約項目ID */
          id?: number;
          /** 契約項目名 */
          name?: string;
          /** 契約単価 */
          unitPrice?: number;
          /** 契約数量 */
          unitVolume?: number;
          /**
           * 契約日
           * @format date-time
           */
          contractedAt?: string;
          /**
           * 作成日
           * @format date-time
           */
          createdAt?: string;
          /**
           * 契約項目ステータス
           * 「２：作成済み」が返却される
           */
          status?: number;
        },
        Errors
      >({
        path: `/ext/v2/authenticated/contract/${contractId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 契約項目削除
     *
     * @name DeleteExtV2AuthenticatedContract
     * @summary Delete Contract
     * @request DELETE:/ext/v2/authenticated/contract/{contractId}
     */
    deleteExtV2AuthenticatedContract: (contractId: number, data: any, params: RequestParams = {}) =>
      this.request<void, Errors>({
        path: `/ext/v2/authenticated/contract/${contractId}`,
        method: "DELETE",
        body: data,
        ...params,
      }),

    /**
     * @description 契約項目ファイル一覧取得
     *
     * @name GetExtV2AuthenticatedContractFileList
     * @summary Get Contract File List
     * @request GET:/ext/v2/authenticated/contractFile
     */
    getExtV2AuthenticatedContractFileList: (
      query: {
        /** 契約項目ID */
        contractId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** 契約項目ファイル総数 */
          total?: number;
          contractFiles?: {
            /** 契約項目ファイルID */
            id?: number;
            /** ファイル名 */
            name?: string;
            /**
             * 種別コード
             * - 設計情報: 1
             * -  施工管理（点群データ）: 2
             * - ヒートマップ: 3
             * - IFC: 4
             * - Slope: 5
             * - Trimmed Point Cloud: 6
             * - Generated Heat Map: 7
             * - Generated Slope Angle: 8
             * - Liner Information: 9
             * - 吹付: 10
             * - 覆工: 11
             * - 評価: 12
             * - DXF: 13
             * - OBJ: 14
             * - STL: 15
             * - RVT: 16
             */
            category?: number;
            /**
             * ステータス
             * - WIP: 1
             * - Shared: 2
             * - 技術検査済み: 3
             * - 給付検査済み: 4
             */
            status?: number;
            /**
             * ファイルの整合姓
             * - 未チェック: 1
             * - 正: 2
             * - 否: 3
             */
            fileCheckStatus?: number;
            /** 作成日 */
            createdAt?: string;
            /** 更新日 */
            updatedAt?: string;
            /** アップロード日 */
            uploadedAt?: string;
            file?: {
              /** ファイルID */
              id?: number;
              /** ファイルサイズ */
              size?: number;
              /** ファイル名 */
              name?: string;
            };
            contract?: {
              /** 契約項目ID */
              id?: number;
              /** 契約項目名 */
              name?: string;
              /** 契約単価 */
              unitPrice?: number;
              /** 契約数量 */
              unitVolume?: number;
              /** 契約日 */
              contractedAt?: string;
              /** 作成日 */
              createdAt?: string;
              /**
               * 契約項目ステータス
               * 「２：作成済み」が返却される
               */
              status?: number;
            };
            batchProcessingResult?: {
              /** バッチ処理結果ID */
              id?: number;
              /**
               * ステータス
               * - 開始: 1
               * - 進行中: 2
               * - 完了: 3
               */
              status?: number;
            };
          }[];
        },
        void
      >({
        path: `/ext/v2/authenticated/contractFile`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description 点群アップロード
     *
     * @name PostExtV2AuthenticatedContractFilePointCloud
     * @summary Upload Point Cloud
     * @request POST:/ext/v2/authenticated/contractFile/pointCloud
     */
    postExtV2AuthenticatedContractFilePointCloud: (
      data: {
        /** 契約項目ID */
        contractId: number;
        /** ファイル名 */
        name: string;
        /** ファイルサイズ */
        size: number;
        pointCloudAttribute?: PointCloudAttribute;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** 署名付きURL */
          presignedURL?: string;
          /** 契約項目ファイルID */
          contractFileId?: number;
        },
        Errors
      >({
        path: `/ext/v2/authenticated/contractFile/pointCloud`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ファイルアップロード完了API
     *
     * @name PutExtV2AuthenticatedContractFileUploaded
     * @summary Complete Contract File Upload
     * @request PUT:/ext/v2/authenticated/contractFile/uploaded/{contractFileId}
     */
    putExtV2AuthenticatedContractFileUploaded: (
      contractFileId: number,
      data: {
        /** 契約項目ID */
        contractId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** 契約項目ファイルID */
          id?: number;
          /** ファイル名 */
          name?: string;
          /**
           * 種別コード
           * - 設計情報: 1
           * -  施工管理（点群データ）: 2
           * - ヒートマップ: 3
           * - IFC: 4
           * - Slope: 5
           * - Trimmed Point Cloud: 6
           * - Generated Heat Map: 7
           * - Generated Slope Angle: 8
           * - Liner Information: 9
           * - 吹付: 10
           * - 覆工: 11
           * - 評価: 12
           * - DXF: 13
           * - OBJ: 14
           * - STL: 15
           * - RVT: 16
           */
          category?: number;
          /**
           * ステータス
           * - WIP: 1
           * - Shared: 2
           * - 技術検査済み: 3
           * - 給付検査済み: 4
           */
          status?: number;
          /**
           * ファイルの整合姓
           * - 未チェック: 1
           * - 正: 2
           * - 否: 3
           */
          fileCheckStatus?: number;
          /** 作成日 */
          createdAt?: string;
          /** 更新日 */
          updatedAt?: string;
          /** アップロード日 */
          uploadedAt?: string;
        },
        Errors
      >({
        path: `/ext/v2/authenticated/contractFile/uploaded/${contractFileId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description ファイルダウンロードURL取得
     *
     * @name GetExtV2AuthenticatedContractFileDownloadUrl
     * @summary Download Contract File
     * @request GET:/ext/v2/authenticated/contractFile/downloadURL/{contractFileId}
     */
    getExtV2AuthenticatedContractFileDownloadUrl: (
      contractFileId: number,
      query: {
        /** 契約項目ID */
        contractId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** 署名付きURL */
          presignedURL?: string;
        },
        Errors
      >({
        path: `/ext/v2/authenticated/contractFile/downloadURL/${contractFileId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description 処理ステータス取得
     *
     * @name GetExtV2AuthenticatedContractFileProcessingStatus
     * @summary Get Processing Status
     * @request GET:/ext/v2/authenticated/contractFile/processingStatus/{contractFileId}
     */
    getExtV2AuthenticatedContractFileProcessingStatus: (
      contractFileId: number,
      query: {
        /** 契約項目ID */
        contractId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * 処理ステータス
           * - pending: 保留中
           * - completed: 完了
           */
          status?: string;
        },
        Errors
      >({
        path: `/ext/v2/authenticated/contractFile/processingStatus/${contractFileId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description meta取得
     *
     * @name GetExtV2AuthenticatedPclodMeta
     * @summary Get Pclod Meta
     * @request GET:/ext/v2/authenticated/pclod/meta
     */
    getExtV2AuthenticatedPclodMeta: (
      query: {
        /** 契約項目ID */
        contractId: number;
        /** 契約項目ファイルID */
        contractFileId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<File, Errors>({
        path: `/ext/v2/authenticated/pclod/meta`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description imagePosition取得
     *
     * @name GetExtV2AuthenticatedPclodImagePosition
     * @summary Get Pclod Image Position
     * @request GET:/ext/v2/authenticated/pclod/imagePosition
     */
    getExtV2AuthenticatedPclodImagePosition: (
      query: {
        /** 契約項目ID */
        contractId: number;
        /** 契約項目ファイルID */
        contractFileId: number;
        /** the level of detail */
        level: number;
        /** the coordinate of the unit in whole LOD octree */
        addr: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ArrayBuffer, Errors>({
        path: `/ext/v2/authenticated/pclod/imagePosition`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description imageColor取得
     *
     * @name GetExtV2AuthenticatedPclodImageColor
     * @summary Get Pclod Image Color
     * @request GET:/ext/v2/authenticated/pclod/imageColor
     */
    getExtV2AuthenticatedPclodImageColor: (
      query: {
        /** 契約項目ID */
        contractId: number;
        /** 契約項目ファイルID */
        contractFileId: number;
        /** the level of detail */
        level: number;
        /** the coordinate of the unit in whole LOD octree */
        addr: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ArrayBuffer, Errors>({
        path: `/ext/v2/authenticated/pclod/imageColor`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
}
