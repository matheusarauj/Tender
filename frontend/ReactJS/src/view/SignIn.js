import React, { useState } from 'react';

import { Container, ContentContainer, FormContainer, SubmitButton } from './styles/Auth';

import WarnError from '../utils/Errors/warnError';

import { EmailInput, PasswordInput } from '../components/General/Inputs';
import api from '../services/api';

import Notificate from '../utils/Notification';

const INITIAL_DATA = {
	email: '',
	password: '',
	loading: false,
	showPassword: false,
};

const Login = () => {
	const [data, setData] = useState(INITIAL_DATA);

	const [isLoading, setIsLoading] = useState(false);

	const handleInput = (element) => {
		const { name, value } = element.target;
		setData({ ...data, [name]: value });
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true);

		const { email, password } = data;

		try {
			if (!email) throw new WarnError('Insert your register email.');
			if (!password) throw new WarnError('Insert yor password.');
			if (password.length < 6) throw new WarnError('Your password has at least 6 characters.');

			const body = {
				email,
				password,
			};

			const response = await api.post('/auth', body);
			const { token, user } = response.data;

			localStorage.setItem('@Tender:token', token);
			localStorage.setItem('@Tender:user', JSON.stringify(user));

			await Notificate(`Welcome again, ${user.username}.`, 'success');

			window.location.reload();
		} catch (err) {
			setIsLoading(false);

			if (err instanceof WarnError) Notificate(err.message, 'warn');
			else {
				const error = err.response.data.message;
				Notificate(`An error occured during login: ${error}`, 'error');
			}
		}
	};

	return (
		<Container>
			<ContentContainer>
				<FormContainer>
					<h1>Welcome again!</h1>

					<form onSubmit={onSubmit}>
						<EmailInput email={data.email} handleChange={handleInput} />
						<PasswordInput password={data.password} handleChange={handleInput} />

						<SubmitButton type="submit" isLoading={isLoading} disabled={isLoading}>
							SIGN IN
						</SubmitButton>
					</form>
				</FormContainer>
			</ContentContainer>
		</Container>
	);
};

export default Login;
