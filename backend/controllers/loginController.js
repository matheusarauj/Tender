const login = async ({ res }) => {
	try {
		const { account } = res.locals;
		console.log(account);
		res.status(200).json(account);
	} catch (error) {
		res.json({ message: error });
	}
};

module.exports = {
	login,
};
