module.exports = {
    isCreator: (userId,creatorId) => {
        if(userId === creatorId){
            return true
        }else{
            return false
        }
    },
    isAuthed: (req, res, next) => {
        if (req.user || req.user.roles.indexOf('Admin') !== -1) {
            next();
        } else {
            res.redirect('/login');
        }
    },
    hasRole: (role) => (req, res, next) => {
        if (req.isAuthenticated() &&
            req.user.roles.indexOf(role) > -1) {
            next();
        } else {
            res.redirect('/login');
        }
    
    },
    isAnonymous: (req, res, next) => {
        if (!req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/');
        }
    }
} 
