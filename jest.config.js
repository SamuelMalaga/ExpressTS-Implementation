module.exports = {
    preset: 'ts-jest',
    testEnvironment:'node',
    moduleFileExtensiont: ['ts','js'],
    testMatch: ['**/tests/**/*.test.(ts|js)'],
    globals:{
        'ts-jest':{
            tsconfig: 'tsconfig.json',
        }
    }
}