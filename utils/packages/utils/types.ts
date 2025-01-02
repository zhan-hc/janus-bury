import { DataSender } from '../bury'

export type Plugin<T> = {
  install(app: any, options: T): void;
};

export type SendType = 'beacon' | 'ajax' | 'img'

export interface OptionType {
  server_url: string,
  send_type?:  SendType,
  ext?: Object,
  method?: 'post' | 'get',
  appName: string,
  appCode?: string,
  userId?: string,
  appVersion?: string,
  monitorRouter?: boolean,
  monitorWhiteScreen?: boolean,
  whiteScreenOptions?: {
    skeletonProject: boolean,
    whiteBoxElements: string[]
  }
  monitorError?: boolean,
  monitorRequest?: boolean,
  monitorReject?: boolean,
  monitorPerformance?: boolean,
  reportInterceptor?: ReportInterceptor

}

export type DataSenderMethodMap = {
  [K in 'track' | 'setPageId']: DataSender[K];
};

export type ReportInterceptor<T = any> = (data: T) => T;