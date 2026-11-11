export type PrmMeetingSession = {
  meeting: {
    id: number;
    name: string;
    code: string;
    is_owner: boolean;
  };
  identity: string;
  token: string;
  server_url: string;
};

type PrmMeetingRequestOptions = {
  accessToken: string;
  body?: Record<string, string>;
};

export async function prmMeetingRequest<T>(
  path: string,
  options: PrmMeetingRequestOptions
): Promise<T> {
  if (!options.accessToken) {
    throw new Error("برای ورود به جلسه ابتدا وارد حساب خود شوید.");
  }

  const base = (process.env.NEXT_PUBLIC_API_URL ?? "http://api.atriana.test/api").replace(/\/+$/, "");
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(`${base}/prm/meetings${normalizedPath}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${options.accessToken}`,
    },
    body: JSON.stringify(options.body ?? {}),
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const result: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : "درخواست جلسه انجام نشد.";

    throw new Error(message);
  }

  return result as T;
}
