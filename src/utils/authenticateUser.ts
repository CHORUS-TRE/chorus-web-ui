// Importing the API client instance configured for authentication-related API calls.
import apiClientAuth from '././apiClientAuthentication';

// Importing the type for the request structure needed for the authenticateUser endpoint.
import { AuthenticationServiceAuthenticateRequest } from '../internal/client/index';

/**
 * Function to authenticate a user with given credentials.
 *
 * @param email The email of the user.
 * @param password The password of the user.
 * @returns The response from the API or undefined in case of an error.
 */
export const authenticateUser = async (email: string, password: string) => {
    // Creating a request object conforming to the structure expected by the API.
    const user: AuthenticationServiceAuthenticateRequest = {
        body: {
            username: email, // Assigning the provided email to the username field.
            password: password, // Assigning the provided password.
        }
    };

    try {
        // Making an API call to authenticate the user and storing the response.
        const response = await apiClientAuth.authenticationServiceAuthenticate(user);
        return response; // Returning the response from the API.
    } catch (error) {
        // Logging any errors that occur during the API call.
        console.log("Error authenticating user:" + error);
    }
};
