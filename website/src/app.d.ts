// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

declare module 'virtual:pwa-info' {
  export interface PwaInfo {
    pwaInDevEnvironment: boolean;
    webManifest: {
      href: string;
      useCredentials: boolean;
      linkTag: string;
    };
    webManifestData: Record;
    registerSW: {
      inline: boolean;
      inlinePath: string;
      registerPath: string;
      scope: string;
      type: 'classic' | 'module';
      scriptTag: string;
    };
  }

  export const pwaInfo: PwaInfo | undefined;
}

declare module 'virtual:pwa-register/svelte' {
  import type { Writable } from 'svelte/store';

  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
    onRegisterError?: (error: any) => void;
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Writable;
    offlineReady: Writable;
    updateServiceWorker: (reloadPage?: boolean) => Promise;
  };
}

export { };
