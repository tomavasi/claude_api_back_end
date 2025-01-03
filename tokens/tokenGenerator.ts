import jwt from 'jsonwebtoken';

class TokenGenerator {

    generateAccessToken(email: string) {
        return jwt.sign({ payload: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    }

    generateRefreshToken(email: string) {
        return jwt.sign({ payload: email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    }

    verifyToken(token: string, secret: string): { err: any | null, decoded: { payload: string } | null } {
        let result = { err: null, decoded: null };
        jwt.verify(token, secret, (err: any, decoded: any) => {
            if (err) {
                result.err = err;
            } else {
                result.decoded = decoded;
            }
        });
        return result;
    }


}

export default new TokenGenerator();