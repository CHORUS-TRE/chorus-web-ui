import apiClientUser from './apiClientUser';
import { UserServiceCreateUserRequest, TemplatebackendUser, TemplatebackendCreateUserReply } from '../src/internal/client/index'


export const createUser = async (firstName: string, lastName: string, email: string, password: string,) => {
    const user: UserServiceCreateUserRequest = {
        body: {
            firstName: firstName,
            lastName: lastName,
            username: email,
            email: email,
            password: password,
        }
    }
    try {
        const response = await apiClientUser.userServiceCreateUser(user);
        return response;
    } catch (error) {
        //throw new Error("Error creating user:" + error);
        console.log("Error creating user:" + error);
    }
};
