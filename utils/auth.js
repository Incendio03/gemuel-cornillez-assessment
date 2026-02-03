/**
 * Authentication Utility for SauceDemo
 *
 * This module provides programmatic authentication by injecting session state
 * directly into the browser context, bypassing the UI login flow.
 *
 * How it works:
 * 1. SauceDemo stores authentication state in a cookie named "session-username"
 * 2. We inject this cookie directly into the browser context before navigating to protected pages
 * 3. The application recognizes the user as authenticated without going through the login UI
 *
 */

export async function injectSession(page, username = "standard_user") {
  // SauceDemo uses a cookie named "session-username" for authentication
  // Inject the session cookie directly into the browser context
  await page.context().addCookies([
    {
      name: "session-username",
      value: username,
      domain: "www.saucedemo.com",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  // Session is now active - can navigate directly to /inventory.html
}

export async function clearSession(page) {
  await page.context().clearCookies();
}

// Validates that a user is currently authenticated
export async function getSessionUser(page) {
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((c) => c.name === "session-username");
  return sessionCookie?.value || null;
}
