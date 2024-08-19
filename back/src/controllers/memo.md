module.exports = {
preset: "ts-jest",
testEnvironment: "node",
testMatch: ["**/__tests__/**/*.ts?(*.)+(spect|test).ts"]
}

outDir: "./build"
rootDir: ["./src"]
include:["./src/**/*.ts]
exclude:["node_modules"]

test:"jest --watch"
start:"nodemon ./src/index.ts"

npm i dotenv express mysql2 sequelize sequelize-typescript
npm i -D @types/express @types/jest @types/node @types/supertest |
npm i -D jest ts-node jest-node supertest typescript nodemon
