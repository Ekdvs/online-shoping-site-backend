import jwt from 'jsonwebtoken'

const generatedAccesToken =async(userId)=>{
    const token=await jwt.sign({id:userId}
        ,process.env.SECRET_KEY_ACCESS_TOKEN,
        {expiresIn:'1h'}
    )
    return token;
}

export default generatedAccesToken;