import express, { Request, Response } from 'express';
import { claudeApi } from '../claudeApi';
import { jwtVerifier } from '../middleware/jwtVerifier';


const router = express.Router();

const models = {
    haiku_3: {
        name: "claude-3-haiku-20240307",
        max_tokens: 4096
    },
    sonnet_3_5: {
        name: "claude-3-5-sonnet-20240620",
        max_tokens: 8192
    },
    opus_3: {
        name: "claude-3-opus-20240229",
        max_tokens: 4096
    },
    sonnet_3: {
        name: "claude-3-sonnet-20240229",
        max_tokens: 4096
    }
}

router.get('/', jwtVerifier, async (req: Request, res: Response) => {
    const { user_prompt, model_name }: { user_prompt: string, model_name: string } = req.body;
    if (!user_prompt || !model_name) {
        res.status(400).json({ msg: "Not all fields have been entered." });
    } else {
        try {
            const selectedModel = Object.values(models).find(m => m.name === model_name) || null;
            if (selectedModel === null) {
                res.status(404).json({ msg: "Model not found." });
            } else {
                const response = await claudeApi(user_prompt, selectedModel);
                res.status(200).json(response);
            }
        } catch (err) {
            console.log(err)
            res.status(500).send({ msg: err.message });
        }
    }
})

export { router as claudeRouter };
