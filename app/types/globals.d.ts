// app/types/globals.d.ts
interface Turnstile {
  render: (
    selector: string | HTMLElement,
    options: {
      sitekey: string;
      callback?: (token: string) => void;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "compact" | "invisible";
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
    }
  ) => string | undefined;
}

interface Window {
  turnstile?: Turnstile;
}
