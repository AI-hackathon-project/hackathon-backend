import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user_model.js";
import { userSchema } from "../schema/user_schema.js";


export const signup = async (req, res) => {
    const {error, value} = userSchema.validate(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    const email = value.email
    // console.log('email', email)
    
    const findIfUserExist = await userModel.findOne({email})
    if (findIfUserExist){
        return res.status(401).send('User already signed up')
    } else{
        const hashedPassword = await bcrypt.hash(value.password,12)
        value.password = hashedPassword;

        await userModel.create(value)
        return res.status(201).json({message: "Registration successful"})
    }
}


// Login user
export const login = async (req, res, next) => {
    try {
       const { username, email, password } = req.body;

        // Ensure at least email or username and password are provided
    if (!password || (!email && !username)) {
      return res.status(400).json('Email or username and password are required');
    }
    
       //  Find a user using their email or username
       const user = await userModel.findOne(
          { $or: [{ email: email}, { username: username }] }
       );
       if (!user) {
          return res.status(401).json('User does not exist')
       } else {
       // Verify user password
       const correctPass = bcrypt.compareSync(password, user.password);
       if (!correctPass) {
          return res.status(401).json('Invalid login details')
       }
       // Generate a session for the user
       req.session.user = { id: user.id };

       console.log('user', req.session.user)
       // Return response
       res.status(201).json('Login successful')
      }
    } catch (error) {
       next(error)
    }
 }

 export const logout = async (req, res, next) => {
    try {
      // Destroy user session
      await req.session.destroy();
      // Return response
      res.status(200).json("User logged out");
    } catch (error) {
      next(error);
    }
  };
 
 
 
  export const token = async (req, res, next) => {
   try {
      const { username, email, password } = req.body;
 
          //Check if email or username and password are provided
     if (!password || (!email && !username)) {
       return res.status(400).json('Email or username and password are required');
     }
 
 
      //  Find a user using their email or username
      const user = await userModel.findOne(
         { $or: [{ email: email }, { username: username }] }
      );
      if (!user) {
         return res.status(401).json('User does not exist')
      }
      // Verify user password
      const correctPass = bcrypt.compareSync(password, user.password)
      if (!correctPass) {
         return res.status(401).json('Invalid login details')
      }
      // Generate a token
      const token = jwt.sign(
       {id:user.id}, 
       process.env.JWT_PRIVATE_KEY,
       { expiresIn: '72h' }
     
     );
 
     //  console.log('user', req.session.user)
      // Return response
      res.status(201).json({
       message: 'User  logged in',
       accessToken: token,
       user: {
         firstName: user.firstName,
         lastName: user.lastName,
         username: user.username
   
       }
     });
   } catch (error) {
      next(error)
   }
 }


//  Change Password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    const userId = req.user.id; 
    const user = await userModel.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
