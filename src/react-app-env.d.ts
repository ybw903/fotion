/// <reference types="react-scripts" />
interface Window {
  api: {
    send(channel: Channels, args: unknown): void;
    receive(
      channel: string,
      func: (args: any) => void
    ): (() => void) | undefined;
  };
}
