export default function emailChecker(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email !== '' && email.match(emailRegex)) {
        const domain = email.split('@')[1];
        if (domain && domain.match(domainRegex)) {
            return true;
        }
    }
    return false;
}