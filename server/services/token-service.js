const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model')
class TokenService {
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET,{expiresIn: '10m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET,{expiresIn: '4h'});
        return{
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await tokenModel.findOne({user: userId})
        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({user: userId, refreshToken})
        return token;
    }

    async removeToken(refreshToken){
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData;
    }

    async validateAccess(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        }catch (e) {
            return null;
        }
    }

    async validateRefresh(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        }catch (e) {
            return null;
        }
    }

    async findToken(refreshToken){
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData;
    }
}

module.exports = new TokenService();