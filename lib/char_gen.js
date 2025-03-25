
function random_char() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let x = chars.charAt(Math.floor(Math.random() * chars.length));
    return x;
}

export function palindrome_line(n) {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789                     ";

    const mid = Math.floor(n / 2) - 1;
    const index = Array.from({ length: n }, (_, i) =>
        i <= mid ? i : n - i - 1
    );

    return index.map((i) => chars.charAt(i % chars.length)).join("");
}
