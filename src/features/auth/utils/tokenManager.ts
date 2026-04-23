const TOKEN_KEY = "access_token";

export const tokenManager = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${TOKEN_KEY}=`)) {
        return decodeURIComponent(cookie.substring(TOKEN_KEY.length + 1));
      }
    }
    return null;
  },

  set(token: string) {
    if (typeof window === "undefined") return;
    
    // Sets cookie for 7 days, accessible across the whole site
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  },

  remove() {
    if (typeof window === "undefined") return;
    
    // Deletes the cookie by setting max-age to 0
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  }
};