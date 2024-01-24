import apiClientAuth from '././apiClientAuthentication';
import { AuthenticationServiceAuthenticateRequest } from '../src/internal/client/index'


export const authenticateUser = async (email: string, password: string) => {
    const user: AuthenticationServiceAuthenticateRequest = {
        body: {
            username: email,
            password: password,
        }
    }
    try {
        const response = await apiClientAuth.authenticationServiceAuthenticate(user);
        return response;
    } catch (error) {
        console.log("Error authenticating user:" + error);
        // throw new Error("Error authenticating user:" + error);

    }
};
