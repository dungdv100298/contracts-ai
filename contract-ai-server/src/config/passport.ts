import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { IUser } from "../models/user.model";

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/auth/google/callback",
  },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const newUser = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
            profilePicture: profile.photos[0].value,
          });
          return done(null, newUser);
        }
        done(null, user);
      } catch (error) {
        done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  const user = await User.findById(id);
  done(null, user);
});
