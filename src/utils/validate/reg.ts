export const isEmail = (email: string) => /^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/.test(email)
