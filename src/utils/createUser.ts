// Importing the API client instance configured for user-related API calls.
import apiClientUser from './apiClientUser';

// Importing the types for the request structure and response expected for the createUser endpoint.
import { UserServiceCreateUserRequest, TemplatebackendCreateUserReply } from '../internal/client/index';

/**
 * Function to create a new user with the provided details.
 *
 * @param firstName The first name of the user.
 * @param lastName The last name of the user.
 * @param email The email address of the user.
 * @param password The password for the user's account.
 * @returns The response from the API or undefined in case of an error.
 */
export const createUser = async (firstName: string, lastName: string, email: string, password: string,) => {
    // Creating a request object conforming to the structure expected by the API.
    const user: UserServiceCreateUserRequest = {
        body: {
            firstName: firstName,
            lastName: lastName,
            username: email,
            email: email,
            password: password,
        }
    };

    try {
        // Making an API call to create the user and storing the response.
        const response = await apiClientUser.userServiceCreateUser(user);
        return response; // Returning the response from the API.
    } catch (error) {
        // Logging any errors that occur during the API call.
        console.log("Error creating user:" + error);
    }
};
