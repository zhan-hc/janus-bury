interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  MODE: 'development' | 'production';
}