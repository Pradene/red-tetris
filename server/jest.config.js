module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',  // You can change to 'jsdom' if you want to run browser-related tests
    transform: {
      '^.+\\.tsx?$': ['ts-jest', {
          tsconfig: 'tsconfig.json',
          diagnostics: false,
      }],
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  };