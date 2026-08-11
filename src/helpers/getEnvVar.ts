export function requireEnv(name: string): string {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

export function requireEnvArray(name: string): string[] {
    const value = JSON.parse(requireEnv(name));

    if (!Array.isArray(value) || 
        value.some(val => typeof val !== "string" || !val.trim()) 
    ) {
        throw new Error("Environment Variable must be a JSON array of non-empty strings");
    }

    return value;
}