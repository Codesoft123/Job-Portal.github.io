import JWT  from "jsonwebtoken";

const userAuth = async(req, res , next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startWith("Bearer")){
        next("Auth failed");
}
const token = authHeader.split(" ")[1];
try{
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userid};
    next();
} catch (error){
    next('Invalid Token');
}
};
export default userAuth;