import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ["atriana.test", "api.atriana.test", "localhost:3000"],
        },
    },
    
    allowedDevOrigins: ["atriana.test", "api.atriana.test", "*.atriana.test"],
};

export default withNextIntl(nextConfig);
