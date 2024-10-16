declare module '@brightcove/player-loader' {
    interface PlayerLoaderOptions {
      accountId: string;
      playerId: string;
      videoId?: string;
      refNode?: HTMLElement;
      [key: string]: any;
    }
  
  
    function brightcovePlayerLoader(options: PlayerLoaderOptions): Promise<PlayerSuccess>;
  
    export = brightcovePlayerLoader;
  }