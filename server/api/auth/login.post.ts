import { getUserByEmail, verifyPassword } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    })
  }

  const user = await getUserByEmail(email)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  setCookie(event, 'auth-token', user._id!.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return {
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  }
})
