const log={
//journalisation
    logDateIpPath:(req,res,next)=>{
    const now=new Date();
    console.log(`[Le ${now.getDate()}/ ${now.getMonth()}/ ${now.getFullYear()} à ${now.getHours()}: ${now.getMinutes()}: ${now.getSeconds()} ${req.ip}] ${req.path}`);
   
    next();
},
}

module.exports=log;