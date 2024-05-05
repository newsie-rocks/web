/**
 * @module auth
 *
 * User management & authentication
 */

import { todo } from './util';

/**
 * User type
 */
export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

/**
 * New user type
 */
export interface NewUser {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

/**
 * Authentication service
 */
export class AuthService {
	/**
	 * Auth token
	 */
	private token: string | null = null;

	/**
	 * Create a user
	 */
	async signup(newUser: NewUser): Promise<User> {
		if (this.token) {
			throw new Error('User already signed in');
		}

		// signup by checking that the email is not already in use
		todo('signup');
	}

	/**
	 * Login a user
	 */
	async login(email: string, password: string): Promise<User> {
		todo('login');
	}

	/**
	 * Logout a user
	 */
	async logout(): Promise<void> {
		this.token = null;
		todo('logout');
	}

	/**
	 * Delete the current user
	 */
	async delete(): Promise<void> {
		todo('delete');
	}
}
