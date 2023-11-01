import express from "express";
import { RecipesModel } from "../models/recipeSchema.js "
import { userModel } from "../models/usersSchema.js";
import { verifyToken } from "./users.js";


const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const response = await RecipesModel.find({});
        res.json(response)
    } catch (err) {
        res.json(err);
    }
});

router.post("/",verifyToken, async (req, res) => {
    const recipe = new RecipesModel(req.body);
    try {
        const response = await recipe.save();
        res.json(response);

    } catch (err) {
        res.json(err)
    }
});

// savedrecipes

router.put("/",verifyToken, async (req,res)=>{
    try{
        const recipe = await RecipesModel.findById(req.body.recipeID);
        const user = await userModel.findById(req.body.userID);
        user.savedRecipes.push(recipe)
        await user.save()
        res.json({ savedRecipes: user.savedRecipes})
    } catch (err){
        res.json(err);
    }
});

router.get("/SavedRecipe/ids/:userID",async(req,res)=>{
    try{
        const user = await userModel.findById(req.params.userID)
        res.json({savedRecipes: user?.savedRecipes});
    } catch(err){
        res.json(err);
    }
});

router.get("/SavedRecipe/:userID", async(req,res)=>{
    try{
        const user = await userModel.findById(req.params.userID)
        const savedRecipes = await RecipesModel.find({
            _id: {$in: user.savedRecipes},
        });
        res.json({ savedRecipes });
    } catch(err){
        res.json(err);
    }
});




export { router as recipesRouter };