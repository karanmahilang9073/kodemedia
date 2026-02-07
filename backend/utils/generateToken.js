import jwt from 'jsonwebtoken'

const generateToken = (userId)=>{
    const decoded = jwt.sign(
        {id : userId},
        process.env.JWT_SECRET,
        {expiresIn : "7d"}
    )
    return decoded;
}
export default generateToken;