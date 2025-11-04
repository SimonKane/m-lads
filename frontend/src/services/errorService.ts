export async function fetchRandomError(): Promise<any> {
    const res = await fetch('http://localhost:3000/errors/random-error', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    const text = await res.text();
    let parsed: any;
    try {
        parsed = JSON.parse(text);
    } catch {
        parsed = text;
    }

    if (!res.ok) {
        throw { status: res.status, body: parsed };
    }

    return parsed;
}