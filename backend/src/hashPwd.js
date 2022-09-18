import bcrypt from 'bcrypt'

export function hashPwd(password) {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}

export function comparePwd(password, hash) {
    return bcrypt.compareSync(password, hash);
}
