import postgres from 'postgres'

// @ts-ignore
const sql = postgres(<string>process.env.DATABASE_URL)

export default sql
