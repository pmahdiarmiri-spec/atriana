import {NextRequest, NextResponse} from "next/server";

const messages = {
  fa: "API \u0622\u062a\u0631\u06cc\u0627\u0646\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06cc\u062a \u0641\u0639\u0627\u0644 \u0627\u0633\u062a",
  en: "ATRIANA API is fully operational"
} as const;

type Locale = keyof typeof messages;

function resolveLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers
    .get("accept-language")
    ?.trim()
    .toLowerCase();

  if (acceptLanguage?.startsWith("en")) {
    return "en";
  }

  return "fa";
}

export function GET(request: NextRequest) {
  const locale = resolveLocale(request);

  const body = JSON.stringify({
    status: "success",
    message: messages[locale],
    timestamp: new Date().toISOString(),
    locale
  });

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}