// Persist signup context across page refreshes during signup flow
export const signupStorage = {
  setSignupContext: (email: string, password: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "signup_context",
        JSON.stringify({ email, password, timestamp: Date.now() })
      );
    }
  },

  getSignupContext: () => {
    if (typeof window === "undefined") return null;

    const data = sessionStorage.getItem("signup_context");
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);
      // Clear if older than 30 minutes
      if (Date.now() - parsed.timestamp > 30 * 60 * 1000) {
        signupStorage.clearSignupContext();
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },

  clearSignupContext: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("signup_context");
    }
  },
};