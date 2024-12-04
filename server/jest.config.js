module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',  // You can change to 'jsdom' if you want to run browser-related tests
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Tells Jest to use ts-jest for .ts and .tsx files
    },
    globals: {
      'ts-jest': {
        isolatedModules: true, // Optional: improves performance by disabling type-checking (you can enable it if needed)
      },
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  };