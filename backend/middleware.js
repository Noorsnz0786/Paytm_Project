const { JWT_SECRET } = require("./config");

const authMiddleWare = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startWith('Bearer'))
    {
        return res.status(403).json({msg : "invalid"})
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({})
    }
}

module.exports = {
    authMiddleWare
}