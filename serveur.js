const express = require('express');
const CryptoJS = require('crypto-js');
const app = express();
app.use(express.json());
const SECRET = "MG-AI-MODESTE-GIBSON-OFFICIAL-2026-SECRET";
function genererLicence(info){
  const expire=new Date(); expire.setDate(expire.getDate()+30);
  const data={plan:"premium",expire:expire.toISOString(),client:info.name,phone:info.phone,transaction_id:info.transaction_id,amount:2500};
  return CryptoJS.AES.encrypt(JSON.stringify(data),SECRET).toString();
}
app.post('/fedapay-webhook',(req,res)=>{
  const {status,transaction,customer}=req.body;
  if(status==='approved'){
    const code=genererLicence({name:customer.firstname,phone:customer.phone,transaction_id:transaction.id});
    console.log(`Paiement 2500F ${customer.firstname} Code:${code}`);
    return res.json({success:true,code});
  }
  res.json({success:false});
});
app.get('/',(req,res)=>res.send('MG AI SERVER OK - Modeste Gibson Officiel ✓'));
app.get('/generer/:phone/:nom',(req,res)=>{
  const code=genererLicence({name:req.params.nom,phone:req.params.phone,transaction_id:'MANUEL-'+Date.now()});
  res.json({code,expire:"30 jours"});
});
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`Server OK port ${PORT}`));
