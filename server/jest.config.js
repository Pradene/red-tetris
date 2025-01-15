module.exports = {
	rootDir: __dirname,
	preset: 'ts-jest',
	testEnvironment: 'node',  // You can change to 'jsdom' if you want to run browser-related tests
	testPathIgnorePatterns: ["/node_modules", "/dist"],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', {
			tsconfig: 'tsconfig.json',
			diagnostics: false,
		}],
	},
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
	moduleNameMapper: {
		"^@shared/(.*)$": "<rootDir>/../shared/$1"
	},
};