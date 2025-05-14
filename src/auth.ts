import bcrypt from 'bcrypt';
export async function hashPassword(password: string): Promise<string> {
    const minPasswordLength = 6;
    if (password.length < minPasswordLength){
        throw new Error(`Password too short. Minimum length: ${minPasswordLength}`); 
    }
    const saltRounds = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}