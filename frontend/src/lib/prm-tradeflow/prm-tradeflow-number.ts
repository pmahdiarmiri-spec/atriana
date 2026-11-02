import { PrmExactValue, PrmMetricType } from "./prm-tradeflow-types";

const PRM_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function prmFormatExact(value: PrmExactValue | null | undefined): string {
    if (value === null || value === undefined) return "—";

    const raw = String(value);
    const match = /^([+−-]?)(\d+)(?:\.(\d+))?$/.exec(raw);

    if (!match) return raw;

    const integer = match[2].replace(/\B(?=(\d{3})+(?!\d))/g, "٬");
    const decimal = match[3] === undefined ? "" : `٫${match[3]}`;

    return `${match[1]}${integer}${decimal}`.replace(/\d/g, digit => PRM_DIGITS[Number(digit)]);
}

export function prmExactDifference(
    current: PrmExactValue,
    previous: PrmExactValue | undefined
): string {
    if (previous === undefined) return "—";

    const first = /^(-?)(\d+)(?:\.(\d+))?$/.exec(String(current));
    const second = /^(-?)(\d+)(?:\.(\d+))?$/.exec(String(previous));

    if (!first || !second) return "—";

    const scale = Math.max(first[3]?.length ?? 0, second[3]?.length ?? 0);
    const toInteger = (parts: RegExpExecArray): bigint => {
        const digits = parts[2] + (parts[3] ?? "").padEnd(scale, "0");
        const amount = BigInt(digits);
        return parts[1] === "-" ? -amount : amount;
    };

    const difference = toInteger(first) - toInteger(second);
    const sign = difference < 0n ? "−" : difference > 0n ? "+" : "";
    const absolute = (difference < 0n ? -difference : difference).toString().padStart(scale + 1, "0");

    if (scale === 0) return prmFormatExact(`${sign}${absolute}`);

    return prmFormatExact(
        `${sign}${absolute.slice(0, -scale)}.${absolute.slice(-scale)}`
    );
}

export function prmMetricLabel(metric: PrmMetricType): string {
    if (metric === "rial") return "ارزش ریالی (ریال)";
    if (metric === "weight") return "وزن (کیلوگرم)";
    return "ارزش دلاری (دلار)";
}
