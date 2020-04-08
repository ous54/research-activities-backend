const Team = require('../models/team');
const Laboratory = require('../models/laboratory');

    
exports.createTeam = function(req, resp){

        Team.create(req.body)
        .then(team =>{
            resp.send(team);
        })
        .catch(error=>{
            console.log(error);
            resp.send("error");
        });
    }

        
exports.updateTeam = function(req, resp){

    Team.updateOne({_id: req.body._id}, {$set: req.body})
            .then(result=>{
                resp.send(result);
            })
            .catch(error=>{
                console.log(error);
                resp.send(error)
            })
    
}

exports.findTeam = function(req, resp){

    Team.findById(req.params._id)
                .then(team=>{
                    resp.send(team);
                })
                .catch(error=>{
                    console.log(error);
                    resp.send("error");
                })
    
}

exports.findAllTeams = function(req, resp){

   Team.find().then(teams=>{
       resp.send(teams);
   })
   .catch(error=>{
       console.log(error);
       resp.send("error");
   })
    
}

exports.deleteTeam = function(req, resp){

    Team.deleteOne({_id: req.params._id})
                .then(result=>{
                    resp.send(result);
                })
                .catch(error=>{
                    console.log(error);
                    resp.send(error);
        })
     
 }

 



