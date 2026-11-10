import PrmAdminAdChats from "@/components/prm-admin/ad-chats/prm-admin-ad-chats";

interface PrmAdminAdChatsPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function PrmAdminAdChatsPage({
    params,
}: PrmAdminAdChatsPageProps) {
    const { locale } = await params;

    return <PrmAdminAdChats locale={locale} />;
}
