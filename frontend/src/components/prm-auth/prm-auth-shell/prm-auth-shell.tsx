import { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface PrmAuthShellProps {
    children: ReactNode;
}

export function PrmAuthShell({ children }: PrmAuthShellProps): ReactNode {
    const t = useTranslations("auth");

    return (
        <section className="prm-auth-shell">
            <div className="prm-auth-orb prm-auth-orb-primary" />
            <div className="prm-auth-orb prm-auth-orb-secondary" />
            <div className="prm-auth-orb prm-auth-orb-accent" />
            <div className="prm-auth-grid" />
            <div className="prm-auth-card">
                <div className="prm-auth-card-reflection" />
                <div className="prm-auth-brand">
                    <div className="prm-auth-brand-mark">
                        <span>A</span>
                    </div>
                    <div className="prm-auth-brand-content">
                        <strong>ATRIANA</strong>
                        <span>{t("brandTagline")}</span>
                    </div>
                </div>
                {children}
            </div>
        </section>
    );
}
