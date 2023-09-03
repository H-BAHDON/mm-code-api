import passport from "passport";

export function googleAuth (req, res) {
    passport.authenticate('google', {scope: ['email', 'profile']}(req, res) )
}


export function googleCallback(req, res, next) {
    passport.authenticate('google', {
        successRedirect: `${process.env.Client_SIDE_BASE_URL}/platform`,
        failureRedirect: '/auth/google/failure'
    })
}

export function googleFailure(req, res) {
    res.redirect(`${process.env.Client_SIDE_BASE_URL}/login`);
    res.send(`something went wrong`);
}

